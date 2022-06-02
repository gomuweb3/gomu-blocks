import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import cn from 'classnames';
import { getWalletAssets } from 'src/api';
import { getAssetId, getImgFromAsset } from 'src/utils';
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

  useEffect(() => {
    if (selectedIds && selectedIds.length !== selectedAssets.length) {
      const newIds = selectedAssets.filter((a) => selectedIds.includes(a.id));
      setSelectedAssets(newIds);
    }
  }, [selectedIds]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAssetSelect = (asset: PrimitiveAsset) => {
    if (isStatic) return;

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
        ? null // TODO add loading placeholders
        : walletAssets?.data.map((asset) => {
            const id = getAssetId(asset);
            const img = getImgFromAsset(asset);
            const tokenId = `#${asset.tokenId}`;

            return (
              <div
                key={id}
                className={cn(s.assetsItem, { [s._selected]: !!selectedAssets.find((a) => a.id === id) })}
                onClick={() => handleAssetSelect({ id, img, name: asset.metadata?.name })}
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
