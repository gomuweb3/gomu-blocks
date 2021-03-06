import { useEffect, useState, CSSProperties } from 'react';
import MetamaskOnboarding from '@metamask/onboarding';
import s from './styles.module.scss';

const onboarding = new MetamaskOnboarding();

const ConnectMetamask = ({
  style: styleFromProps,
}: {
  style?: CSSProperties;
}) => {
  let isMounted = true;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      isMounted = false; // eslint-disable-line
    };
  }, []);

  const handleInstallMM = () => {
    setIsLoading(true);
    onboarding.startOnboarding();
  };

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (isMounted) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  if (!window.ethereum /*|| !window.ethereum?.isMetaMask*/) {
    return (
      <div className={s.connect} style={{ ...styleFromProps }}>
        <button type="button" disabled={isLoading} onClick={handleInstallMM}>
          {isLoading ? 'Onboarding in progress' : 'Install Metamask'}
        </button>
      </div>
    );
  }

  return (
    <div className={s.connect} style={{ ...styleFromProps }}>
      <button type="button" onClick={handleConnect}>
        Connect
      </button>
    </div>
  );
};

export default ConnectMetamask;
