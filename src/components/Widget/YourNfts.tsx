import { useContext } from 'react';
import cn from 'classnames';
import { PoweredByLogoPurple } from 'src/assets/svg';
import AssetsList from './AssetsList';
import { WidgetContext } from './context';
import s from './styles.module.scss';

const YourNfts = ({
  heading,
  onSellClick,
}: {
  heading: string;
  onSellClick: () => void;
}) => {
  const { userAddress, chainId } = useContext(WidgetContext)!;

  return (
    <div className={s.widgetContent}>
      <div className={s.widgetContentHeader}>
        <h3 className={s.widgetHeading}>{heading}</h3>
        <button
          type="button"
          onClick={onSellClick}
        >
          Sell
        </button>
      </div>
      <div className={s.widgetContentInner}>
        <AssetsList
          userAddress={userAddress}
          chainId={chainId}
          isStatic
        />
      </div>
      <div className={s.widgetContentFooter}>
        <div className={cn(s.widgetContentFooterInner, s._withLogo)}>
          <PoweredByLogoPurple />
        </div>
      </div>
    </div>
  );
};

export default YourNfts;
