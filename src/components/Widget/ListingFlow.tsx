import { useState } from 'react';
import cn from 'classnames';
import { AddressBox } from 'src/components';
import { rangeFromZero } from 'src/utils';
import { ArrowLeftIcon, CartIcon, EditIcon, MenuIcon, CheckCircleIcon, CaretRightIcon } from 'src/assets/svg';
import AssetsList from './AssetsList';
import AssetPricing from './AssetPricing';
import { TOKENS, MARKETPLACES } from './constants';
import { PrimitiveAsset, PricedAsset } from './types';
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
  maxSelectableAssets = 4,
  onClose,
}: {
  userAddress: string;
  chainId: number;
  maxSelectableAssets?: number;
  onClose: () => void;
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activePricingSubstepIndex, setActivePricingSubstepIndex] = useState(0);
  const [selectedAssets, setSelectedAssets] = useState<PrimitiveAsset[]>([]);
  const [pricedAssets, setPricedAssets] = useState<PricedAsset[]>([]);
  const [isEditing, setIsEditing] = useState(false);

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
            paymentTokenAddress: TOKENS[chainId]?.[0]?.address,
            selectedMarketplaces: MARKETPLACES.map((mp) => mp.key),
          };
        });
        setPricedAssets(initialPricedAssets);
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
        return !!activePricedAsset.amount.length;
      },
      onConfirm: () => {
        if (activePricingSubstepIndex === pricedAssets.length - 1) {
          return setActiveStepIndex(activeStepIndex + 1);
        }

        setActivePricingSubstepIndex(activePricingSubstepIndex + 1);
      },
    },
    {
      key: 'confirmation',
      label: 'Check your listing details ',
      confirmLabel: 'Confirm',
      editingConfirmLabel: 'Done',
      iconName: 'menu',
      withBackButton: true,
      validationCheck: () => true,
      onConfirm: () => {
        if (isEditing) {
          return setIsEditing(false);
        }

        setActiveStepIndex(activeStepIndex + 1);
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
    if (isEditing && !pricedAssets.length) {
      setSelectedAssets([]);
      setActivePricingSubstepIndex(0);
      return setActiveStepIndex(0);
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
    if (isEditing) {
      if (!pricedAssets.length) {
        return 'Return to Step 1';
      }
      if (activeStepConfig.editingConfirmLabel) {
        return activeStepConfig.editingConfirmLabel;
      }
    }
    if (activeStepConfig.withPricingSubsteps && activeStepConfig.intermediateConfirmLabel && activePricingSubstepIndex !== pricedAssets.length - 1) {
      return activeStepConfig.intermediateConfirmLabel;
    }
    return activeStepConfig.confirmLabel;
  };

  const renderMainContent = () => {
    if (activeStepConfig.key === 'pricing') {
      return (
        <AssetPricing
          asset={pricedAssets[activePricingSubstepIndex]}
          chainId={chainId}
          onChange={handlePricedAssetChange}
        />
      );
    }
    if (activeStepConfig.key === 'confirmation') {
      return 'Confirmation';
    }
    if (activeStepConfig.key === 'status') {
      return 'Orders Status Screen';
    }
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
  };

  const renderFooterLeftSection = () => {
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

    return <div />;
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
          {renderMainContent()}
        </div>
        <div className={cn(s.widgetContentFooter, { [s._withPreviews]: activeStepConfig.withAssetsPreviews })}>
          <div className={s.widgetContentFooterInner}>
            {renderFooterLeftSection()}
            {activeStepConfig.withPricingSubsteps && (
              <div className={s.widgetContentFooterSubsteps}>
                {activePricingSubstepIndex + 1} of {selectedAssets.length}
              </div>
            )}
            <button
              type="button"
              className={cn(
                s.widgetContentFooterConfirm,
                { [s._borderStyle]: activeStepConfig.withPricingSubsteps && activePricingSubstepIndex !== selectedAssets.length - 1 },
              )}
              disabled={!activeStepConfig.validationCheck()}
              onClick={handleConfirm}
            >
              {getConfirmLabel()}
              {(!isEditing && activeStepIndex !== STEPS_CONFIG.length - 1) && (
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
