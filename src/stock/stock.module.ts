import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { SymbolService } from './symbol.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Symbol } from './entities/symbol.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { PollingService } from './polling.serive';

@Module({
  controllers: [StockController],
  providers: [StockService, SymbolService, PollingService],
  imports: [
    TypeOrmModule.forFeature([Stock, Symbol]),
    ScheduleModule.forRoot(),
  ],
})
export class StockModule {}
