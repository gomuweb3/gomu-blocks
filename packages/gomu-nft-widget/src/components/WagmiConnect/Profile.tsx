import React from 'react';
import { ExternalProvider } from '@ethersproject/providers';
import { useConnect, useAccount } from 'wagmi';
import s from './profile.styles.module.scss';

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

  return data && provider ? (
    <>{clonedChildren}</>
  ) : (
    <div className={s.container} style={connectWalletStyle}>
      <div className={s.header}>Connect a Wallet</div>

      <div className={s.buttonContainer}>
        {connectors.map((connector) => (
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
        ))}
      </div>

      {error && <div className={s.errorMessage}>{error.message}</div>}
    </div>
  );
}
