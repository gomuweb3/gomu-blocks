import { useRef, useEffect } from 'react';
import { Dropdown } from 'src/components';
import { parseAssetId } from 'src/utils';
import Checkbox from '../Checkbox';
import { MARKETPLACES } from '../constants';
import { PricedAsset, TokenInfo, MarketplaceName } from '../types';
import s from './styles.module.scss';

const AssetPricing = ({
  asset,
  erc20Tokens,
  onChange,
  onConfirm,
}: {
  asset: PricedAsset;
  erc20Tokens: TokenInfo[];
  onChange: (updatedAsset: PricedAsset) => void;
  onConfirm: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { id, name, img, amount, paymentTokenAddress, selectedMarketplaces } = asset;
  const { tokenId } = parseAssetId(id);

  useEffect(() => {
      inputRef.current?.focus();
  }, []);

  const handleChange = (changes: Partial<PricedAsset>) => {
    onChange({
      ...asset,
      ...changes,
    });
  };

  const handleMarketplaceSelect = (key: MarketplaceName, isSelected: boolean) => {
    const newSelectedMarketplaces = isSelected
      ? selectedMarketplaces.concat(key)
      : selectedMarketplaces.filter((_key) => _key !== key);

    handleChange({ selectedMarketplaces: newSelectedMarketplaces });
  };

  const handleConfirm = (e: any) => {
    e.preventDefault();
    onConfirm();
  };

  const erc20DropdownItems = erc20Tokens
    .filter((t) => !t.notSelectable)
    .map(({ address, symbol, imgUrl }) => ({ id: address, label: symbol, imgUrl }));

  return (
    <form className={s.pricing} onSubmit={handleConfirm}>
      <div className={s.pricingAsset}>
        <div className={s.pricingAssetImg}>
          {img && <img src={img} alt={name} />}
        </div>
        <div className={s.pricingAssetInfo}>
          {name && <p title={name}>{name}</p>}
          <span title={tokenId}>#{tokenId}</span>
        </div>
      </div>
      <p className={s.pricingLabel}>Price</p>
      <div className={s.pricingToken}>
        <input
          type="text"
          className={s.pricingTokenInput}
          placeholder="0.1"
          ref={inputRef}
          value={amount}
          onChange={(e) => handleChange({ amount: e.target.value })}
        />
        <Dropdown
          items={erc20DropdownItems}
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
              className={s.pricingCheckbox}
              onChange={() => handleMarketplaceSelect(key, !isSelected)}
            >
              <img src={imgUrl} alt={label} />
              {label}
            </Checkbox>
          );
        })}
      </div>
    </form>
  );
};

export default AssetPricing;
