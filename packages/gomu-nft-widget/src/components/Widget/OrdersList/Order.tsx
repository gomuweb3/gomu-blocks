import { useContext } from 'react';
import { useQuery } from 'react-query';
import cn from 'classnames';
import { getNftsByToken } from 'src/api';
import { getImgFromAsset, toUnitAmount } from 'src/utils';
import { ExternalLinkIcon, Loader } from 'src/assets/svg';
import Checkbox from '../Checkbox';
import Erc20Amount from '../Erc20Amount';
import { MARKETPLACES } from '../constants';
import { WidgetContext } from '../context';
import { GomuOrder, NormalizedOrder } from '../types';
import s from './styles.module.scss';

export const getNormalizedOrder = (order: GomuOrder) => {
  const marketplaceConfig = MARKETPLACES.find((mp) => mp.key === order.marketplaceName);
  if (marketplaceConfig) {
    return marketplaceConfig.getNormalizedOrder(order);
  }
  return null;
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
  const { erc20Tokens, chainId } = useContext(WidgetContext)!;

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
  const link = marketplaceInfo?.buildExternalLink ? marketplaceInfo.buildExternalLink(originalOrder, chainId) : '';
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
          <Erc20Amount
            amount={formattedAmount}
            erc20Token={erc20TokenInfo}
            className={s.orderErc20}
          />
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
