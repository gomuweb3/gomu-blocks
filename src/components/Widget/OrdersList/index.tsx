import { useState, useContext } from 'react';
import { useQuery } from 'react-query';
import cn from 'classnames';
import { rangeFromZero } from 'src/utils';
import { MARKETPLACES, ORDER_ID_SEPARATOR } from '../constants';
import { WidgetContext } from '../context';
import Order, { getNormalizedOrder } from './Order';
import orderS from './styles.module.scss';
import s from '../styles.module.scss';

const OrdersList = ({
  heading,
}: {
  heading: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [cancelledIds, setCancelledIds] = useState<string[]>([]);
  const { userAddress, chainId, gomuSdk } = useContext(WidgetContext)!;

  const { data: ordersData, isLoading: ordersLoading } = useQuery(
    ['orders', userAddress, chainId],
    () => gomuSdk.getOrders({ maker: userAddress }),
    { enabled: !!userAddress },
  );

  const handleSelectOrder = (id: string) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter((_id) => _id !== id)
      : selectedIds.concat(id);

    setSelectedIds(newIds);
  };

  const handleCancelOrders = async () => {
    setIsCancelling(true);
    try {
      await Promise.all(selectedIds.map(async (id) => {
        const [marketplaceName, mpId] = id.split(ORDER_ID_SEPARATOR);
        const mpConfig = MARKETPLACES.find((config) => config.key === marketplaceName);
        const order = mpConfig?.getOrderById(ordersData!.orders, mpId);
        if (order) {
          try {
            await gomuSdk.cancelOrder(order);
            setCancelledIds((ids) => ids.concat(id));
          } catch (e) {
            //
          }
        }
      }));
    } catch (e) {
      //
    }

    setSelectedIds([]);
    setIsCancelling(false);
    setIsEditing(false);
  };

  const renderOrders = () => {
    if (ordersLoading) {
      return rangeFromZero(6).map((index) => {
        return (
          <div key={index} className={cn(orderS.order, 'g-processing')}>
            <div className={orderS.orderInner}>
              <div className={orderS.orderImg} />
            </div>
          </div>
        );
      });
    }

    if (!ordersData?.orders.length) {
      return <p className={orderS.noOrders}>No Orders Found</p>;
    }

    return ordersData.orders.map((order) => {
      const normalizedOrder = getNormalizedOrder(order);

      if (!normalizedOrder) {
        return null;
      }

      if (order.marketplaceName === 'opensea') {
        console.log(order.marketplaceOrder);
      }

      return (
        <Order
          key={normalizedOrder.id}
          order={normalizedOrder}
          originalOrder={order}
          selectedIds={selectedIds}
          cancelledIds={cancelledIds}
          isEditing={isEditing}
          isCancelling={isCancelling}
          onSelect={handleSelectOrder}
        />
      );
    });
  };

  return (
    <div className={cn(s.widgetContent, { [s._nonInteractive]: isCancelling })}>
      <div className={s.widgetContentHeader}>
        <h3 className={s.widgetHeading}>
          {heading}
        </h3>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}
      </div>
      <div className={s.widgetContentInner}>
        {renderOrders()}
      </div>
      <div className={s.widgetContentFooter}>
        <div className={s.widgetContentFooterInner}>
          {isEditing && (
            <button
              type="button"
              className={s._borderStyle}
              onClick={() => {
                setIsEditing(false);
                setSelectedIds([]);
              }}
            >
              Back
            </button>
          )}
          {selectedIds.length && (
            <button
              type="button"
              onClick={handleCancelOrders}
            >
              Cancel{isCancelling ? 'ling' : ''}
              {selectedIds.length ? ` ${selectedIds.length} ` : ''}
              Order{selectedIds.length > 1 ? 's' : ''}
              {isCancelling ? '...' : ''}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
