import { motion } from 'motion/react';

const layers = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  width: 92 - index * 2.4,
  y: 388 - index * 5.1,
  delay: index * 0.28,
}));

export default function PrinterAnimation() {
  return (
    <section
      dir="rtl"
      className="relative flex min-h-[620px] items-center justify-center overflow-hidden bg-[#16B8BE] px-4 py-16 sm:px-8 md:min-h-[760px] md:py-24"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full max-w-[760px]"
      >
        <svg
          viewBox="0 0 760 620"
          className="h-auto w-full overflow-visible drop-shadow-[0_35px_55px_rgba(5,45,49,0.28)]"
          role="img"
          aria-label="طابعة ثلاثية الأبعاد تطبع مجسمًا"
        >
          <defs>
            <linearGradient id="frame" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#18373B" />
              <stop offset="55%" stopColor="#10292D" />
              <stop offset="100%" stopColor="#081B1E" />
            </linearGradient>

            <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#A8B8BC" />
              <stop offset="45%" stopColor="#E5EEF0" />
              <stop offset="100%" stopColor="#85989D" />
            </linearGradient>

            <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D9FFFF" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0E555C" stopOpacity="0.22" />
            </linearGradient>

            <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7AF3EF" />
              <stop offset="45%" stopColor="#21D1D3" />
              <stop offset="100%" stopColor="#078D98" />
            </linearGradient>

            <linearGradient id="model" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A6FFFB" />
              <stop offset="50%" stopColor="#34D9D8" />
              <stop offset="100%" stopColor="#0A8D97" />
            </linearGradient>

            <radialGradient id="innerLight" cx="50%" cy="38%" r="65%">
              <stop offset="0%" stopColor="#44DFDE" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#44DFDE" stopOpacity="0" />
            </radialGradient>

            <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow
                dx="0"
                dy="18"
                stdDeviation="16"
                floodColor="#05272B"
                floodOpacity="0.4"
              />
            </filter>

            <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ظل الطابعة */}
          <motion.ellipse
            cx="380"
            cy="578"
            rx="245"
            ry="24"
            fill="#062A2E"
            animate={{ rx: [245, 220, 245], opacity: [0.24, 0.14, 0.24] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* جسم الطابعة */}
          <g filter="url(#softShadow)">
            <rect x="110" y="38" width="540" height="510" rx="30" fill="url(#frame)" />
            <rect
              x="126"
              y="54"
              width="508"
              height="478"
              rx="22"
              fill="#0A1F22"
              stroke="#35565B"
              strokeWidth="2"
            />

            {/* الباب الزجاجي */}
            <rect
              x="150"
              y="92"
              width="460"
              height="376"
              rx="16"
              fill="url(#glass)"
              stroke="#5D777B"
              strokeWidth="2"
            />
            <rect x="164" y="106" width="432" height="348" rx="12" fill="url(#innerLight)" />

            {/* لمعان الزجاج */}
            <path
              d="M180 116 L300 116 L215 446 L164 446 Z"
              fill="#FFFFFF"
              opacity="0.035"
            />

            {/* الشريط العلوي */}
            <rect x="144" y="70" width="472" height="34" rx="12" fill="#142F33" />
            <rect x="164" y="82" width="318" height="7" rx="3.5" fill="#2B4B50" />
            <motion.circle
              cx="586"
              cy="87"
              r="6"
              fill="#65EEE9"
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 1.3, repeat: Infinity }}
            />

            {/* الأعمدة */}
            <rect x="158" y="112" width="24" height="356" rx="8" fill="#1B3A3F" />
            <rect x="578" y="112" width="24" height="356" rx="8" fill="#1B3A3F" />

            {/* محور الحركة */}
            <rect x="182" y="170" width="396" height="16" rx="8" fill="#213F44" />
            <rect x="195" y="175" width="370" height="5" rx="2.5" fill="url(#metal)" opacity="0.75" />

            {/* سرير الطباعة */}
            <motion.g
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path
                d="M215 430 L545 430 L580 460 L180 460 Z"
                fill="#1A383D"
                stroke="#5E7A7F"
                strokeWidth="2"
              />
              <path d="M237 438 L523 438 L548 455 L212 455 Z" fill="#31545A" />
              <path d="M250 442 L510 442" stroke="#54E2DF" strokeWidth="3" opacity="0.42" />
            </motion.g>

            {/* قاعدة الطابعة */}
            <rect x="140" y="500" width="480" height="42" rx="14" fill="#122E32" />
            <rect x="166" y="512" width="300" height="8" rx="4" fill="#27484D" />

            {/* شاشة صغيرة */}
            <rect x="490" y="507" width="102" height="28" rx="8" fill="#071719" stroke="#426268" />
            <motion.rect
              x="503"
              y="516"
              width="42"
              height="4"
              rx="2"
              fill="#41E1DF"
              animate={{ width: [16, 66, 16] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </g>

          {/* بكرة الفيلامنت */}
          <motion.g
            style={{ transformOrigin: '550px 92px' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          >
            <circle cx="550" cy="92" r="48" fill="#10262A" stroke="#48666B" strokeWidth="8" />
            <circle
              cx="550"
              cy="92"
              r="31"
              fill="none"
              stroke="#2DD7D7"
              strokeWidth="9"
              strokeDasharray="16 9"
            />
            <circle cx="550" cy="92" r="12" fill="#89F6F2" />
          </motion.g>

          {/* مسار الفيلامنت */}
          <motion.path
            d="M550 139 C550 162 470 164 420 200"
            fill="none"
            stroke="#79F1ED"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="11 9"
            animate={{ strokeDashoffset: [0, -40] }}
            transition={{ duration: 1.25, repeat: Infinity, ease: 'linear' }}
          />

          {/* المجسم المطبوع */}
          <g filter="url(#glow)">
            {layers.map((layer, index) => (
              <motion.path
                key={layer.id}
                d={`M${380 - layer.width / 2} ${layer.y} Q380 ${layer.y - 8} ${
                  380 + layer.width / 2
                } ${layer.y} L${380 + layer.width / 2 - 5} ${layer.y + 5} Q380 ${
                  layer.y - 2
                } ${380 - layer.width / 2 + 5} ${layer.y + 5} Z`}
                fill="url(#model)"
                initial={{ opacity: 0, scaleX: 0.12 }}
                animate={{
                  opacity: [0, 0, 1, 1, 0],
                  scaleX: [0.12, 0.12, 1, 1, 0.12],
                }}
                transition={{
                  duration: 11,
                  delay: layer.delay,
                  repeat: Infinity,
                  repeatDelay: 1.2,
                  times: [0, 0.1, 0.72, 0.92, 1],
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '380px center' }}
              />
            ))}
          </g>

          {/* رأس الطباعة */}
          <motion.g
            animate={{ x: [-112, 112, -112], y: [0, 44, 0] }}
            transition={{
              x: { duration: 2.25, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 11, repeat: Infinity, ease: 'linear' },
            }}
          >
            <rect x="337" y="148" width="86" height="70" rx="18" fill="url(#accent)" stroke="#B8FFFC" strokeWidth="2" />
            <rect x="353" y="165" width="54" height="30" rx="9" fill="#10353A" />
            <motion.circle
              cx="380"
              cy="180"
              r="6"
              fill="#9CFFFA"
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 0.75, repeat: Infinity }}
            />
            <path d="M362 218 L398 218 L390 239 L370 239 Z" fill="#DFFFFD" />
            <path d="M374 239 L386 239 L390 258 L370 258 Z" fill="#28D5D4" />
            <motion.path
              d="M380 258 L380 278"
              stroke="#9BFFFB"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 0.38, repeat: Infinity }}
            />
          </motion.g>
        </svg>
      </motion.div>
    </section>
  );
}
