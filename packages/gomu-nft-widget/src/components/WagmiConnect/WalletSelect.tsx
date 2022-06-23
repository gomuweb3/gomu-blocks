import { CSSProperties } from 'react';
import { useConnect, Connector } from 'wagmi';
import { Loader } from 'src/assets/svg';
import s from './wallet-select.styles.module.scss';

const METAMASK_ID = 'metaMask';
const WALLETCONNECT_ID = 'walletConnect';
const COINBASE_ID = 'coinbaseWallet';

const WALLET_LOGOS: Record<string, { url: string; alt: string }> = {
  [METAMASK_ID]: {
    url: 'https://i.imgur.com/vwbQ4vO.png',
    alt: 'Metamask logo',
  },
  [COINBASE_ID]: {
    url: 'https://i.imgur.com/GRV7U24.png',
    alt: 'Coinbase logo',
  },
  [WALLETCONNECT_ID]: {
    url: 'https://i.imgur.com/mFkcdan.png',
    alt: 'WalletConnect logo',
  },
};

interface Props {
  style?: CSSProperties;
}

export default function WalletSelect({ style }: Props) {
  const { connect, connectors, error, isConnecting, pendingConnector } =
    useConnect();

  function makeConnectorButton(connector: Connector) {
    if (!connector.ready && connector.id === METAMASK_ID) {
      return makeMetaMaskDeeplinkButton(connector);
    }

    return (
      <button
        disabled={!connector.ready}
        key={connector.id}
        onClick={() => connect(connector)}
        className={s.walletConnectButton}
      >
        <span className={s.walletName}>{connector.name}</span>
        {!connector.ready && ' (unsupported)'}
        {isConnecting && connector.id === pendingConnector?.id && (
          <Loader className={s.walletLoader} />
        )}
        {getWalletLogo(connector.id)}
      </button>
    );
  }

  function makeMetaMaskDeeplinkButton(connector: Connector) {
    return (
      <button
        key={connector.id}
        onClick={() =>
          window.open(
            `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`,
            '_self'
          )
        }
        className={s.walletConnectButton}
      >
        {connector.name}
        {getWalletLogo(connector.id)}
      </button>
    );
  }

  function getWalletLogo(id: string) {
    const { url, alt } = WALLET_LOGOS[id] || {};

    return url ? <img src={url} alt={alt} className={s.walletLogo} /> : null;
  }

  return (
    <div className={s.container} style={style}>
      <div className={s.header}>Connect a Wallet</div>

      <div className={s.buttonContainer}>
        {connectors.map((connector) => makeConnectorButton(connector))}
      </div>

      {error && <div className={s.errorMessage}>{error.message}</div>}
    </div>
  );
}
