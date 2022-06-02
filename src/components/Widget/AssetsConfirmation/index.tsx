import { parseAssetId } from 'src/utils';
import { MARKETPLACES } from '../constants';
import { PricedAsset, TokenInfo } from '../types';
import s from './styles.module.scss';

const AssetsConfirmation = ({
  assets,
  erc20Tokens,
  onRemoveAsset,
  onEditAsset,
}: {
  assets: PricedAsset[];
  erc20Tokens: TokenInfo[];
  onRemoveAsset: (id: string) => void;
  onEditAsset: (id: string) => void;
}) => {
  return (
    <div className={s.confirmation}>
      {assets.map(({ id, img, name, amount, paymentTokenAddress, selectedMarketplaces }) => {
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
              {MARKETPLACES.map(({ key, label, imgUrl }) => {
                if (!selectedMarketplaces.includes(key)) {
                  return null;
                }

                return (
                  <div key={key} className={s.assetMarketplace}>
                    <img src={imgUrl} alt={label} />
                    {label}
                  </div>
                );
              })}
            </div>
            <div
              className={s.assetRemove}
              onClick={() => onRemoveAsset(id)}
            />
            <div
              className={s.assetEdit}
              onClick={() => onEditAsset(id)}
            >
              Edit
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AssetsConfirmation;
