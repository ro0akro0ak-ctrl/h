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
      className={`inline-flex items-center gap-2 whitespace-nowrap ${className}`}
    >
      <img
        src="/omr-symbol-white.png"
        alt="ريال عُماني"
        className={`h-[0.9em] w-auto shrink-0 object-contain ${symbolClassName}`}
      />

      <span>{safeAmount.toFixed(decimals)}</span>
    </span>
  );
}
