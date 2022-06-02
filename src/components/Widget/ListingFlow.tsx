import { useState } from 'react';
import cn from 'classnames';
import { AddressBox } from 'src/components';
import { rangeFromZero } from 'src/utils';
import { ArrowLeftIcon, CartIcon, EditIcon, MenuIcon, CheckCircleIcon, CaretRightIcon } from 'src/assets/svg';
import AssetsList from './AssetsList';
import AssetPricing from './AssetPricing';
import AssetsConfirmation from './AssetsConfirmation';
import { MARKETPLACES } from './constants';
import { PrimitiveAsset, PricedAsset, TokenInfo } from './types';
import s from './styles.module.scss';

const ICONS_MAPPING: Record<string, any> = {
  cart: CartIcon,
  edit: EditIcon,
  menu: MenuIcon,
  checkCircle: CheckCircleIcon,
};

const ListingFlow = ({
  userAddress,
  chainId,
  erc20Tokens,
  maxSelectableAssets = 4,
  onClose,
}: {
  userAddress: string;
  chainId: number;
  erc20Tokens: TokenInfo[];
  maxSelectableAssets?: number;
  onClose: () => void;
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activePricingSubstepIndex, setActivePricingSubstepIndex] = useState(0);
  const [selectedAssets, setSelectedAssets] = useState<PrimitiveAsset[]>([]);
  const [pricedAssets, setPricedAssets] = useState<PricedAsset[]>([]);
  const [isEditingAsset, setIsEditingAsset] = useState(false);

  const STEPS_CONFIG = [
    {
      key: 'cart',
      label: 'Select NFTs that you would like to list',
      confirmLabel: 'List',
      iconName: 'cart',
      withAssetsPreviews: true,
      validationCheck: () => !!selectedAssets.length,
      onConfirm: () => {
        setActiveStepIndex(activeStepIndex + 1);

        const initialPricedAssets: PricedAsset[] = selectedAssets.map((asset) => {
          return {
            ...asset,
            amount: '',
            paymentTokenAddress: erc20Tokens[0]?.address,
            selectedMarketplaces: MARKETPLACES.map((mp) => mp.key),
          };
        });
        setPricedAssets(initialPricedAssets);
      },
      componentRenderer: () => {
        return (
          <AssetsList
            userAddress={userAddress}
            chainId={chainId}
            selectedIds={selectedAssets.map((a) => a.id)}
            isCompact
            assetsPerRow={3}
            maxSelectableAssets={maxSelectableAssets}
            onSelect={handleAssetsSelect}
          />
        );
      },
    },
    {
      key: 'pricing',
      label: 'Name your price and marketplace',
      confirmLabel: 'Confirm',
      intermediateConfirmLabel: 'Next',
      iconName: 'edit',
      withBackButton: true,
      withPricingSubsteps: true,
      validationCheck: () => {
        const activePricedAsset = pricedAssets[activePricingSubstepIndex];
        return activePricedAsset.amount.length && activePricedAsset.selectedMarketplaces.length;
      },
      onConfirm: () => {
        if (activePricingSubstepIndex === pricedAssets.length - 1) {
          return setActiveStepIndex(activeStepIndex + 1);
        }

        setActivePricingSubstepIndex(activePricingSubstepIndex + 1);
      },
      componentRenderer: () => {
        return (
          <AssetPricing
            asset={pricedAssets[activePricingSubstepIndex]}
            erc20Tokens={erc20Tokens}
            onChange={handlePricedAssetChange}
            onConfirm={handleConfirm}
          />
        );
      },
    },
    {
      key: 'confirmation',
      label: 'Check your listing details ',
      confirmLabel: 'Confirm',
      iconName: 'menu',
      withBackButton: true,
      validationCheck: () => true,
      onConfirm: () => {
        setActiveStepIndex(activeStepIndex + 1);
      },
      componentRenderer: () => {
        return (
          <AssetsConfirmation
            assets={pricedAssets}
            erc20Tokens={erc20Tokens}
            onRemoveAsset={(id) => {
              const newPricedAssets = pricedAssets.filter((a) => a.id !== id);

              setSelectedAssets(selectedAssets.filter((a) => a.id !== id));
              setPricedAssets(newPricedAssets);
              setActivePricingSubstepIndex(newPricedAssets.length - 1);
            }}
            onEditAsset={(id) => {
              const pricingStepIndex = STEPS_CONFIG.findIndex((step) => step.key === 'pricing');
              const assetIndex = pricedAssets.findIndex((a) => a.id === id);

              setActiveStepIndex(pricingStepIndex);
              setActivePricingSubstepIndex(assetIndex);
              setIsEditingAsset(true);
            }}
          />
        );
      },
    },
    {
      key: 'status',
      label: 'Transaction status for listings',
      confirmLabel: 'Back to Home',
      iconName: 'checkCircle',
      validationCheck: () => true,
      onConfirm: () => {
        onClose();
      },
      componentRenderer: () => {
        return 'Statuses';
      },
    },
  ];

  const activeStepConfig = STEPS_CONFIG[activeStepIndex];

  const handleAssetsSelect = (assets: PrimitiveAsset[]) => {
    setSelectedAssets(assets);
  };

  const handleBack = () => {
    if (activeStepConfig.withPricingSubsteps && activePricingSubstepIndex !== 0) {
      return setActivePricingSubstepIndex(activePricingSubstepIndex - 1);
    }

    setActiveStepIndex(activeStepIndex - 1);
  };

  const handleConfirm = () => {
    if (!activeStepConfig.validationCheck()) {
      return;
    }

    if (isEditingAsset) {
      const confirmationStepIndex = STEPS_CONFIG.findIndex((step) => step.key === 'confirmation');
      setActiveStepIndex(confirmationStepIndex);
      setActivePricingSubstepIndex(pricedAssets.length - 1);
      return setIsEditingAsset(false);
    }

    activeStepConfig.onConfirm();
  };

  const handleRemovePreview = (id: string) => {
    const newAssets = selectedAssets.filter((a) => a.id !== id);
    setSelectedAssets(newAssets);
  };

  const handlePricedAssetChange = (updatedAsset: PricedAsset) => {
    const newPricedAssets = pricedAssets.map((asset, index) => {
      if (index === activePricingSubstepIndex) {
        return updatedAsset;
      }
      return asset;
    })

    setPricedAssets(newPricedAssets);
  };

  const getConfirmLabel = () => {
    if (isEditingAsset) {
      return activeStepConfig.confirmLabel;
    }

    if (activeStepConfig.withPricingSubsteps
      && activeStepConfig.intermediateConfirmLabel
      && activePricingSubstepIndex !== pricedAssets.length - 1) {
      return activeStepConfig.intermediateConfirmLabel;
    }

    return activeStepConfig.confirmLabel;
  };

  const renderFooterLeftSection = () => {
    if (isEditingAsset) {
      return <div />;
    }

    if (activeStepConfig.withBackButton) {
      return (
        <button
          type="button"
          className={s._borderStyle}
          onClick={handleBack}
        >
          Back
        </button>
      );
    }

    if (activeStepConfig.withAssetsPreviews) {
      return (
        <div className={s.widgetPreviews}>
          {rangeFromZero(maxSelectableAssets).map((index) => {
            const asset = selectedAssets[index];
            return (
              <div key={asset ? asset.id : index} className={s.widgetPreview}>
                {asset && (
                  <>
                    <div className={s.widgetPreviewInner}>
                      {asset.img ? <img src={asset.img} alt="" /> : <div />}
                    </div>
                    <div className={s.widgetPreviewRemove} onClick={() => handleRemovePreview(asset.id)} />
                  </>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    return <div />; // empty div required for flex alignment with "justify-content: space-between"
  };

  return (
    <>
      <div className={cn(s.widgetHeader, s._withSteps)}>
        <div className={s.widgetHeaderTop}>
          <ArrowLeftIcon onClick={() => onClose()} />
          <AddressBox address={userAddress} />
        </div>
        <div className={s.widgetHeaderText}>
          <h3>Step {activeStepIndex + 1}</h3>
          <p>{activeStepConfig.label}</p>
        </div>
        <div className={s.widgetHeaderSteps}>
          {STEPS_CONFIG.map(({ key, iconName }, index) => {
            const Icon = ICONS_MAPPING[iconName];

            return (
              <div
                key={key}
                className={cn(s.widgetHeaderStep, { [s._active]: activeStepIndex === index })}
              >
                <Icon />
              </div>
            );
          })}
        </div>
      </div>
      <div className={cn(s.widgetContent, s._listingFlow)}>
        <div className={s.widgetContentInner}>
          {activeStepConfig.componentRenderer()}
        </div>
        <div className={cn(s.widgetContentFooter, { [s._withPreviews]: activeStepConfig.withAssetsPreviews })}>
          <div className={s.widgetContentFooterInner}>
            {renderFooterLeftSection()}
            {(activeStepConfig.withPricingSubsteps && !isEditingAsset) && (
              <div className={s.widgetContentFooterSubsteps}>
                {activePricingSubstepIndex + 1} of {selectedAssets.length}
              </div>
            )}
            <button
              type="button"
              className={cn(
                s.widgetContentFooterConfirm,
                {
                  [s._borderStyle]: activeStepConfig.withPricingSubsteps
                    && activePricingSubstepIndex !== selectedAssets.length - 1,
                },
              )}
              disabled={!activeStepConfig.validationCheck()}
              onClick={handleConfirm}
            >
              {getConfirmLabel()}
              {activeStepIndex !== STEPS_CONFIG.length - 1 && (
                <CaretRightIcon />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingFlow;
