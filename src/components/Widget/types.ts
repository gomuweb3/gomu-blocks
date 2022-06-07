import { MarketplaceName, Order as GomuOrder, TraderOrder, OpenseaOrder } from '@gomuweb3/sdk/lib/types';
import { SupportedNftType } from 'src/typings';

export { MarketplaceName };
export type { GomuOrder, TraderOrder, OpenseaOrder };

export interface OrderError {
  marketplaceName: MarketplaceName;
  error: string;
}

export interface NormalizedOrder {
  id: string;
  asset: {
    contractAddress: string;
    tokenId: string;
    type: string;
    amount: string;
  };
  erc20Asset: {
    contractAddress: string;
    amount: string;
  };
}

export interface MarketplaceConfig {
  key: MarketplaceName;
  label: string;
  imgUrl: string;
  getNormalizedOrder: (order: GomuOrder) => NormalizedOrder;
  getOrderById: (orders: GomuOrder[], id: string) => GomuOrder | undefined;
  buildExternalLink?: (order?: GomuOrder, chainId?: number) => string;
}

export interface PrimitiveAsset {
  id: string;
  type: SupportedNftType;
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

export interface BreakpointsConfigItem {
  range: string;
  assetsPerRow: number;
  compactAssetsPerRow?: number;
  gridGap: string;
  compactGridGap?: string;
}
