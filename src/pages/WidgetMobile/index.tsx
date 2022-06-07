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
      <Widget userAddress={userAddress} chainId={chainId} />
    </div>
  );
};

export default WidgetMobile;
