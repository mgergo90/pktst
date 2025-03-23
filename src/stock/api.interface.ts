export interface ApiResponse {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

export interface StockResponse {
  symbol: string;
  price: number;
  timestamp: string;
}

export interface StockAvarageResponse {
  symbol: string;
  average: number;
  price: number;
  updated: Date;
}
