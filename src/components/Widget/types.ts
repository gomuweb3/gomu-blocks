import { SupportedTokenType } from 'src/typings';

export type MarketplaceName = 'opensea' | 'trader';

export interface MarketplaceConfig {
  key: MarketplaceName;
  label: string;
  imgUrl: string;
}

export interface PrimitiveAsset {
  id: string;
  type: SupportedTokenType;
  name?: string;
  img?: string;
}

export interface PricedAsset extends PrimitiveAsset {
  amount: string;
  paymentTokenAddress: string;
  selectedMarketplaces: MarketplaceName[];
  orders: any[];
}

export interface TokenInfo {
  symbol: string;
  address: string;
  decimals: number;
  imgUrl: string;
}
