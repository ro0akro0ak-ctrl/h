import { motion } from 'motion/react';

const layers = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  width: 75 - index * 1.8,
  y: 395 - index * 4.8,
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
          aria-label="طابعة ثلاثية الأبعاد احترافية تطبع مجسمًا واقعيًا"
        >
          <defs>
            {/* تدرجات ألوان طابعة هيكلية مغلقة احترافية (مثل سلسلة Bambu Lab / Creality CoreXY) */}
            <linearGradient id="chassisDark" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e2229" />
              <stop offset="50%" stopColor="#14171c" />
              <stop offset="100%" stopColor="#0b0d10" />
            </linearGradient>

            <linearGradient id="chassisMetal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="100%" stopColor="#1f2937" />
            </linearGradient>

            <linearGradient id="glassReal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#0e7490" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#164e63" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="extrudBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2b3441" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>

            <linearGradient id="realModel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="60%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0891b2" />
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

            <filter id="modelGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
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

          {/* هيكل الطابعة الخارجي الحديث */}
          <g filter="url(#softShadow)">
            {/* الإطار الخارجي الأسود المطفي */}
            <rect x="110" y="38" width="540" height="510" rx="28" fill="url(#chassisDark)" stroke="#27303f" strokeWidth="3" />
            
            {/* الحواف المعدنية الداخلية للإطار */}
            <rect x="124" y="52" width="512" height="482" rx="20" fill="#0c0e12" stroke="#1f2937" strokeWidth="2" />

            {/* الغرفة الداخلية للطابعة (الكابينة) */}
            <rect x="150" y="85" width="460" height="390" rx="14" fill="url(#glassReal)" stroke="#374151" strokeWidth="2" />
            
            {/* إضاءة LED داخلية خافتة من السقف */}
            <ellipse cx="380" cy="86" rx="140" ry="12" fill="#22d3ee" opacity="0.15" />
            <circle cx="380" cy="92" r="6" fill="#67e8f9" opacity="0.8" />

            {/* القضبان المعدنية الخلفية والجانبية (أعمدة الحركة المحورية X/Y/Z) */}
            <rect x="170" y="120" width="8" height="330" rx="4" fill="#4b5563" />
            <rect x="582" y="120" width="8" height="330" rx="4" fill="#4b5563" />
            <rect x="178" y="145" width="404" height="10" rx="5" fill="#374151" stroke="#6b7280" strokeWidth="1" />

            {/* سرير الطباعة السفلي (Print Bed / PEI Plate) */}
            <motion.g
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* قاعدة السرير */}
              <rect x="200" y="430" width="360" height="16" rx="4" fill="#1f2937" stroke="#4b5563" strokeWidth="2" />
              {/* سطح الطباعة المغناطيسي الأسود */}
              <rect x="215" y="423" width="330" height="8" rx="3" fill="#111827" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.5" />
              {/* مشابك التثبيت الجانبية */}
              <rect x="220" y="421" width="14" height="12" rx="2" fill="#9ca3af" />
              <rect x="526" y="421" width="14" height="12" rx="2" fill="#9ca3af" />
            </motion.g>

            {/* قاعدة الطابعة السفلية والشاشة */}
            <rect x="110" y="495" width="540" height="53" rx="16" fill="url(#chassisMetal)" />
            
            {/* شعار أو خط تزييني أنيق */}
            <rect x="140" y="518" width="120" height="6" rx="3" fill="#111827" />

            {/* شاشة تحكم رقمية تعمل باللمس (Touchscreen) */}
            <rect x="490" y="508" width="115" height="32" rx="8" fill="#030712" stroke="#4b5563" strokeWidth="1.5" />
            <motion.div
              initial={false}
            >
              <rect x="502" y="518" width="45" height="12" rx="3" fill="#22d3ee" opacity="0.9" />
              <circle cx="575" cy="524" r="5" fill="#10b981" />
            </motion.div>
          </g>

          {/* بكرة الفيلامنت العلوية (Spool Holder & Filament Spool) */}
          <motion.g
            style={{ transformOrigin: '560px 55px' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            {/* حامل البكرة */}
            <circle cx="560" cy="55" r="35" fill="#111827" stroke="#4b5563" strokeWidth="6" />
            <circle cx="560" cy="55" r="22" fill="none" stroke="#22d3ee" strokeWidth="5" strokeDasharray="12 8" />
            <circle cx="560" cy="55" r="8" fill="#9ca3af" />
          </motion.g>

          {/* أنبوب توجيه الفيلامنت الشفاف (PTFE Tube) من البكرة إلى رأس الطباعة */}
          <path
            d="M545 78 C545 110 460 115 380 148"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="4"
            strokeLinecap="round"
            strokeOpacity="0.75"
          />

          {/* المجسم المطبوع ثلاثي الأبعاد (طبقات تتصاعد بواقعية) */}
          <g filter="url(#modelGlow)">
            {layers.map((layer) => (
              <motion.path
                key={layer.id}
                d={`M${380 - layer.width / 2} ${layer.y} Q380 ${layer.y - 6} ${
                  380 + layer.width / 2
                } ${layer.y} L${380 + layer.width / 2 - 3} ${layer.y + 4} Q380 ${
                  layer.y - 2
                } ${380 - layer.width / 2 + 3} ${layer.y + 4} Z`}
                fill="url(#realModel)"
                initial={{ opacity: 0, scaleX: 0.1 }}
                animate={{
                  opacity: [0, 0, 1, 1, 0],
                  scaleX: [0.1, 0.1, 1, 1, 0.1],
                }}
                transition={{
                  duration: 10,
                  delay: layer.delay,
                  repeat: Infinity,
                  repeatDelay: 1,
                  times: [0, 0.1, 0.78, 0.92, 1],
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '380px center' }}
              />
            ))}
          </g>

          {/* رأس الطباعة الاحترافي (Extruder / Direct Drive Print Head) يتحرك بذكاء فوق المجسم */}
          <motion.g
            animate={{
              x: [-110, 110, -110],
              y: [0, 38, 0],
            }}
            transition={{
              x: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 10, repeat: Infinity, ease: 'linear' },
            }}
          >
            {/* جسم الإكسترودر المعدني والأسود */}
            <rect x="338" y="132" width="84" height="64" rx="10" fill="url(#extrudBody)" stroke="#4b5563" strokeWidth="2" />
            
            {/* مروحة تبريد الجزء المطبوع (Part Cooling Fan grill) */}
            <circle cx="380" cy="164" r="16" fill="#1f2937" stroke="#374151" strokeWidth="2" />
            <circle cx="380" cy="164" r="6" fill="#22d3ee" opacity="0.8" />

            {/* كتلة التسخين (Heater Block) والنوزل (Nozzle Tip) */}
            <rect x="362" y="196" width="36" height="18" rx="4" fill="#d97706" />
            <path d="M374 214 L386 214 L383 226 L377 226 Z" fill="#9ca3af" />
            
            {/* شعاع أو قطرة البلاستيك المنصهر الخارجة من النوزل أثناء الطباعة */}
            <motion.path
              d="M380 226 L380 242"
              stroke="#22d3ee"
              strokeWidth="3.5"
              strokeLinecap="round"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.35, repeat: Infinity }}
            />
          </motion.g>
        </svg>
      </motion.div>
    </section>
  );
}
