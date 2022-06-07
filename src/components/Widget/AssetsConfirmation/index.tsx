import cn from 'classnames';
import { parseAssetId } from 'src/utils';
import { Loader, ExternalLinkIcon, QuestionIcon } from 'src/assets/svg';
import { MARKETPLACES } from '../constants';
import { PricedAsset, TokenInfo, GomuOrder, OrderError } from '../types';
import s from './styles.module.scss';

const AssetsConfirmation = ({
  assets,
  erc20Tokens,
  isListingOrders,
  onRemoveAsset,
  onEditAsset,
}: {
  assets: PricedAsset[];
  erc20Tokens: TokenInfo[];
  isListingOrders?: boolean;
  onRemoveAsset?: (id: string) => void;
  onEditAsset?: (id: string) => void;
}) => {
  return (
    <div className={s.confirmation}>
      {assets.map(({ id, img, name, amount, paymentTokenAddress, selectedMarketplaces, orders }) => {
        const { tokenId } = parseAssetId(id);
        const erc20Token = erc20Tokens.find((t) => t.address === paymentTokenAddress);

        return (
          <div key={id} className={s.asset}>
            <div className={s.assetHeader}>
              <div className={s.assetImg}>
                {img && <img src={img} alt={name} />}
              </div>
              <div className={s.assetInfo}>
                <p className={s.assetName} title={name}>{name}</p>
                <p className={s.assetTokenId} title={tokenId}>#{tokenId}</p>
                <p className={s.assetErc20} title={`${amount} ${erc20Token?.symbol}`}>
                  {amount}
                  {erc20Token && (
                    <img
                      src={erc20Token.imgUrl || erc20Token.symbol}
                      alt={erc20Token.symbol}
                    />
                  )}
                </p>
              </div>
            </div>
            <div className={s.assetFooter}>
              {MARKETPLACES.map(({ key, label, imgUrl, linkBuilder }) => {
                if (!selectedMarketplaces.includes(key)) {
                  return null;
                }

                const order = orders.find((o) => o.marketplaceName === key);
                const { error } = order as OrderError || {};
                const link = linkBuilder ? linkBuilder(order as GomuOrder) : '';
                const status = (order && error)
                  ? (
                    <p className={cn(s.assetMarketplaceStatus, s._error)} title={error}>
                      Failed
                      <QuestionIcon />
                    </p>
                  )
                  : (
                    <p className={cn(s.assetMarketplaceStatus, s._success)}>
                      Success
                      {link && <a target="_blank" rel="noreferrer" href={link}><ExternalLinkIcon /></a>}
                    </p>
                  );

                const renderStatus = () => {
                  if (order) {
                    return status;
                  }
                  if (isListingOrders) {
                    return <Loader className={s.assetMarketplaceLoader} />;
                  }
                  return null;
                };

                return (
                  <div key={key} className={s.assetMarketplace}>
                    <div className={s.assetMarketplaceInfo}>
                      <img src={imgUrl} alt={label} />
                      {label}
                    </div>
                    {renderStatus()}
                  </div>
                );
              })}
            </div>
            {(onRemoveAsset && assets.length > 1) && (
              <div
                className={s.assetRemove}
                onClick={() => onRemoveAsset(id)}
              />
            )}
            {onEditAsset && (
              <div
                className={s.assetEdit}
                onClick={() => onEditAsset(id)}
              >
                Edit
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AssetsConfirmation;
