import { MarketplaceName, Order as GomuOrder, TraderOrder, OpenseaOrder } from '@gomuweb3/sdk/lib/types';
import { SupportedTokenType } from 'src/typings';

export { MarketplaceName };
export type { GomuOrder, TraderOrder, OpenseaOrder };

export interface OrderError {
  marketplaceName: MarketplaceName;
  error: string;
}

export interface MarketplaceConfig {
  key: MarketplaceName;
  label: string;
  imgUrl: string;
  linkBuilder?: (order?: GomuOrder) => string;
  getOrderById: (orders: GomuOrder[], id: string) => GomuOrder | undefined;
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
  orders: Array<GomuOrder | OrderError>;
}

export interface TokenInfo {
  symbol: string;
  address: string;
  decimals: number;
  imgUrl: string;
  notSelectable?: boolean;
}
