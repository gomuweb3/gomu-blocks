import { useState, useEffect, useContext, Fragment } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import cn from 'classnames';
import { getWalletAssets, SUPPORTED_NFT_TYPES } from 'src/api';
import { getAssetId, getImgFromAsset, rangeFromZero } from 'src/utils';
import { NftAsset } from 'src/typings';
import { SHARED_STOREFRONT_CONTRACT_ADDRESS } from '../constants';
import { WidgetContext } from '../context';
import { PrimitiveAsset } from '../types';
import s from './styles.module.scss';

const ASSETS_LIMIT = 50;

const AssetsList = ({
  selectedIds,
  isStatic,
  isCompact,
  maxSelectableAssets = 4,
  onSelect,
}: {
  selectedIds?: string[];
  isStatic?: boolean;
  isCompact?: boolean;
  maxSelectableAssets?: number; // -1 for unlimited
  onSelect?: (assets: PrimitiveAsset[]) => void;
}) => {
  const { userAddress, chainId } = useContext(WidgetContext)!;
  const [selectedAssets, setSelectedAssets] = useState<PrimitiveAsset[]>([]);
  const { ref, inView } = useInView({
    threshold: 1,
  });

  const {
    data: walletAssets,
    isLoading: assetsLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(
    ['walletAssets', userAddress, chainId],
    ({ pageParam = '' }) => getWalletAssets({
      address: userAddress,
      chainId,
      includeNonStandardTokenTypes: true,
      limit: ASSETS_LIMIT,
      cursor: pageParam,
    }),
    {
      getNextPageParam: (lastPage) => lastPage.data.length === ASSETS_LIMIT ? lastPage.nextCursor : undefined,
      enabled: !!userAddress
    },
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  const convertToPrimitiveAsset = (asset: NftAsset) => {
    const id = getAssetId(asset);
    const img = getImgFromAsset(asset);

    return { id, type: asset.type, name: asset.name, img } as PrimitiveAsset;
  };

  useEffect(() => {
    if (selectedIds && selectedIds.length !== selectedAssets.length) {
      const newAssets = walletAssets?.pages.reduce((acc, { data }) => {
        const filteredAssets = data.filter((asset) => {
          const id = getAssetId(asset);
          return selectedIds.includes(id);
        });
        if (!filteredAssets.length) {
          return acc;
        }

        return acc.concat(filteredAssets.map(convertToPrimitiveAsset));
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

  const renderPlaceholders = () => {
    return rangeFromZero(6).map((index) => {
      return (
        <div
          key={`placeholder-${index}`}
          className={cn(s.assetsItem, 'g-processing')}
        >
          <div className={s.assetsItemImg} />
          <div className={s.assetsItemContent} />
        </div>
      );
    });
  };

  const renderAssets = () => {
    if (assetsLoading) {
      return renderPlaceholders();
    }

    return walletAssets?.pages.map((page, i) => {
      return (
        <Fragment key={i}>
          {page.data.map((asset) => {
            const id = getAssetId(asset);
            const img = getImgFromAsset(asset);
            const tokenId = `#${asset.tokenId}`;
            const typeIsSupported = (SUPPORTED_NFT_TYPES as string[]).includes(asset.type);
            const isSharedFrontContract = asset.tokenAddress === SHARED_STOREFRONT_CONTRACT_ADDRESS; // shared storefront not supported by opensea
            const isDisabled = !isStatic && (!typeIsSupported || isSharedFrontContract);

            return (
              <div
                key={id}
                className={cn(
                  s.assetsItem,
                  {
                    [s._selected]: !!selectedAssets.find((a) => a.id === id),
                    [s._disabled]: isDisabled,
                  },
                )}
                title={isDisabled ? 'Trading for this asset type is not supported' : undefined}
                onClick={() => typeIsSupported && handleAssetSelect(asset)}
              >
                <div className={s.assetsItemImg}>
                  {img ? <img src={img} alt="" /> : <div />}
                </div>
                <div className={s.assetsItemContent}>
                  <p title={tokenId}>{tokenId}</p>
                </div>
              </div>
            );
          })}
        </Fragment>
      );
    });
  };

  return (
    <div className={cn(s.assets, { [s._static]: isStatic, [s._compact]: isCompact })}>
      {renderAssets()}
      {isFetchingNextPage && renderPlaceholders()}
      {hasNextPage && <div className={s.assetsScrollTrigger} ref={ref} />}
    </div>
  );
};

export default AssetsList;
