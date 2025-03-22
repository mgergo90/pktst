import { Test, TestingModule } from '@nestjs/testing';
import { StockService } from './stock.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Symbol } from './entities/symbol.entity';
import { Stock } from './entities/stock.entity';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { SymbolService } from './symbol.service';
import { PollingService } from './polling.serive';

describe('StockService', () => {
  let pollingService: PollingService;
  let symbolService: SymbolService;
  let symbolRepository: Repository<Symbol>;
  let stockRepository: Repository<Stock>;
  let symbol: Symbol;
  let symbols: Symbol[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        SymbolService,
        PollingService,
        {
          provide: getRepositoryToken(Symbol),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Stock),
          useClass: Repository,
        },
      ],
    }).compile();

    symbolService = module.get<SymbolService>(SymbolService);
    pollingService = module.get<PollingService>(PollingService);
    symbolRepository = module.get<Repository<Symbol>>(
      getRepositoryToken(Symbol),
    );
    stockRepository = module.get<Repository<Stock>>(getRepositoryToken(Stock));

    symbol = new Symbol();
    symbol.id = 1;
    symbol.symbol = 'IBM';
    symbols = [symbol];

    jest.spyOn(symbolRepository, 'find').mockResolvedValue(symbols);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('processSymbols', () => {
    it.only('should retry the API call twice before failing', async () => {
      const stock = new Stock();
      stock.symbol_id = symbol;
      stock.price = 100.0;
      stock.timestamp = '2025-03-21T13:29:42';

      // Mock the axios call to fail twice and then succeed
      const getStockPrice = jest
        .spyOn(symbolService, 'getStockPrice')
        .mockRejectedValueOnce(new Error('Temporary network failure'))
        .mockRejectedValueOnce(new Error('Temporary network failure'))
        .mockResolvedValue({
          symbol: symbol.symbol,
          price: stock.price,
          timestamp: stock.timestamp,
        });

      // Mock the save function for StockRepository
      const saveStockMock = jest
        .spyOn(stockRepository, 'save')
        .mockResolvedValue(stock); // Mock successful save

      // Execute the processSymbols method
      await firstValueFrom(pollingService.batchProcessSymbols());

      // Ensure that the axios call was retried twice before succeeding
      expect(getStockPrice).toHaveBeenCalledTimes(3); // 1 initial call + 2 retries

      // Ensure that the stock price data was saved in the database
      expect(saveStockMock).toHaveBeenCalledTimes(1); // Only one save should be called
      expect(saveStockMock).toHaveBeenCalledWith(stock);
    });

    it('should fail after 2 retries if API call fails', async () => {
      // Mock the axios call to fail twice and never succeed
      const getStockPrice = jest
        .spyOn(symbolService, 'getStockPrice')
        .mockRejectedValue(new Error('Temporary network failure'));

      // Mock the save function for StockRepository
      const saveStockMock = jest.spyOn(stockRepository, 'save');

      // Execute the processSymbols method and expect it to throw an error
      await expect(
        firstValueFrom(pollingService.batchProcessSymbols()),
      ).rejects.toThrow('Temporary network failure');

      // Ensure that the axios call was retried twice before the failure
      expect(getStockPrice).toHaveBeenCalledTimes(2); // 2 retries should happen
      expect(saveStockMock).toHaveBeenCalledTimes(0); // No data should be saved since the API call failed
    });

    it('should process symbols successfully without retry if API call succeeds', async () => {
      const stock = new Stock();
      stock.symbol_id = symbol;
      stock.price = 100.0;
      stock.timestamp = '2025-03-21T13:29:42';

      // Mock the axios call to fail twice and then succeed
      const getStockPrice = jest
        .spyOn(symbolService, 'getStockPrice')
        .mockResolvedValue({
          symbol: symbol.symbol,
          price: stock.price,
          timestamp: stock.timestamp,
        });
      // Mock the save function for StockRepository
      const saveStockMock = jest
        .spyOn(stockRepository, 'save')
        .mockResolvedValue(stock); // Mock successful save

      // Execute the processSymbols method
      await firstValueFrom(pollingService.batchProcessSymbols());

      // Ensure that the axios call was made only once (no retries)
      expect(getStockPrice).toHaveBeenCalledTimes(1); // Only one attempt
      expect(saveStockMock).toHaveBeenCalledTimes(1); // Data should be saved
    });
  });
});
