import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Observable,
  from,
  mergeMap,
  catchError,
  retry,
  EMPTY,
  of,
  tap,
} from 'rxjs';
import { Repository } from 'typeorm';
import { Symbol } from './entities/symbol.entity';
import { Stock } from './entities/stock.entity';
import { SymbolService } from './symbol.service';
import { StockResponse } from './api.interface';

@Injectable()
export class PollingService {
  private readonly logger = new Logger(PollingService.name);
  constructor(
    private readonly symbolService: SymbolService,
    @InjectRepository(Symbol)
    private symbolRepository: Repository<Symbol>,

    @InjectRepository(Stock)
    private stockPriceRepository: Repository<Stock>,
  ) {}

  @Cron('*/1 * * * *') // Cron expression to run every minute
  processSymbols() {
    this.batchProcessSymbols().subscribe();
  }

  batchProcessSymbols(): Observable<null> {
    this.logger.log('Starting batch job...');
    return from(this.symbolRepository.find()).pipe(
      mergeMap((symbols) => {
        this.logger.log(`Runing batch job for ${symbols.length} symbols...`);
        return from(symbols).pipe(
          mergeMap(
            (symbol) =>
              this.fetchStockData(symbol.symbol).pipe(
                mergeMap((stockData) => {
                  const newStock = new Stock();
                  newStock.symbol_id = symbol;
                  newStock.price = Number(stockData.price);
                  newStock.timestamp = stockData.timestamp;
                  return from(this.stockPriceRepository.save(newStock)).pipe(
                    mergeMap((saved) => {
                      this.logger.log(
                        `Saved stock price for ${symbol.symbol} with id: ${saved.id}`,
                      );
                      return of(null);
                    }),
                    catchError((error) => {
                      // possible error due to duplication
                      this.logger.error(
                        `Failed to save stock data for symbol ${symbol.symbol}, ${(error as Error)?.message}`,
                      );
                      return EMPTY;
                    }),
                  );
                }),
                catchError((error) => {
                  this.logger.error(
                    `Failed to process symbol ${symbol.symbol}:`,
                    error,
                  );
                  return EMPTY;
                }),
              ),
            20,
          ),
        );
      }),
      tap(() => {
        this.logger.log('Batch job completed.');
      }),
    );
  }

  private fetchStockData(symbol: string) {
    return new Observable<StockResponse>((observer) => {
      this.logger.log(`Fetching stock price for ${symbol}...`);
      this.symbolService
        .getStockPrice(symbol)
        .then((result) => {
          this.logger.log(`Fetching stock price for ${symbol} is completed.`);
          observer.next(result);
          observer.complete();
        })
        .catch((error) => {
          this.logger.error(
            `Fetching stock price failed for ${symbol}, ${error}`,
          );
          observer.error(error);
        });
    }).pipe(retry(2));
  }
}
