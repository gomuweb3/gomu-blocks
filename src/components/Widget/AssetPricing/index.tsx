import { Dropdown } from 'src/components';
import { parseAssetId } from 'src/utils';
import Checkbox from '../Checkbox';
import { TOKENS, MARKETPLACES } from '../constants';
import { PricedAsset } from '../types';
import s from './styles.module.scss';

const AssetPricing = ({
  asset,
  chainId,
  onChange,
}: {
  asset: PricedAsset;
  chainId: number;
  onChange: (updatedAsset: PricedAsset) => void;
}) => {
  const { id, name, img, amount, paymentTokenAddress, selectedMarketplaces } = asset;
  const { tokenId } = parseAssetId(id);

  const handleChange = (changes: Partial<PricedAsset>) => {
    onChange({
      ...asset,
      ...changes,
    });
  };

  const handleMarketplaceSelect = (key: string, isSelected: boolean) => {
    const newSelectedMarketplaces = isSelected
      ? selectedMarketplaces.concat(key)
      : selectedMarketplaces.filter((_key) => _key !== key);

    handleChange({ selectedMarketplaces: newSelectedMarketplaces });
  };

  const activeChainTokens = TOKENS[chainId] || [];

  return (
    <div className={s.pricing}>
      <div className={s.pricingAsset}>
        <div className={s.pricingAssetImg}>
          {img && <img src={img} alt={name} />}
        </div>
        <div className={s.pricingAssetInfo}>
          <p title={name}>{name}</p>
          <span title={tokenId}>#{tokenId}</span>
        </div>
      </div>
      <p className={s.pricingLabel}>Price</p>
      <div className={s.pricingToken}>
        <input
          type="text"
          className={s.pricingTokenInput}
          placeholder="0.1"
          value={amount}
          onChange={(e) => handleChange({ amount: e.target.value })}
        />
        <Dropdown
          items={activeChainTokens.map(({ address, symbol }) => ({ id: address, label: symbol }))}
          isSelectDropdown
          selectedId={paymentTokenAddress}
          rightAligned
          className={s.pricingTokenDropdown}
          onSelect={(address) => handleChange({ paymentTokenAddress: address })}
        />
      </div>
      <p className={s.pricingLabel}>Marketplace</p>
      <div className={s.pricingMarketplaces}>
        {MARKETPLACES.map(({ key, label, imgUrl }) => {
          const isSelected = selectedMarketplaces.includes(key);

          return (
            <Checkbox
              key={key}
              name={key}
              checked={isSelected}
              onChange={() => handleMarketplaceSelect(key, !isSelected)}
            >
              <img src={imgUrl} alt={label} />
              {label}
            </Checkbox>
          );
        })}
      </div>
    </div>
  );
};

export default AssetPricing;
