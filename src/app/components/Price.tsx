interface PriceProps {
  value: number | string;
  className?: string;
}

export default function Price({
  value,
  className = "",
}: PriceProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 ${className}`}
      dir="ltr"
    >
      <span>{Number(value).toFixed(3)}</span>

      <img
        src="/omr-symbol.png"
        alt="OMR"
        className="h-4 w-auto object-contain"
      />
    </span>
  );
}
