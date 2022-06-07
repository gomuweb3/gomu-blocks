import { ConnectMetamask, Widget } from 'src/components';
import { useMetamaskNetwork } from 'src/hooks';
import s from './styles.module.scss';

const WidgetWide = () => {
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

export default WidgetWide;
