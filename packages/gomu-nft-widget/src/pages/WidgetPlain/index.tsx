import cn from 'classnames';
import { WagmiConnect, Widget } from 'src/components';
import { useMetamaskNetwork } from 'src/hooks';
import s from './styles.module.scss';

const WidgetPlain = () => {
  const { userAddress, chainId } = useMetamaskNetwork();

  return (
    <div className={cn(s.widgetContainer)}>
      <WagmiConnect
        connectWalletStyle={{
          position: 'absolute',
          width: '300px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Widget
          userAddress={userAddress}
          chainId={chainId}
          style={{ height: '100%' }}
        />
      </WagmiConnect>
    </div>
  );
};

export default WidgetPlain;
