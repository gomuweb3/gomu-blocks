import { useRef } from 'react';
import { cutAddress } from 'src/utils';
import s from './styles.module.scss';

interface IProps {
  address: string;
}

const AddressBox = ({ address }: IProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const executeCopy = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand('copy');
      inputRef.current.blur();
    }
  };

  return (
    <div className={s.addressBox} onClick={executeCopy} title="Copy">
      <input ref={inputRef} className={s.addressBoxInput} value={address} readOnly />
      {cutAddress(address)}
    </div>
  );
};

export default AddressBox;
