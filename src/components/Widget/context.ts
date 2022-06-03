import { createContext } from 'react';
import { Gomu } from '@gomuweb3/sdk';
import { TokenInfo } from './types';

interface WidgetContextInterface {
  userAddress: string;
  chainId: number;
  gomuSdk: Gomu;
  erc20Tokens: TokenInfo[];
  maxSelectableAssets: number;
}

export const WidgetContext = createContext<WidgetContextInterface | null>(null);
