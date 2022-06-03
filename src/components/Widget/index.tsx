import { useState } from 'react';
import cn from 'classnames';
import { AddressBox } from 'src/components';
import { useGomuSdk } from 'src/hooks';
import { GomuLogoBox } from 'src/assets/svg';
import { ERC20_TOKENS } from './constants';
import { WidgetContext } from './context';
import YourNfts from './YourNfts';
import OrdersList from './OrdersList';
import ListingFlow from './ListingFlow';
import s from './styles.module.scss';

enum TABS {
  Nfts = 'nfts',
  Orders = 'orders',
};

const Widget = ({
  userAddress,
  chainId,
  maxSelectableAssets = 4,
}: {
  userAddress: string;
  chainId: number;
  maxSelectableAssets?: number;
}) => {
  const TABS_CONFIG = [
    {
      key: TABS.Nfts,
      heading: 'Your NFTs',
      componentRenderer: () => {
        return (
          <YourNfts
            heading="Your NFTs"
            onSellClick={() => setIsListingFlowActive(true)}
          />
        );
      },
    },
    {
      key: TABS.Orders,
      heading: 'Listed Orders',
      componentRenderer: () => {
        return <OrdersList heading="Listed Orders" />;
      },
    },
  ];

  const [activeTab, setActiveTab] = useState<`${TABS}`>(TABS_CONFIG[0].key);
  const [isListingFlowActive, setIsListingFlowActive] = useState(false);
  const gomuSdk = useGomuSdk(chainId, userAddress);

  const activeTabConfig = TABS_CONFIG.find((tabConfig) => tabConfig.key === activeTab)!;
  const erc20Tokens = ERC20_TOKENS[chainId] || [];

  const widgetContext = {
    userAddress,
    chainId,
    gomuSdk,
    erc20Tokens,
    maxSelectableAssets,
  };

  return (
    <WidgetContext.Provider value={widgetContext}>
      <div className={cn(s.widget, s._mobile)}>
        {isListingFlowActive
          ? <ListingFlow onClose={() => setIsListingFlowActive(false)} />
          : (
            <>
              <div className={s.widgetHeader}>
                <div className={s.widgetHeaderTop}>
                  <GomuLogoBox />
                  <AddressBox address={userAddress} />
                </div>
                <div className={s.widgetNav}>
                  {TABS_CONFIG.map(({ key, heading }) => {
                    return (
                      <div
                        key={key}
                        className={cn(s.widgetNavTab, { [s._active]: activeTab === key })}
                        style={{ '--nav-num-of-items': TABS_CONFIG.length } as any}
                        onClick={() => setActiveTab(key)}
                      >
                        {heading}
                      </div>
                    );
                  })}
                </div>
              </div>
              {activeTabConfig.componentRenderer()}
            </>
          )
        }
      </div>
    </WidgetContext.Provider>
  );
};

export default Widget;
