import { PricedAsset } from '../types';
import s from './styles.module.scss';

const AssetsConfirmation = ({
  assets,
  onEdit,
}: {
  assets: PricedAsset[];
  onEdit: () => void;
}) => {
  return (
    <div className={s.confirmation}>

    </div>
  );
};

export default AssetsConfirmation;
