import { useContext } from 'react';
import { useQuery } from 'react-query';
import cn from 'classnames';
import { BigNumber } from 'bignumber.js';
import { getNftsByToken } from 'src/api';
import { getImgFromAsset, toUnitAmount } from 'src/utils';
import { ExternalLinkIcon, Loader } from 'src/assets/svg';
import Checkbox from '../Checkbox';
import { MARKETPLACES } from '../constants';
import { WidgetContext } from '../context';
import { GomuOrder, TraderOrder, OpenseaOrder } from '../types';
import s from './styles.module.scss';

interface NormalizedOrder {
  id: string;
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

export const getNormalizedOrder = ({
  marketplaceName,
  marketplaceOrder,
}: GomuOrder): NormalizedOrder | null => {
  switch (marketplaceName) {
    case 'trader':
      const order = marketplaceOrder as TraderOrder['marketplaceOrder'];
      return {
        id: `trader__${order.order.nonce}`,
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
    case 'opensea':
      const { hash, asset, quantity, paymentToken, basePrice } = marketplaceOrder as OpenseaOrder['marketplaceOrder'];
      return {
        id: `opensea__${hash}`,
        asset: {
          contractAddress: asset!.tokenAddress,
          tokenId: asset!.tokenId!,
          type: asset!.assetContract.schemaName,
          amount: new BigNumber(quantity).toString(),
        },
        erc20Asset: {
          contractAddress: paymentToken,
          amount: new BigNumber(basePrice).toString(),
        },
      };
    default:
      return null;
  }
};

const Order = ({
  order,
  originalOrder,
  selectedIds,
  cancelledIds,
  isEditing,
  isCancelling,
  onSelect,
}: {
  order: NormalizedOrder;
  originalOrder: GomuOrder;
  selectedIds: string[];
  cancelledIds: string[];
  isEditing: boolean;
  isCancelling: boolean;
  onSelect: (id: string) => void;
}) => {
  const { erc20Tokens } = useContext(WidgetContext)!;

  const { id, asset, erc20Asset } = order;

  const { data: nftData } = useQuery(
    ['nftAsset', asset.contractAddress, asset.tokenId],
    () => getNftsByToken({
      contractAddress: asset.contractAddress!,
      tokenId: asset.tokenId!,
      includeNonStandardTokenTypes: true,
    }),
  );

  const img = getImgFromAsset(nftData?.data?.[0]);
  const name = nftData?.data?.[0]?.name;
  const erc20TokenInfo = erc20Tokens.find((t) => t.address === erc20Asset.contractAddress);
  const marketplaceInfo = MARKETPLACES.find((mp) => mp.key === originalOrder.marketplaceName);
  const formattedAmount = toUnitAmount(erc20Asset.amount, erc20TokenInfo?.decimals);
  const amountLimit = 10;
  const slicedAmount = formattedAmount.slice(0, amountLimit);
  const link = marketplaceInfo?.linkBuilder ? marketplaceInfo.linkBuilder(originalOrder) : '';
  const isSelected = selectedIds.includes(id);
  const isCancelled = cancelledIds.includes(id);

  return (
    <div
      className={cn(
        s.order,
        {
          [s._editing]: isEditing,
          [s._selected]: isSelected,
          [s._cancelled]: isCancelled,
        },
      )}
    >
      {isEditing && (
        <Checkbox
          name="isSelected"
          className={s.orderCheckbox}
          checked={isSelected}
          onChange={() => onSelect(id)}
        />
      )}
      <div className={s.orderInner}>
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
          {marketplaceInfo && (
            <p className={s.orderSecondary}>
              {`${isCancelled ? 'Cancelled on ' : ''}${marketplaceInfo.label}`}
              {(link && !isEditing) && (
                <a target="_blank" rel="noreferrer" href={link}>
                  <ExternalLinkIcon className={s.orderSecondaryLink} />
                </a>
              )}
              {isCancelling && <Loader className={s.orderSecondaryLoader} />}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
