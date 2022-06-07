import { BigNumber } from 'bignumber.js';
import { TokenInfo, MarketplaceConfig, BreakpointsConfigItem, MarketplaceName, OpenseaOrder, TraderOrder } from './types';

export const ORDER_ID_SEPARATOR = '__';

export const ERC20_TOKENS: Record<number, TokenInfo[]> = {
  1: [
    {
      symbol: 'WETH',
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      decimals: 18,
      imgUrl: 'https://openseauserdata.com/files/accae6b6fb3888cbff27a013729c22dc.svg',
    },
    {
      symbol: 'APE',
      address: '0x4d224452801aced8b2f0aebe155379bb5d594381',
      decimals: 18,
      imgUrl: 'https://lh3.googleusercontent.com/mkqhiVl1_aEJWznOYPJjwKiZjWw4gUnGfBxMcPO96JYVBrlhGhyiPQX7YouGObqom5F_fJOnsalw3TK6nJ92Ijctkcw9egWMxVj6vqQ=s120',
    },
    {
      symbol: 'DAI',
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      decimals: 18,
      imgUrl: 'https://openseauserdata.com/files/dai-ethereum.svg',
    },
    {
      symbol: 'USDC',
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      decimals: 6,
      imgUrl: 'https://openseauserdata.com/files/749015f009a66abcb3bbb3502ae2f1ce.svg',
    },
    {
      symbol: 'LINK',
      address: '0x514910771af9ca656af840dff83e8264ecf986ca',
      decimals: 18,
      imgUrl: 'https://lh3.googleusercontent.com/ExQJMS8JzvhjJl0UlQWsBH3AiQvVjMMmP7-Pb4ZhSVQbWD-X9zaxRD5r7wrKHJk4tpwtUfemmpeEm7NJekun0U9b',
    },
    {
      symbol: 'ETH',
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      imgUrl: 'https://openseauserdata.com/files/6f8e2979d428180222796ff4a33ab929.svg',
      notSelectable: true,
    },
  ],
  4: [
    {
      symbol: 'WETH',
      address: '0xc778417e063141139fce010982780140aa0cd5ab',
      decimals: 18,
      imgUrl: 'https://openseauserdata.com/files/accae6b6fb3888cbff27a013729c22dc.svg',
    },
  ],
};

export const MARKETPLACES: MarketplaceConfig[] = [
  {
    key: MarketplaceName.Opensea,
    label: 'OpenSea',
    imgUrl: 'https://i.imgur.com/5RxA58Z.png',
    getNormalizedOrder: (originalOrder) => {
      const { hash, asset, quantity, paymentToken, basePrice } = originalOrder.marketplaceOrder as OpenseaOrder['marketplaceOrder'];
      return {
        id: `${MarketplaceName.Opensea}${ORDER_ID_SEPARATOR}${hash}`,
        asset: {
          contractAddress: asset!.tokenAddress,
          tokenId: asset!.tokenId!,
          type: asset!.assetContract.schemaName,
          amount: new BigNumber(quantity).toString(),
        },
        erc20Asset: {
          contractAddress: paymentToken,
          amount: new BigNumber(basePrice).toString(),
        },
      };
    },
    getOrderById: (orders, id) => {
      return (orders as OpenseaOrder[]).find((o) => o.marketplaceName === 'opensea' && o.marketplaceOrder.hash === id);
    },
    buildExternalLink: (order, chainId) => {
      if (!order) return '';
      const { marketplaceOrder } = order as OpenseaOrder;
      if (!marketplaceOrder) return '';
      const { tokenAddress, tokenId } = marketplaceOrder.asset!;
      const baseUrl = chainId === 4
        ? 'https://testnets.opensea.io/assets/rinkeby/'
        : 'https://opensea.io/assets/ethereum/';

      return `${baseUrl}${tokenAddress}/${tokenId}`;
    },
  },
  {
    key: MarketplaceName.Trader,
    label: '0x Protocol',
    imgUrl: 'https://i.imgur.com/IHcxsAB.png',
    getNormalizedOrder: (originalOrder) => {
      const order = originalOrder.marketplaceOrder as TraderOrder['marketplaceOrder'];
      return {
        id: `${MarketplaceName.Trader}${ORDER_ID_SEPARATOR}${order.order.nonce}`,
        asset: {
          contractAddress: order.nftToken,
          tokenId: order.nftTokenId,
          type: order.nftType,
          amount: order.nftTokenAmount,
        },
        erc20Asset: {
          contractAddress: order.erc20Token,
          amount: order.erc20TokenAmount,
        },
      };
    },
    getOrderById: (orders, id) => {
      return (orders as TraderOrder[]).find((o) => o.marketplaceName === 'trader' && o.marketplaceOrder.order.nonce === id);
    },
  },
];

export const BREAKPOINTS_CONFIG: BreakpointsConfigItem[] = [
  {
    range: '0-480',
    assetsPerRow: 2,
    compactAssetsPerRow: 3,
    gridGap: '16px 24px',
    compactGridGap: '12px',
  },
  {
    range: '481-960',
    assetsPerRow: 3,
    compactAssetsPerRow: 4,
    gridGap: '16px 40px',
    compactGridGap: '16px',
  },
  {
    range: '961',
    assetsPerRow: 5,
    gridGap: '16px 40px',
  }
];
