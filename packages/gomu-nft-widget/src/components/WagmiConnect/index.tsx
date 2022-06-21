import { CSSProperties, PropsWithChildren } from 'react';

import {
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains,
} from 'wagmi';

import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import Profile from './Profile';

interface Props {
  connectWalletStyle?: CSSProperties;
}

const infuraId = process.env.REACT_APP_INFURA_ID;

const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  infuraProvider({ infuraId }),
  publicProvider(),
]);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

// Pass client to React Context Provider
const WagmiConnect = ({
  connectWalletStyle,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <WagmiConfig client={client}>
      <Profile connectWalletStyle={connectWalletStyle}>{children}</Profile>
    </WagmiConfig>
  );
};

export default WagmiConnect;
