import { HttpException, Injectable } from '@nestjs/common';
import { SymbolService } from './symbol.service';
import { Symbol } from './entities/symbol.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpStatusCode } from 'axios';
import { StockAvarageResponse } from './api.interface';
import { Stock } from './entities/stock.entity';

@Injectable()
export class StockService {
  constructor(
    private readonly symbolService: SymbolService,
    @InjectRepository(Symbol) private symbolRepository: Repository<Symbol>,
    @InjectRepository(Stock) private stockRepository: Repository<Stock>,
  ) {}

  async create(symbol: string) {
    const result = await this.symbolService.getStockPrice(symbol);
    if (result.symbol) {
      const alreadyExists = await this.symbolRepository.findOne({
        where: { symbol },
      });
      if (alreadyExists) {
        throw new HttpException(
          'Already polling for that symbol',
          HttpStatusCode.Conflict,
        );
      }
      return await this.symbolRepository.save({ symbol });
    }
  }

  async findOne(symbol: string): Promise<StockAvarageResponse> {
    const result = await this.symbolRepository.findOne({
      where: { symbol },
    });
    if (!result) {
      throw new HttpException('Symbol not found', HttpStatusCode.NotFound);
    }
    const stocks = await this.stockRepository.find({
      where: { symbol_id: { id: result.id } },
      order: { created: 'DESC' },
      take: 10,
    });

    if (stocks.length < 10) {
      throw new HttpException(
        'Not enough data collected',
        HttpStatusCode.NotFound,
      );
    }
    return {
      symbol,
      price: +stocks[0].price,
      updated: stocks[0].created,
      average:
        Math.round(
          (stocks.reduce((acc, curr) => acc + +curr.price, 0) / stocks.length) *
            100,
        ) / 100,
    };
  }
}
