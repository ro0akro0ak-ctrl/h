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
      className={`inline-flex items-center whitespace-nowrap gap-2 ${className}`}
    >
      <img
        src="/omr-symbol.png"
        alt="OMR"
        className={`w-auto h-[0.9em] shrink-0 ${symbolClassName}`}
      />

      <span>{safeAmount.toFixed(decimals)}</span>
    </span>
  );
}
