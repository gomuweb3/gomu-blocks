import { ConnectMetamask, Widget } from 'src/components';
import { useMetamaskNetwork } from 'src/hooks';
import s from './styles.module.scss';

const WidgetMobile = () => {
  const { isMMRequired, userAddress, chainId } = useMetamaskNetwork();

  if (isMMRequired) {
    return <ConnectMetamask />;
  }

  return (
    <div className={s.demo}>
      <Widget
        userAddress={userAddress}
        chainId={chainId}
        style={{ height: '100%', borderRadius: 'inherit' }}
      />
    </div>
  );
};

export default WidgetMobile;
