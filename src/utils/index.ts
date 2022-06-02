import { BigNumber } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { NftAsset } from 'src/typings';

export const cutAddress = (adr: string, left = 6, right = 4) => {
  return `${adr.slice(0, left)}...${adr.slice(right * -1)}`;
};

export const getConnectionInfo = async () => {
  const provider = new Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const { chainId } = await provider.getNetwork();
  const address = await signer.getAddress();
  return { address, chainId };
};

export const rangeFromZero = (numOfItems: number): number[] => {
  return Array.from(Array(numOfItems).keys());
};

type ImageSize = 'thumbnail' | 'preview' | 'original';

const enum ImageSizeKey {
  thumbnail = 'imageCacheThumbnailUrl',
  preview = 'imageCachePreviewUrl',
  original = 'imageCacheUrl',
}

const imageSizeMapping = {
  thumbnail: ImageSizeKey.thumbnail,
  preview: ImageSizeKey.preview,
  original: ImageSizeKey.original,
};

export const getImgFromAsset = (asset?: NftAsset, size: ImageSize = 'thumbnail') => {
  if (!asset) return '';
  const imageSizeKey = imageSizeMapping[size];
  const imgUrl = asset.metadata?.[imageSizeKey] || asset.metadata?.imageCacheUrl || asset.metadata?.imageUrl || '';
  return imgUrl.startsWith('ipfs://') ? `https://cloudflare-ipfs.com/ipfs/${imgUrl.slice(7)}` : imgUrl;
};

export const getAssetId = (asset: { tokenAddress: string; tokenId: string | null; }) => {
  return `${asset.tokenAddress?.toLowerCase()}-${asset.tokenId?.toLowerCase()}`;
};

export const parseAssetId = (id: string) => {
  const [tokenAddress, tokenId] = id.split('-');
  return { tokenAddress, tokenId };
};

export const toBaseUnitAmount = (value: number | string, decimals = 0) => {
  const amount = BigNumber.from(value);
  const unit = BigNumber.from(10).pow(decimals);
  const baseUnitAmount = amount.mul(unit);
  return String(baseUnitAmount);
};
