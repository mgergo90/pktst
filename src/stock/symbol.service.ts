import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { ApiResponse, StockResponse } from './api.interface';

@Injectable()
export class SymbolService {
  private readonly apiKey = process.env.API_KEY;
  private readonly baseUrl = process.env.API_URL;

  constructor() {
    if (!this.apiKey || !this.baseUrl) {
      throw new HttpException(
        'API_KEY or ALPHA_VANTAGE_API_URL is not set',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getStockPrice(symbol: string): Promise<StockResponse> {
    try {
      const url = `${this.baseUrl}/quote?symbol=${symbol}&token=${this.apiKey}`;
      const response = await axios.get<ApiResponse>(url);
      const { data } = response;

      if (!data || !data.c) {
        throw new HttpException(
          'Invalid symbol or data not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        symbol,
        price: data.c,
        timestamp: new Date(data.t * 1000).toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        (error as Error)?.message || 'Error fetching stock data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
