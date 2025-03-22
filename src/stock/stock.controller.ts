import { Controller, Get, Param, Put } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get(':symbol')
  findOne(@Param('symbol') symbol: string) {
    return this.stockService.findOne(symbol);
  }

  @Put(':symbol')
  update(@Param('symbol') symbol: string) {
    return this.stockService.create(symbol);
  }
}
