import { BigNumber } from 'bignumber.js';
import { TokenInfo, MarketplaceConfig, BreakpointsConfigItem, MarketplaceName, OpenseaOrder, LooksRareOrder, TraderOrder } from './types';

export const SHARED_STOREFRONT_CONTRACT_ADDRESS = '0x495f947276749ce646f68ac8c248420045cb7b5e';

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
  137: [
    {
      symbol: 'MATIC',
      address: '0x0000000000000000000000000000000000001010',
      decimals: 18,
      imgUrl: 'https://polygonscan.com/token/images/matic_32.png',
    }
  ],
};

export const MARKETPLACES: MarketplaceConfig[] = [
  {
    key: MarketplaceName.Opensea,
    label: 'OpenSea',
    imgUrl: 'https://i.imgur.com/5RxA58Z.png',
    getNormalizedOrder: (originalOrder) => {
      const { orderHash, makerAssetBundle, takerAssetBundle, currentPrice, side } = originalOrder.marketplaceOrder as OpenseaOrder['marketplaceOrder'];
      const asset = side === 'ask' ? makerAssetBundle.assets[0] : takerAssetBundle.assets[0];
      const paymentAsset = side === 'ask' ? takerAssetBundle.assets[0] : makerAssetBundle.assets[0];

      return {
        id: `${MarketplaceName.Opensea}${ORDER_ID_SEPARATOR}${orderHash}`,
        asset: {
          contractAddress: asset.assetContract.address,
          tokenId: asset.tokenId!,
          type: asset.assetContract.schemaName,
          amount: '1',
        },
        erc20Asset: {
          contractAddress: paymentAsset.assetContract.address,
          amount: new BigNumber(currentPrice).toString(),
        },
      };
    },
    getOrderById: (orders, id) => {
      return (orders as OpenseaOrder[]).find((o) => o.marketplaceName === 'opensea' && o.marketplaceOrder.orderHash === id);
    },
    buildExternalLink: (order, chainId) => {
      if (!order) return '';
      const { marketplaceOrder } = order as OpenseaOrder;
      if (!marketplaceOrder) return '';
      const { side, makerAssetBundle, takerAssetBundle } = marketplaceOrder;
      const asset = side === 'ask' ? makerAssetBundle.assets[0] : takerAssetBundle.assets[0];
      const baseUrl = chainId === 4
        ? 'https://testnets.opensea.io/assets/rinkeby/'
        : 'https://opensea.io/assets/ethereum/';

      return `${baseUrl}${asset.assetContract.address}/${asset.tokenId}`;
    },
  },
  {
    key: MarketplaceName.Looksrare,
    label: 'LooksRare',
    imgUrl: 'https://i.imgur.com/lB9iJ7A.png',
    getNormalizedOrder: (originalOrder) => {
      const { hash, collectionAddress, tokenId, amount, currencyAddress, price } = originalOrder.marketplaceOrder as LooksRareOrder['marketplaceOrder'];
      return {
        id: `${MarketplaceName.Looksrare}${ORDER_ID_SEPARATOR}${hash}`,
        asset: {
          contractAddress: collectionAddress,
          tokenId,
          amount,
        },
        erc20Asset: {
          contractAddress: currencyAddress,
          amount: new BigNumber(price).toString(),
        },
      };
    },
    getOrderById: (orders, id) => {
      return (orders as LooksRareOrder[]).find((o) => o.marketplaceName === 'looksrare' && o.marketplaceOrder.hash === id);
    },
    buildExternalLink: (order, chainId) => {
      if (!order) return '';
      const { marketplaceOrder } = order as LooksRareOrder;
      if (!marketplaceOrder) return '';
      const { collectionAddress, tokenId } = marketplaceOrder;
      const baseUrl = `https://${chainId === 4 ? 'rinkeby.' : ''}looksrare.org/collections/`;

      return `${baseUrl}${collectionAddress}/${tokenId}`;
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
    range: [0, 480],
    assetsPerRow: 2,
    compactAssetsPerRow: 3,
    gridGap: '16px 24px',
    compactGridGap: '12px',
    compactGridAssetFooterHeight: '28px',
    listingHeaderNavSidePad: '28px',
  },
  {
    range: [481, 960],
    assetsPerRow: 3,
    compactAssetsPerRow: 4,
    gridGap: '16px 40px',
    compactGridGap: '16px',
    listingHeaderNavSidePad: '56px',
  },
  {
    range: [961, 1400],
    assetsPerRow: 5,
    gridGap: '16px 40px',
  },
  {
    range: [1401],
    assetsPerRow: 6,
    gridGap: '16px 40px',
  }
];
