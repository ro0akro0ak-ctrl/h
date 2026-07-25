import { motion } from 'motion/react';

const printLayers = Array.from({ length: 26 }, (_, index) => {
  const progress = index / 25;

  return {
    id: index,
    y: 392 - index * 4.2,
    width: 78 - Math.sin(progress * Math.PI) * 12,
    delay: index * 0.22,
  };
});

export default function PrinterAnimation() {
  return (
    <section
      dir="rtl"
      className="relative flex min-h-[620px] items-center justify-center overflow-hidden bg-[#16B8BE] px-4 py-14 sm:px-8 md:min-h-[760px] md:py-20"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 18 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
        className="relative w-full max-w-[820px]"
      >
        <svg
          viewBox="0 0 820 650"
          className="h-auto w-full overflow-visible drop-shadow-[0_35px_60px_rgba(4,44,48,0.28)]"
          role="img"
          aria-label="طابعة ثلاثية الأبعاد واقعية تطبع مجسمًا صغيرًا"
        >
          <defs>
            <linearGradient id="silverMetal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f3f4f6" />
              <stop offset="38%" stopColor="#d1d5db" />
              <stop offset="72%" stopColor="#9ca3af" />
              <stop offset="100%" stopColor="#6b7280" />
            </linearGradient>

            <linearGradient id="darkMetal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#303845" />
              <stop offset="55%" stopColor="#1f2937" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>

            <linearGradient id="bedSurface" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#202a35" />
              <stop offset="100%" stopColor="#0b1118" />
            </linearGradient>

            <linearGradient id="printedObject" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#53d7ff" />
              <stop offset="52%" stopColor="#149fd2" />
              <stop offset="100%" stopColor="#0873a3" />
            </linearGradient>

            <radialGradient id="screenGlow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#39c6f4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0a4660" stopOpacity="0.2" />
            </radialGradient>

            <filter id="printerShadow" x="-40%" y="-40%" width="180%" height="190%">
              <feDropShadow
                dx="0"
                dy="20"
                stdDeviation="18"
                floodColor="#04383d"
                floodOpacity="0.38"
              />
            </filter>

            <filter id="objectGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <ellipse
            cx="410"
            cy="590"
            rx="260"
            ry="24"
            fill="#07393E"
            opacity="0.2"
          />

          <g filter="url(#printerShadow)">
            <rect
              x="175"
              y="500"
              width="470"
              height="54"
              rx="15"
              fill="url(#silverMetal)"
              stroke="#4b5563"
              strokeWidth="2"
            />

            <rect
              x="198"
              y="514"
              width="260"
              height="25"
              rx="5"
              fill="#101722"
            />

            <rect
              x="207"
              y="520"
              width="122"
              height="4"
              rx="2"
              fill="#43c5ef"
              opacity="0.7"
            />

            <g transform="translate(525 505) rotate(-12 46 28)">
              <rect
                x="0"
                y="0"
                width="92"
                height="56"
                rx="9"
                fill="#222b36"
                stroke="#64748b"
                strokeWidth="2"
              />
              <rect
                x="9"
                y="9"
                width="74"
                height="34"
                rx="5"
                fill="#08121e"
              />
              <rect
                x="16"
                y="16"
                width="45"
                height="5"
                rx="2.5"
                fill="#41c9f2"
                opacity="0.8"
              />
              <rect
                x="16"
                y="27"
                width="57"
                height="4"
                rx="2"
                fill="#708399"
                opacity="0.55"
              />
              <circle cx="73" cy="47" r="3.5" fill="#41c9f2" />
            </g>

            <rect
              x="210"
              y="135"
              width="28"
              height="372"
              rx="5"
              fill="url(#silverMetal)"
              stroke="#6b7280"
              strokeWidth="1.5"
            />

            <rect
              x="582"
              y="135"
              width="28"
              height="372"
              rx="5"
              fill="url(#silverMetal)"
              stroke="#6b7280"
              strokeWidth="1.5"
            />

            <rect
              x="190"
              y="156"
              width="440"
              height="26"
              rx="7"
              fill="url(#silverMetal)"
              stroke="#555f6d"
              strokeWidth="1.5"
            />

            <rect
              x="232"
              y="188"
              width="356"
              height="12"
              rx="6"
              fill="#151d27"
            />

            <rect
              x="240"
              y="192"
              width="340"
              height="3"
              rx="1.5"
              fill="#7b8795"
              opacity="0.55"
            />

            <g>
              <rect
                x="250"
                y="422"
                width="320"
                height="20"
                rx="6"
                fill="#4b5563"
                stroke="#9ca3af"
                strokeWidth="1.5"
              />

              <rect
                x="266"
                y="431"
                width="288"
                height="76"
                rx="7"
                fill="url(#bedSurface)"
                stroke="#66778a"
                strokeWidth="2"
              />

              <rect
                x="278"
                y="442"
                width="264"
                height="53"
                rx="5"
                fill="#0c131c"
              />

              <path
                d="M290 451 H530"
                stroke="#334155"
                strokeWidth="1"
                opacity="0.65"
              />
              <path
                d="M290 463 H530"
                stroke="#334155"
                strokeWidth="1"
                opacity="0.45"
              />
              <path
                d="M290 475 H530"
                stroke="#334155"
                strokeWidth="1"
                opacity="0.3"
              />
            </g>
          </g>

          <path
            d="M596 166 C600 83 393 62 362 176"
            fill="none"
            stroke="#aab4c0"
            strokeWidth="9"
            strokeLinecap="round"
          />

          <motion.path
            d="M596 166 C600 83 393 62 362 176"
            fill="none"
            stroke="#44c9f3"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="12 10"
            animate={{ strokeDashoffset: [0, -44] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />

          <g filter="url(#objectGlow)">
            {printLayers.map((layer, index) => (
              <motion.rect
                key={layer.id}
                x={410 - layer.width / 2}
                y={layer.y}
                width={layer.width}
                height="4.6"
                rx="2.3"
                fill="url(#printedObject)"
                initial={{ opacity: 0, scaleX: 0.15 }}
                animate={{
                  opacity: [0, 0, 1, 1, 0],
                  scaleX: [0.15, 0.15, 1, 1, 0.15],
                }}
                transition={{
                  duration: 11,
                  delay: layer.delay,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  times: [
                    0,
                    Math.min(0.72, 0.08 + index * 0.024),
                    Math.min(0.82, 0.13 + index * 0.024),
                    0.93,
                    1,
                  ],
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '410px center' }}
              />
            ))}

            <motion.ellipse
              cx="410"
              cy="392"
              rx="38"
              ry="7"
              fill="#72defe"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.9, 0.9, 0] }}
              transition={{
                duration: 11,
                repeat: Infinity,
                repeatDelay: 1.5,
                times: [0, 0.7, 0.82, 0.93, 1],
              }}
            />
          </g>

          <motion.g
            animate={{ x: [-118, 118, -118] }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <rect
              x="372"
              y="170"
              width="76"
              height="63"
              rx="12"
              fill="url(#darkMetal)"
              stroke="#4b5563"
              strokeWidth="2"
            />

            <rect
              x="382"
              y="180"
              width="56"
              height="42"
              rx="9"
              fill="#252f3a"
            />

            <circle
              cx="410"
              cy="201"
              r="16"
              fill="#101923"
              stroke="#4bcdf5"
              strokeWidth="2"
            />

            <circle
              cx="410"
              cy="201"
              r="6"
              fill="url(#screenGlow)"
            />

            <path
              d="M399 233 H421 L417 245 H403 Z"
              fill="#c87b18"
            />

            <path
              d="M406 245 H414 L412 256 H408 Z"
              fill="#b9c1cc"
            />

            <motion.path
              d="M410 256 V274"
              stroke="#4fd4ff"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 0.38, repeat: Infinity }}
            />
          </motion.g>

          <path
            d="M219 155 V490"
            stroke="#ffffff"
            strokeWidth="3"
            opacity="0.22"
          />

          <path
            d="M590 155 V490"
            stroke="#ffffff"
            strokeWidth="3"
            opacity="0.18"
          />
        </svg>
      </motion.div>
    </section>
  );
}
