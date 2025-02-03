export interface Holders {
  address: string;
  balance: number;
  classification: string;
  telegram_handle: string;
  total_incoming: number;
  total_outgoing: number;
  x_handle: string;
}

export interface MultiType {
  [key: string]: any;
}

export interface Info {
  currentPrice: string;
  priceChange: number;
  marketCap: number;
  liquidity: number;
}
