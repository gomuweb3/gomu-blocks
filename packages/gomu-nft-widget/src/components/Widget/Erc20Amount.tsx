import { TokenInfo } from './types';

const Erc20Amount = ({
  amount,
  erc20Token,
  className,
  amountMaxLength = 10,
}: {
  amount: string;
  erc20Token?: TokenInfo;
  className?: string;
  amountMaxLength?: number;
}) => {
  const slicedAmount = amount.slice(0, amountMaxLength);
  const amountString = `${slicedAmount}${amount.length > amountMaxLength ? '...' : ''}`;
  if (!erc20Token) {
    return <p className={className} title={amountString}>amountString</p>;
  }

  const { imgUrl, symbol } = erc20Token;

  return (
    <p className={className} title={`${symbol} ${amount}`}>
      {imgUrl ? <img src={imgUrl} alt={symbol} /> : symbol}
      {amountString}
    </p>
  );
};

export default Erc20Amount;
