import { SupportedTokenType, NftAssetOriginal, NftAsset } from 'src/typings';

export const SUPPORTED_TOKENS_TYPES: SupportedTokenType[] = [
  'ERC20',
  'ERC721',
  'ERC1155',
];

interface GetWalletAssetsOptions {
  address: string;
  contractAddress?: string;
  chain?: string;
  cursor?: string;
  limit?: number;
  includeNonStandardTokenTypes?: boolean;
}

interface GetWalletAssetsRes {
  data: NftAsset[];
  nextCursor: string;
}

const nftItemFragment = `
  contractAddress
  tokenId
  contract {
    standard
    name
  }
  metadata {
    name
    description
    imageUrl
    imageCacheUrl
    imageCachePreviewUrl
    imageCacheThumbnailUrl
  }
`;

const transformNftAssetData = ({ contractAddress, contract, ...rest }: NftAssetOriginal): NftAsset => {
  return { ...rest, tokenAddress: contractAddress, type: contract.standard, name: contract.name };
};

const transformNftAssets = (nfts: NftAssetOriginal[], includeNonStandardTokenTypes = false) => {
  const transformedData = nfts.map(transformNftAssetData);
  return includeNonStandardTokenTypes
    ? transformedData
    : transformedData.filter((a) => SUPPORTED_TOKENS_TYPES.includes(a.type));
};

export const getWalletAssets = ({
  address,
  contractAddress,
  chain,
  cursor,
  limit = 50,
  includeNonStandardTokenTypes,
}: GetWalletAssetsOptions): Promise<GetWalletAssetsRes> => {
  return fetch('https://api.gomu.xyz/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'gomu-api-key': process.env.REACT_APP_GOMU_API_KEY || '',
    },
    body: JSON.stringify({
      query: `
        query NftsByWallet($address: String!, $contractAddress: String, $chain: String, $cursor: String, $limit: Int) {
          nftsByWallet(address: $address, contractAddress: $contractAddress, chain: $chain, cursor: $cursor, limit: $limit) {
            data {
              ${nftItemFragment}
            }
            nextCursor
          }
        }
      `,
      variables: { address, contractAddress, chain, cursor, limit },
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      const { data: nfts, nextCursor } = res?.data?.nftsByWallet;
      return { data: transformNftAssets(nfts, includeNonStandardTokenTypes), nextCursor };
    })
};

interface GetNftsByTokenOptions {
  contractAddress: string;
  tokenId?: string;
  chain?: string;
  cursor?: string;
  limit?: number;
  includeTraits?: boolean;
  includeLastTransfer?: boolean;
  includeNonStandardTokenTypes?: boolean;
}

export const getNftsByToken = ({
  contractAddress,
  tokenId,
  chain,
  cursor,
  limit,
  includeNonStandardTokenTypes,
}: GetNftsByTokenOptions): Promise<GetWalletAssetsRes> => {
  return fetch('https://api.gomu.xyz/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'gomu-api-key': process.env.REACT_APP_GOMU_API_KEY || '',
    },
    body: JSON.stringify({
      query: `
        query NftsByToken($contractAddress: String!, $tokenId: String, $chain: String, $cursor: String, $limit: Int) {
          nftsByToken(contractAddress: $contractAddress, tokenId: $tokenId, chain: $chain, cursor: $cursor, limit: $limit) {
            data {
              ${nftItemFragment}
            }
            nextCursor
          }
        }
      `,
      variables: { contractAddress, tokenId, chain, cursor, limit },
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      const { data: nfts = [], nextCursor } = res?.data?.nftsByToken || {};
      return { data: transformNftAssets(nfts, includeNonStandardTokenTypes), nextCursor };
    })
};
