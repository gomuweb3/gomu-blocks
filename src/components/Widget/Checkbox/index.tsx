import { FC, ChangeEvent } from 'react';
import cn from 'classnames';
import s from './styles.module.scss';

interface IProps {
  name: string;
  label?: string;
  checked: boolean;
  className?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: FC<IProps> = ({
  name,
  label,
  checked,
  className,
  children,
  onChange,
}) => {
  return (
    <label className={cn(s.checkbox, { [s._checked]: checked }, className, 'checkbox')}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        className={s.checkboxRealCb}
        onChange={onChange}
      />
      <p className={s.checkboxLabel}>{label || children}</p>
      <div className={s.checkboxFakeCb} />
    </label>
  );
};

export default Checkbox;
