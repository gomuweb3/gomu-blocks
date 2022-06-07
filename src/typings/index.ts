export type SupportedTokenType = 'ERC20' | 'ERC721' | 'ERC1155';

export interface NftAssetMetadata {
  name: string;
  description: string;
  imageUrl: string;
  imageCacheUrl: string;
  imageCachePreviewUrl: string;
  imageCacheThumbnailUrl: string;
}

export interface NftAssetOriginal {
  contractAddress: string;
  tokenId: string;
  contract: {
    standard: SupportedTokenType;
    name: string;
  }
  metadata?: NftAssetMetadata;
}

export interface NftAsset {
  tokenAddress: string;
  tokenId: string;
  type: SupportedTokenType;
  name: string;
  metadata?: NftAssetMetadata;
}
