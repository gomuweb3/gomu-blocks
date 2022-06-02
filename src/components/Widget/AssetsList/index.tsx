import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import cn from 'classnames';
import { getWalletAssets } from 'src/api';
import { getAssetId, getImgFromAsset, rangeFromZero } from 'src/utils';
import { NftAsset } from 'src/typings';
import { PrimitiveAsset } from '../types';
import s from './styles.module.scss';

const AssetsList = ({
  userAddress,
  chainId,
  selectedIds,
  isStatic,
  isCompact,
  assetsPerRow = 2,
  maxSelectableAssets = 4,
  onSelect,
}: {
  userAddress: string;
  chainId: number;
  selectedIds?: string[];
  isStatic?: boolean;
  isCompact?: boolean;
  assetsPerRow?: number;
  maxSelectableAssets?: number; // -1 for unlimited
  onSelect?: (assets: PrimitiveAsset[]) => void;
}) => {
  const [selectedAssets, setSelectedAssets] = useState<PrimitiveAsset[]>([]);

  const { data: walletAssets, isLoading: assetsLoading } = useQuery(
    ['walletAssets', userAddress, chainId],
    () => getWalletAssets({ address: userAddress }),
    { enabled: !!userAddress },
  );

  const convertToPrimitiveAsset = (asset: NftAsset) => {
    const id = getAssetId(asset);
    const img = getImgFromAsset(asset);
    const { name } = asset.metadata || {};

    return { id, type: asset.type, img, name } as PrimitiveAsset;
  };

  useEffect(() => {
    if (selectedIds && selectedIds.length !== selectedAssets.length) {
      const newAssets = walletAssets?.data.reduce((acc, asset) => {
        const id = getAssetId(asset);
        if (!selectedIds.includes(id)) {
          return acc;
        }

        acc.push(convertToPrimitiveAsset(asset));
        return acc;
      }, [] as PrimitiveAsset[]) || [];
      setSelectedAssets(newAssets);
    }
  }, [selectedIds]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAssetSelect = (_asset: NftAsset) => {
    if (isStatic) return;

    const asset = convertToPrimitiveAsset(_asset);

    const newSelectedAssets = selectedAssets.find((a) => a.id === asset.id)
      ? selectedAssets.filter((a) => a.id !== asset.id)
      : selectedAssets.concat(asset);

    if (maxSelectableAssets > 0 && newSelectedAssets.length > maxSelectableAssets) {
      // TODO trigger animation
      return;
    }

    setSelectedAssets(newSelectedAssets);
    onSelect?.(newSelectedAssets);
  };

  return (
    <div
      className={cn(s.assets, { [s._static]: isStatic, [s._compact]: isCompact })}
      style={{ '--items-per-row': assetsPerRow } as any}
    >
      {assetsLoading
        ? rangeFromZero(6).map((index) => {
          return (
            <div
              key={index}
              className={cn(s.assetsItem, 'g-processing')}
            >
              <div className={s.assetsItemImg} />
              <div className={s.assetsItemContent} />
            </div>
          );
        })
        : walletAssets?.data.map((asset) => {
            const id = getAssetId(asset);
            const img = getImgFromAsset(asset);
            const tokenId = `#${asset.tokenId}`;

            return (
              <div
                key={id}
                className={cn(
                  s.assetsItem,
                  { [s._selected]: !!selectedAssets.find((a) => a.id === id) },
                )}
                onClick={() => handleAssetSelect(asset)}
              >
                <div className={s.assetsItemImg}>
                  {img ? <img src={img} alt="" /> : <div />}
                </div>
                <div className={s.assetsItemContent}>
                  <p title={tokenId}>{tokenId}</p>
                </div>
              </div>
            );
          })
      }
    </div>
  );
};

export default AssetsList;
