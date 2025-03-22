import { Controller, Get, Param, Put } from '@nestjs/common';
import { StockService } from './stock.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get(':symbol')
  @ApiOperation({ summary: 'Get the moving avarege of a symbol' })
  @ApiResponse({
    status: 200,
    description: 'Get the moving avarege of a symbol',
    examples: {
      'application/json': {
        summary: 'Get the moving avarege of a symbol',
        value: {
          symbol: 'IBM',
          id: 2,
          createdAt: '2025-03-22T12:32:57.537Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description:
      'There is not enough data collected to calculate the moving average',
    examples: {
      'Not enough data': {
        summary:
          'There is not enough data collected to calculate the moving average',
        value: {
          statusCode: 404,
          message: 'Not enough data collected',
        },
      },
      'No data for selected symbol': {
        summary:
          'Trying to access a symbol that is not in the list of watched symbols',
        value: {
          statusCode: 404,
          message: 'Symbol not found',
        },
      },
    },
  })
  findOne(@Param('symbol') symbol: string) {
    return this.stockService.findOne(symbol);
  }

  @ApiOperation({ summary: 'Start polling prices for a symbol' })
  @ApiResponse({
    status: 200,
    description: 'Get the moving avarege of a symbol',
    examples: {
      'application/json': {
        summary: 'Get the moving avarege of a symbol',
        value: {
          symbol: 'IBM',
          id: 2,
          createdAt: '2025-03-22T12:32:57.537Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description:
      'Trying to add a watcher for a symbol that already in the list',
    examples: {
      'application/json': {
        summary:
          'Trying to add a watcher for a symbol that already in the list',
        value: {
          statusCode: 409,
          message: 'Invalid symbol or data not found',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Symbol does not found in 3rd party API',
    examples: {
      'application/json': {
        summary: 'Symbol does not found in 3rd party API',
        value: {
          statusCode: 500,
          message: 'Invalid symbol or data not found',
        },
      },
    },
  })
  @Put(':symbol')
  update(@Param('symbol') symbol: string) {
    return this.stockService.create(symbol);
  }
}
