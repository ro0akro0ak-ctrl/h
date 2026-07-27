interface PriceProps {
  amount: number | string;
  decimals?: number;
  className?: string;
  symbolClassName?: string;
}

export default function Price({
  amount,
  decimals = 3,
  className = '',
  symbolClassName = '',
}: PriceProps) {
  const numericAmount = Number(amount) || 0;

  return (
    <span
      dir="ltr"
      className={`inline-flex items-center gap-1.5 whitespace-nowrap ${className}`}
    >
      <span>{numericAmount.toFixed(decimals)}</span>

      <img
        src="/omr-symbol.svg"
        alt="ريال عُماني"
        className={`inline-block h-[0.9em] w-auto object-contain ${symbolClassName}`}
      />
    </span>
  );
}
