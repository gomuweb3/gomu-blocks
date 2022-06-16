import cn from 'classnames';
import { PoweredByLogoPurple } from 'src/assets/svg';
import AssetsList from './AssetsList';
import s from './styles.module.scss';

const YourNfts = ({
  heading,
  onSellClick,
}: {
  heading: string;
  onSellClick: () => void;
}) => {
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
