export interface PrimitiveAsset {
  id: string;
  name?: string;
  img?: string;
}

export interface PricedAsset extends PrimitiveAsset {
  amount: string;
  paymentTokenAddress: string;
  selectedMarketplaces: string[];
}

export interface TokenInfo {
  symbol: string;
  address: string;
  decimals: number;
  imgUrl: string;
}
