interface PriceProps {
  amount?: number | string;
  value?: number | string;
  decimals?: number;
  className?: string;
  symbolClassName?: string;
}

export default function Price({
  amount,
  value,
  decimals = 3,
  className = '',
  symbolClassName = '',
}: PriceProps) {
  const receivedValue = amount ?? value ?? 0;
  const numericAmount = Number(receivedValue);

  const safeAmount = Number.isFinite(numericAmount)
    ? numericAmount
    : 0;

  return (
    <span
      dir="ltr"
      className={`inline-flex items-center gap-1.5 whitespace-nowrap ${className}`}
    >
      <span>{safeAmount.toFixed(decimals)}</span>

      <img
        src="/omr-symbol.png"
        alt="ريال عُماني"
        className={`inline-block h-[0.85em] w-auto object-contain ${symbolClassName}`}
      />
    </span>
  );
}
