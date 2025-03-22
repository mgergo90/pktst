import { Test, TestingModule } from '@nestjs/testing';
import { StockService } from './stock.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { PollingService } from './polling.serive';
import { SymbolService } from './symbol.service';

describe('StockService', () => {
  let service: StockService;

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

    service = module.get<StockService>(StockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
