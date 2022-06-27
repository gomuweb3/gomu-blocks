import cn from 'classnames';
import { WagmiConnect } from 'src/components';
import Views from './Views';
import s from './styles.module.scss';

const WidgetPlain = () => {
  return (
    <div className={cn(s.widgetContainer)}>
      <WagmiConnect>
        <Views
          widgetStyle={{ height: '100%' }}
          walletSelectStyle={{
            position: 'absolute',
            width: '300px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </WagmiConnect>
    </div>
  );
};

export default WidgetPlain;
