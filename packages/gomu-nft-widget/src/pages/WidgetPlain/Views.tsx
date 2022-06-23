import { useState, useEffect, CSSProperties } from 'react';
import { Widget, WagmiWalletSelect } from 'src/components';
import { useAccount, useNetwork } from 'wagmi';
import { ExternalProvider } from '@ethersproject/providers';

interface Props {
  widgetStyle?: CSSProperties;
  walletSelectStyle?: CSSProperties;
}
const Views = ({ widgetStyle, walletSelectStyle }: Props) => {
  const { data } = useAccount();
  const { activeChain } = useNetwork();
  const [provider, setProvider] = useState<ExternalProvider>();
  const userAddress = data?.address;

  useEffect(() => {
    getProvider().catch(console.error);

    async function getProvider() {
      setProvider(await data?.connector?.getProvider());
    }
  }, [data]);

  const showWidget = provider && userAddress && activeChain;

  return showWidget ? (
    <Widget
      userAddress={userAddress}
      chainId={activeChain.id}
      style={widgetStyle}
    />
  ) : (
    <WagmiWalletSelect style={walletSelectStyle} />
  );
};

export default Views;
