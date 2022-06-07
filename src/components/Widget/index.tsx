import { useState, useRef } from 'react';
import useResizeObserver from '@react-hook/resize-observer';
import cn from 'classnames';
import { AddressBox } from 'src/components';
import { useGomuSdk } from 'src/hooks';
import { GomuLogoBox } from 'src/assets/svg';
import { ERC20_TOKENS, BREAKPOINTS_CONFIG } from './constants';
import { getBreakpointsConfig, getBreakpointsStyles } from './utils';
import { WidgetContext } from './context';
import { BreakpointsConfigItem } from './types';
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
  width,
  maxSelectableAssets = 4,
}: {
  userAddress: string;
  chainId: number;
  width?: number | string;
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
  const [breakpointsConfig, setBreakpointsConfig] = useState<BreakpointsConfigItem>(BREAKPOINTS_CONFIG[0]);
  const widgetRef = useRef(null);
  const isResized = useRef(false);
  const gomuSdk = useGomuSdk(chainId, userAddress);

  useResizeObserver(widgetRef, (entry) => {
    const newConfig = getBreakpointsConfig(entry.contentRect.width);
    if (newConfig) {
      setBreakpointsConfig(newConfig);
      if (!isResized.current) {
        isResized.current = true;
      }
    }
  });

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
      <div
        className={cn(s.widget, { [s._resized]: isResized.current })}
        style={{ ...getBreakpointsStyles(breakpointsConfig), width }}
        ref={widgetRef}
      >
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
