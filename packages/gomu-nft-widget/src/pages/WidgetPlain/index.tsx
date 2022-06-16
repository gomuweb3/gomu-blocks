import cn from 'classnames';
import { ConnectMetamask, Widget } from 'src/components';
import { useMetamaskNetwork } from 'src/hooks';
import s from './styles.module.scss';

const WidgetPlain = () => {
  const { isMMRequired, userAddress, chainId } = useMetamaskNetwork();

  return (
    <div className={cn(s.widgetContainer)}>
      {isMMRequired ? (
        <ConnectMetamask
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        />
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
