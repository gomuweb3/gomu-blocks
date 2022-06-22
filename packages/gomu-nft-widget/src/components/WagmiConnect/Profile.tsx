import React from 'react';
import { ExternalProvider } from '@ethersproject/providers';
import { useConnect, useAccount, Connector } from 'wagmi';
import s from './profile.styles.module.scss';

const METAMASK_ID = 'metaMask';

interface Props {
  connectWalletStyle?: React.CSSProperties;
}

export default function Profile({
  connectWalletStyle,
  children,
}: React.PropsWithChildren<Props>) {
  const { connect, connectors, error, isConnecting, pendingConnector } =
    useConnect();

  const { data } = useAccount();

  const [provider, setProvider] = React.useState<ExternalProvider>();
  const userAddress = data?.address;

  React.useEffect(() => {
    getProvider().catch(console.error);

    async function getProvider() {
      setProvider(await data?.connector?.getProvider());
    }
  }, [data]);

  const clonedChildren = React.Children.map<React.ReactNode, React.ReactNode>(
    children,
    (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { provider, userAddress });
      }
    }
  );

  function makeConnectorButton(connector: Connector) {
    if (!connector.ready && connector.id === METAMASK_ID) {
      return makeMetaMaskDeeplinkButton(connector);
    }

    return (
      <button
        disabled={!connector.ready}
        key={connector.id}
        onClick={() => connect(connector)}
      >
        {connector.name}
        {!connector.ready && ' (unsupported)'}
        {isConnecting &&
          connector.id === pendingConnector?.id &&
          ' (connecting)'}
      </button>
    );
  }

  function makeMetaMaskDeeplinkButton(connector: Connector) {
    return (
      <button
        key={connector.id}
        onClick={() =>
          openMetaMaskUrl(
            `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`
          )
        }
      >
        {connector.name}
      </button>
    );
  }

  function openMetaMaskUrl(url: string) {
    window.open(url, '_self');
    // const a = document.createElement('a');
    // a.href = url;
    // a.target = '_self';
    // document.body.appendChild(a);
    // a.click();
    // a.remove();
  }

  return data && provider ? (
    <>{clonedChildren}</>
  ) : (
    <div className={s.container} style={connectWalletStyle}>
      <div className={s.header}>Connect a Wallet</div>

      <div className={s.buttonContainer}>
        {connectors.map((connector) => makeConnectorButton(connector))}
      </div>

      {error && <div className={s.errorMessage}>{error.message}</div>}
    </div>
  );
}
