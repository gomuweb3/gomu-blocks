import cn from 'classnames';
import { ConnectMetamask, Widget } from 'src/components';
import { useMetamaskNetwork } from 'src/hooks';
import s from './styles.module.scss';

const WidgetPlain = () => {
  const { isMMRequired, userAddress, chainId } = useMetamaskNetwork();

  return (
    <div className={cn(s.widgetContainer)}>
      {isMMRequired ? (
        <ConnectMetamask />
      ) : (
        <Widget
          userAddress={userAddress}
          chainId={chainId}
          style={{ height: '100%' }}
        />
      )}
    </div>
  );
};

export default WidgetPlain;
