import { useContext } from 'react';
import { useQuery } from 'react-query';
import { Order as GomuOrder, TraderOrder } from '@gomuweb3/sdk/lib/types';
import { getNftsByToken } from 'src/api';
import { getImgFromAsset, toUnitAmount } from 'src/utils';
import { MARKETPLACES } from '../constants';
import { WidgetContext } from '../context';
import { MarketplaceName } from '../types';
import s from './styles.module.scss';

interface NormalizedOrder {
  nonce: string;
  asset: {
    contractAddress: string;
    tokenId: string;
    type: string;
    amount: string;
  };
  erc20Asset: {
    contractAddress: string;
    amount: string;
  };
}

const getNormalizedOrder = ({
  marketplaceName,
  marketplaceOrder,
}: GomuOrder): NormalizedOrder | null => {
  if (marketplaceName === 'trader') {
    const order = marketplaceOrder as TraderOrder['marketplaceOrder'];
    return {
      nonce: order.order.nonce,
      asset: {
        contractAddress: order.nftToken,
        tokenId: order.nftTokenId,
        type: order.nftType,
        amount: order.nftTokenAmount,
      },
      erc20Asset: {
        contractAddress: order.erc20Token,
        amount: order.erc20TokenAmount,
      },
    };
  }

  return null;
};

const NormalizedOrder = ({
  order: { nonce, asset, erc20Asset },
  marketplaceName,
}: {
  order: NormalizedOrder;
  marketplaceName: MarketplaceName;
}) => {
  const { erc20Tokens } = useContext(WidgetContext)!;

  const { data: nftData } = useQuery(
    ['nftAsset', asset.contractAddress, asset.tokenId],
    () => getNftsByToken({
      contractAddress: asset.contractAddress!,
      tokenId: asset.tokenId!,
    }),
  );

  const img = getImgFromAsset(nftData?.data?.[0]);
  const name = nftData?.data?.[0].metadata?.name;
  const erc20TokenInfo = erc20Tokens.find((t) => t.address === erc20Asset.contractAddress);
  const marketplaceInfo = MARKETPLACES.find((mp) => mp.key === marketplaceName);
  const formattedAmount = toUnitAmount(erc20Asset.amount, erc20TokenInfo?.decimals);
  const amountLimit = 10;
  const slicedAmount = formattedAmount.slice(0, amountLimit);

  return (
    <div className={s.order}>
      <div className={s.orderImg}>
        {img && <img src={img} alt="" />}
      </div>
      <div className={s.orderInfo}>
        {name && <p title={name}>{name}</p>}
        <p title={asset.tokenId}>{asset.tokenId}</p>
        <p
          className={s.orderErc20}
          title={`${formattedAmount} ${erc20TokenInfo?.symbol}`}
        >
          {`${slicedAmount}${formattedAmount.length > amountLimit ? '...' : ''}`}
          {erc20TokenInfo && <img src={erc20TokenInfo.imgUrl} alt={erc20TokenInfo.symbol} />}
        </p>
        {marketplaceInfo && <p className={s.orderSecondary}>{marketplaceInfo.label}</p>}
      </div>
    </div>
  );
};

const renderOrder = (order: GomuOrder) => {
  const normalizedOrder = getNormalizedOrder(order);

  if (!normalizedOrder) {
    return null;
  }

  return (
    <NormalizedOrder
      key={normalizedOrder.nonce}
      order={normalizedOrder}
      marketplaceName={order.marketplaceName}
    />
  );
};

export default renderOrder;
