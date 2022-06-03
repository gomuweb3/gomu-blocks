import { useQuery } from 'react-query';
import s from './styles.module.scss';

const OrdersList = ({
  userAddress,
  chainId,
  isEditingOrders,
}: {
  userAddress: string;
  chainId: number;
  isEditingOrders: boolean;
}) => {
  return (
    <div className={s.orders}>

    </div>
  );
};

export default OrdersList;
