import { TokenInfo, MarketplaceConfig, MarketplaceName } from './types';

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
  },
  {
    key: MarketplaceName.Trader,
    label: '0x Protocol',
    imgUrl: 'https://i.imgur.com/IHcxsAB.png',
  },
];
