export type SupportedNftType = 'ERC721' | 'ERC1155';

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
  contractStandard: string;
  tokenId: string;
  metadata?: NftAssetMetadata;
}

export interface NftAsset {
  tokenAddress: string;
  tokenId: string;
  type: string;
  name: string;
  metadata?: NftAssetMetadata;
}
