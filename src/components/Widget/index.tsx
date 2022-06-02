import { useState } from 'react';
import cn from 'classnames';
import { AddressBox } from 'src/components';
import { GomuLogoBox, PoweredByLogoPurple } from 'src/assets/svg';
import AssetsList from './AssetsList';
import ListingFlow from './ListingFlow';
import s from './styles.module.scss';

enum TABS {
  Nfts = 'nfts',
  Orders = 'orders',
};

const TABS_CONFIG = [
  { key: TABS.Nfts, label: 'Your NFTs' },
  { key: TABS.Orders, label: 'Listed Orders' },
];

const Widget = ({
  userAddress,
  chainId,
  maxSelectableAssets,
}: {
  userAddress: string;
  chainId: number;
  maxSelectableAssets?: number;
}) => {
  const [activeTab, setActiveTab] = useState<`${TABS}`>(TABS_CONFIG[0].key);
  const [isListingFlowActive, setIsListingFlowActive] = useState(false);

  const activeTabConfig = TABS_CONFIG.find((tabConfig) => tabConfig.key === activeTab)!;

  return (
    <div className={cn(s.widget, s._mobile)}>
      {isListingFlowActive
        ? (
          <ListingFlow
            userAddress={userAddress}
            chainId={chainId}
            maxSelectableAssets={maxSelectableAssets}
            onClose={() => setIsListingFlowActive(false)}
          />
        )
        : (
          <>
            <div className={s.widgetHeader}>
              <div className={s.widgetHeaderTop}>
                <GomuLogoBox />
                <AddressBox address={userAddress} />
              </div>
              <div className={s.widgetNav}>
                {TABS_CONFIG.map(({ key, label }) => {
                  return (
                    <div
                      key={key}
                      className={cn(s.widgetNavTab, { [s._active]: activeTab === key })}
                      style={{ '--nav-num-of-items': TABS_CONFIG.length } as any}
                      onClick={() => setActiveTab(key)}
                    >
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={s.widgetContent}>
              <div className={s.widgetContentHeader}>
                <h3 className={s.widgetHeading}>{activeTabConfig.label}</h3>
                {activeTab === 'nfts' && (
                  <button
                    type="button"
                    onClick={() => setIsListingFlowActive(true)}
                  >
                    Sell
                  </button>
                )}
              </div>
              <div className={s.widgetContentInner}>
                <AssetsList
                  userAddress={userAddress}
                  chainId={chainId}
                  isStatic
                />
              </div>
              <div className={cn(s.widgetContentFooter, s._withLogo)}>
                <PoweredByLogoPurple />
              </div>
            </div>
          </>
        )
      }
    </div>
  );
};

export default Widget;
