import { Web3Provider } from '@ethersproject/providers';
import { useEffect, useMemo, useState } from 'react';
import { getConnectionInfo } from 'src/utils';
import { Gomu } from '@gomuweb3/sdk';

export const useGomuSdk = (chainId: number, address: string) => {
  return useMemo(() => {
    const provider = new Web3Provider(window.ethereum);

    return new Gomu({
      provider,
      signer: provider.getSigner(),
      address,
      openseaConfig: {
        useReadOnlyProvider: false,
        ...(chainId !== 4 && { apiKey: process.env.REACT_APP_OPENSEA_API_KEY }),
      },
      looksrareConfig: {
        ...(chainId !== 4 && { apiKey: process.env.REACT_APP_LOOKSRARE_API_KEY }),
      },
      chainId,
    });
  }, [chainId, address]);
};

interface UseMetamaskNetworkProps {
  onAddressChange?: (arg0: string) => void;
  onChainChange?: (arg0: number) => void;
}

export const useMetamaskNetwork = (props?: UseMetamaskNetworkProps) => {
  const { onAddressChange, onChainChange } = props || {};
  const [isMMRequired, setIsMMRequired] = useState(!window.ethereum);
  const [userAddress, setUserAddress] = useState('');
  const [chainId, setChainId] = useState(1);

  const handleAccountsChanged = (accs: string[]) => {
    if (!accs.length) {
      setUserAddress('');
      return setIsMMRequired(true);
    }
    const newAddress = accs[0];
    setUserAddress(newAddress);
    onAddressChange?.(newAddress);
  };

  const handleChainChanged = (newChainId: number) => {
    setChainId(newChainId);
    onChainChange?.(newChainId);
  };

  useEffect(() => {
    if (isMMRequired && userAddress) {
      setIsMMRequired(false);
    }
  }, [isMMRequired, userAddress]);

  useEffect(() => {
    if (!isMMRequired) {
      getConnectionInfo().then((info) => {
        setUserAddress(info.address);
        setChainId(info.chainId);
      }).catch(() => setIsMMRequired(true));
    }
  }, [isMMRequired]);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new Web3Provider(window.ethereum, 'any');
      provider.on('network', (newNetwork) => {
        handleChainChanged(newNetwork.chainId);
      });

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        provider.off('network');
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [isMMRequired]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    isMMRequired,
    userAddress,
    chainId,
  };
};
