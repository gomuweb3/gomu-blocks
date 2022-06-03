import { useState, useContext } from 'react';
import { useQuery } from 'react-query';
import cn from 'classnames';
import { rangeFromZero } from 'src/utils';
import { WidgetContext } from '../context';
import renderOrder from './Order';
import orderS from './styles.module.scss';
import s from '../styles.module.scss';

const OrdersList = ({
  heading,
}: {
  heading: string;
}) => {
  const [isEditingOrders, setIsEditingOrders] = useState(false);
  const [selectedOrdersIds, setSelectedOrdersIds] = useState<string[]>([]);
  const { userAddress, chainId, gomuSdk } = useContext(WidgetContext)!;

  const { data: ordersData, isLoading: ordersLoading } = useQuery(
    ['orders', userAddress, chainId],
    () => gomuSdk.getOrders({ maker: userAddress }),
    { enabled: !!userAddress },
  );

  const renderOrders = () => {
    if (ordersLoading) {
      return rangeFromZero(6).map((index) => {
        return (
          <div key={index} className={cn(orderS.order, 'g-processing')}>
            <div className={orderS.orderImg} />
          </div>
        );
      });
    }

    if (!ordersData?.orders.length) {
      return <p className={orderS.noOrders}>No Orders Found</p>;
    }

    return ordersData.orders.map(renderOrder);
  };

  return (
    <div className={s.widgetContent}>
      <div className={s.widgetContentHeader}>
        <h3 className={s.widgetHeading}>
          {heading}
        </h3>
        {!isEditingOrders && (
          <button
            type="button"
            onClick={() => setIsEditingOrders(true)}
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
          <button
            type="button"
            className={s._borderStyle}
            onClick={() => {
              setIsEditingOrders(false);
              setSelectedOrdersIds([]);
            }}
          >
            Back
          </button>
          {selectedOrdersIds.length && (
            <button
              type="button"
              onClick={() => {
                // TODO cancel orders
              }}
            >
              Cancel
              {selectedOrdersIds.length ? ` ${selectedOrdersIds.length} ` : ''}
              Order{selectedOrdersIds.length > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
