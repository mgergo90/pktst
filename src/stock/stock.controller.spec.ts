import { Test, TestingModule } from '@nestjs/testing';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { PollingService } from './polling.serive';
import { SymbolService } from './symbol.service';

describe('StockController', () => {
  let controller: StockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockController,
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

    controller = module.get<StockController>(StockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
