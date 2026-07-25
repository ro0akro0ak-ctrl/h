import { motion } from 'motion/react';

const layers = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  width: 60 - index * 1.5,
  y: 350 - index * 4.5,
  delay: index * 0.25,
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
          aria-label="طابعة Bambu Lab A1 الحقيقية ثلاثية الأبعاد تطبع مجسمًا"
        >
          <defs>
            <linearGradient id="metalBase" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d1d5db" />
              <stop offset="50%" stopColor="#9ca3af" />
              <stop offset="100%" stopColor="#6b7280" />
            </linearGradient>

            <linearGradient id="gantryMetal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e5e7eb" />
              <stop offset="100%" stopColor="#9ca3af" />
            </linearGradient>

            <linearGradient id="printModel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow
                dx="0"
                dy="18"
                stdDeviation="16"
                floodColor="#05272B"
                floodOpacity="0.4"
              />
            </filter>
          </defs>

          {/* ظل الطابعة */}
          <motion.ellipse
            cx="380"
            cy="555"
            rx="250"
            ry="22"
            fill="#062A2E"
            animate={{ rx: [250, 230, 250], opacity: [0.25, 0.15, 0.25] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* === تصميم طابعة Bambu Lab A1 الحقيقية (Bed Slinger) === */}
          <g filter="url(#softShadow)">
            {/* القاعدة السفلية للطابعة (Base Unit) */}
            <rect x="180" y="470" width="400" height="45" rx="12" fill="url(#metalBase)" stroke="#4b5563" strokeWidth="2" />
            <rect x="200" y="482" width="220" height="20" rx="4" fill="#111827" />

            {/* شاشة التحكم اللمسية الجانبية المميزة للطراز A1 */}
            <g transform="translate(480, 475) rotate(-15)">
              <rect x="0" y="0" width="75" height="45" rx="6" fill="#1f2937" stroke="#4b5563" strokeWidth="2" />
              <rect x="8" y="8" width="59" height="22" rx="3" fill="#0f172a" />
              <circle cx="37" cy="19" r="4" fill="#38bdf8" />
            </g>

            {/* القائمين الرأسيين الأيمن والأيسر (Vertical Z-Axis Towers) */}
            <rect x="205" y="150" width="24" height="325" rx="4" fill="url(#gantryMetal)" stroke="#6b7280" strokeWidth="1.5" />
            <rect x="531" y="150" width="24" height="325" rx="4" fill="url(#gantryMetal)" stroke="#6b7280" strokeWidth="1.5" />

            {/* العارضة الأفقية المتحركة للأعلى والأسفل (X-Axis Gantry) */}
            <rect x="190" y="175" width="380" height="22" rx="6" fill="url(#gantryMetal)" stroke="#4b5563" strokeWidth="1.5" />

            {/* سرير الطباعة السفلي المتحرك للأمام والخلف (Y-Axis Bed) */}
            <motion.g
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <rect x="230" y="380" width="300" height="95" rx="8" fill="#374151" stroke="#9ca3af" strokeWidth="2" />
              {/* لوح الطباعة المغناطيسي PEI الأسود */}
              <rect x="245" y="388" width="270" height="80" rx="4" fill="#111827" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.6" />
            </motion.g>
          </g>

          {/* انحناء أنبوب الفلمنت العلوي الشهير لطراز A1 (Bowden/Semi-Direct Tube Curve) */}
          <path
            d="M543 162 C543 70 320 50 320 175"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M543 162 C543 70 320 50 320 175"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="10 8"
          />

          {/* المجسم الثلاثي الأبعاد الذي تتم طباعته بدقة على سرير الطباعة */}
          <g>
            {layers.map((layer) => (
              <motion.path
                key={layer.id}
                d={`M${380 - layer.width / 2} ${layer.y} Q380 ${layer.y - 5} ${
                  380 + layer.width / 2
                } ${layer.y} L${380 + layer.width / 2 - 2} ${layer.y + 4} Q380 ${
                  layer.y - 2
                } ${380 - layer.width / 2 + 2} ${layer.y + 4} Z`}
                fill="url(#printModel)"
                initial={{ opacity: 0, scaleX: 0.1 }}
                animate={{
                  opacity: [0, 0, 1, 1, 0],
                  scaleX: [0.1, 0.1, 1, 1, 0.1],
                }}
                transition={{
                  duration: 8,
                  delay: layer.delay,
                  repeat: Infinity,
                  repeatDelay: 1,
                  times: [0, 0.1, 0.8, 0.9, 1],
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '380px center' }}
              />
            ))}
          </g>

          {/* رأس الطباعة الحقيقي لطابعة A1 (Extruder Assembly مع الشعار والمروحة) */}
          <motion.g
            animate={{
              x: [-120, 120, -120],
            }}
            transition={{
              x: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            {/* جسم رأس الطباعة */}
            <rect x="345" y="162" width="70" height="55" rx="10" fill="#1f2937" stroke="#4b5563" strokeWidth="2" />
            
            {/* الشعار الأمامي أو نافذة المروحة الدائرية في رأس A1 */}
            <circle cx="380" cy="188" r="16" fill="#374151" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="380" cy="188" r="6" fill="#38bdf8" />

            {/* النوزل وقطعة التسخين السفلية */}
            <rect x="368" y="217" width="24" height="12" rx="3" fill="#d97706" />
            <path d="M376 229 L384 229 L382 238 L378 238 Z" fill="#9ca3af" />

            {/* خط إخراج خيط الفلمنت المنصهر أثناء الطباعة */}
            <motion.path
              d="M380 238 L380 252"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />
          </motion.g>
        </svg>
      </motion.div>
    </section>
  );
}
