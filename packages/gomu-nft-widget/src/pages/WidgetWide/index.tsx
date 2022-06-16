import cn from 'classnames';
import { ConnectMetamask, Widget } from 'src/components';
import { useMetamaskNetwork } from 'src/hooks';
import s from '../WidgetMobile/styles.module.scss';

const WidgetWide = () => {
  const { isMMRequired, userAddress, chainId } = useMetamaskNetwork();

  if (isMMRequired) {
    return <ConnectMetamask style={{ height: '100vh' }} />;
  }

  return (
    <div className={cn(s.demo, s._wide)}>
      <Widget
        userAddress={userAddress}
        chainId={chainId}
        style={{ height: '100%', borderRadius: 'inherit' }}
      />
    </div>
  );
};

export default WidgetWide;
