import { useState } from 'react';
import cn from 'classnames';
import { AddressBox } from 'src/components';
import { GomuLogoBox, PoweredByLogoPurple } from 'src/assets/svg';
import { ERC20_TOKENS } from './constants';
import AssetsList from './AssetsList';
import ListingFlow from './ListingFlow';
import OrdersList from './OrdersList';
import s from './styles.module.scss';

enum TABS {
  Nfts = 'nfts',
  Orders = 'orders',
};

const Widget = ({
  userAddress,
  chainId,
  maxSelectableAssets,
}: {
  userAddress: string;
  chainId: number;
  maxSelectableAssets?: number;
}) => {
  const TABS_CONFIG = [
    {
      key: TABS.Nfts,
      label: 'Your NFTs',
      componentRenderer: () => {
        return (
          <AssetsList
            userAddress={userAddress}
            chainId={chainId}
            isStatic
          />
        );
      },
      actionButtonRenderer: () => {
        return (
          <button
            type="button"
            onClick={() => setIsListingFlowActive(true)}
          >
            Sell
          </button>
        );
      },
    },
    {
      key: TABS.Orders,
      label: 'Listed Orders',
      componentRenderer: () => {
        return (
          <OrdersList
            userAddress={userAddress}
            chainId={chainId}
            isEditingOrders={isEditingOrders}
          />
        );
      },
      actionButtonRenderer: () => {
        return (
          <button
            type="button"
            onClick={() => setIsEditingOrders(true)}
          >
            Edit
          </button>
        );
      },
    },
  ];

  const [activeTab, setActiveTab] = useState<`${TABS}`>(TABS_CONFIG[0].key);
  const [isListingFlowActive, setIsListingFlowActive] = useState(false);
  const [isEditingOrders, setIsEditingOrders] = useState(false);

  const activeTabConfig = TABS_CONFIG.find((tabConfig) => tabConfig.key === activeTab)!;
  const erc20Tokens = ERC20_TOKENS[chainId] || [];

  return (
    <div className={cn(s.widget, s._mobile)}>
      {isListingFlowActive
        ? (
          <ListingFlow
            userAddress={userAddress}
            chainId={chainId}
            erc20Tokens={erc20Tokens}
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
                {activeTabConfig.actionButtonRenderer()}
              </div>
              <div className={s.widgetContentInner}>
                {activeTabConfig.componentRenderer()}
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
