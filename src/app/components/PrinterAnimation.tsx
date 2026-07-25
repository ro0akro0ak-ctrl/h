import { motion } from 'motion/react';

const printLayers = Array.from({ length: 36 }, (_, index) => {
  const progress = index / 35;
  const widthMultiplier = 1 - Math.pow(progress - 0.45, 2) * 0.85;
  return {
    id: index,
    y: 408 - index * 3.1,
    width: (52 + Math.sin(progress * Math.PI * 2.2) * 18) * widthMultiplier,
    delay: index * 0.045, // طباعة سريعة جداً ومتسارعة
  };
});

export default function PrinterAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex w-full items-center justify-center"
    >
      <div className="relative w-full max-w-[760px]">
        <svg
          viewBox="0 0 820 650"
          className="h-auto w-full overflow-visible drop-shadow-[0_50px_80px_rgba(1,20,25,0.65)]"
          role="img"
          aria-label="طابعة ثلاثية الأبعاد احترافية فائقة الواقعية"
        >
          <defs>
            {/* تدرجات معدنية داكنة واحترافية مطابقة لواقع الهياكل الصناعية */}
            <linearGradient id="machineBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e2530" />
              <stop offset="30%" stopColor="#11161d" />
              <stop offset="70%" stopColor="#242e3d" />
              <stop offset="100%" stopColor="#0b0f14" />
            </linearGradient>

            <linearGradient id="aluminumExtrusion" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5c6b7e" />
              <stop offset="25%" stopColor="#333d4a" />
              <stop offset="75%" stopColor="#1a222c" />
              <stop offset="100%" stopColor="#0d1218" />
            </linearGradient>

            <linearGradient id="stepperBody" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#161b22" />
              <stop offset="50%" stopColor="#2d3748" />
              <stop offset="100%" stopColor="#0f141a" />
            </linearGradient>

            <linearGradient id="temperedGlassBed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f1722" />
              <stop offset="90%" stopColor="#070a0f" />
              <stop offset="100%" stopColor="#020406" />
            </linearGradient>

            <linearGradient id="filamentStream" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="15%" stopColor="#38bdf8" />
              <stop offset="55%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            <radialGradient id="hotendGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff5500" stopOpacity="1" />
              <stop offset="45%" stopColor="#ff2200" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
            </radialGradient>

            <filter id="deepShadow" x="-35%" y="-35%" width="170%" height="170%">
              <feDropShadow dx="0" dy="28" stdDeviation="22" floodColor="#00090d" floodOpacity="0.6" />
            </filter>

            <filter id="neonGlow" x="-70%" y="-70%" width="240%" height="240%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComponentTransfer in="blur" result="boost">
                <feFuncA type="linear" slope="2" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="boost" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ظل أرضي ناعم تحت الطابعة */}
          <ellipse cx="410" cy="600" rx="290" ry="16" fill="#010c10" opacity="0.6" />

          {/* --- هيكل الطابعة الرئيسي --- */}
          <g filter="url(#deepShadow)">
            {/* القاعدة السفلية للإلكترونيات */}
            <rect x="140" y="490" width="540" height="72" rx="14" fill="url(#machineBody)" stroke="#334155" strokeWidth="2" />
            
            {/* أرجل مطاطية مانعة للانهزاز */}
            <rect x="175" y="562" width="60" height="12" rx="5" fill="#05070a" />
            <rect x="585" y="562" width="60" height="12" rx="5" fill="#05070a" />

            {/* شاشة التحكم المضيئة (LCD Panel) */}
            <rect x="185" y="508" width="190" height="42" rx="7" fill="#06090f" stroke="#1e293b" strokeWidth="2" />
            <rect x="198" y="517" width="120" height="6" rx="3" fill="#38bdf8" opacity="0.95" />
            <rect x="198" y="530" width="80" height="4" rx="2" fill="#64748b" opacity="0.8" />
            <circle cx="342" cy="529" r="12" fill="#111827" stroke="#334155" strokeWidth="2" />
            <circle cx="342" cy="529" r="4.5" fill="#38bdf8" />

            {/* شعار العلامة التجارية */}
            <rect x="525" y="512" width="125" height="34" rx="5" fill="#080c14" stroke="#334155" strokeWidth="1.5" />
            <text x="587" y="534" fill="#f1f5f9" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="2.5" textAnchor="middle">3D TECH</text>

            {/* أعمدة الألومنيوم الجانبية الرأسية */}
            <rect x="175" y="100" width="36" height="405" rx="5" fill="url(#aluminumExtrusion)" stroke="#475569" strokeWidth="2" />
            <line x1="193" y1="100" x2="193" y2="505" stroke="#000" strokeWidth="2.5" opacity="0.7" />

            <rect x="609" y="100" width="36" height="405" rx="5" fill="url(#aluminumExtrusion)" stroke="#475569" strokeWidth="2" />
            <line x1="627" y1="100" x2="627" y2="505" stroke="#000" strokeWidth="2.5" opacity="0.7" />

            {/* عارضة الإطار العلوي */}
            <rect x="155" y="80" width="510" height="32" rx="7" fill="url(#machineBody)" stroke="#475569" strokeWidth="2" />
            
            {/* حامل بكرة الخيط (Filament Spool) في الأعلى */}
            <path d="M410 80 V35" stroke="#94a3b8" strokeWidth="9" strokeLinecap="round" />
            <circle cx="410" cy="30" r="34" fill="none" stroke="#0284c7" strokeWidth="13" strokeDasharray="170 30" strokeDashoffset="12" />
            <circle cx="410" cy="30" r="34" fill="none" stroke="#0c4a6e" strokeWidth="13" opacity="0.5" />
            <circle cx="410" cy="30" r="11" fill="#e2e8f0" />

            {/* أنبوب تغذية الخيط الشفاف (PTFE Bowden Tube) */}
            <path d="M410 64 C410 22 590 22 610 130" fill="none" stroke="#f1f5f9" strokeWidth="6.5" strokeLinecap="round" opacity="0.85" />
            <path d="M410 64 C410 22 590 22 610 130" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 8" />

            {/* قضبان التوجيه الفولاذية الدقيقة */}
            <line x1="222" y1="112" x2="222" y2="495" stroke="#cbd5e1" strokeWidth="3.5" />
            <line x1="598" y1="112" x2="598" y2="495" stroke="#cbd5e1" strokeWidth="3.5" />

            {/* منصة الطباعة المسخنة (Heated Bed) */}
            <g>
              <rect x="225" y="432" width="370" height="20" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              <rect x="240" y="416" width="340" height="20" rx="4" fill="url(#temperedGlassBed)" stroke="#475569" strokeWidth="2" />
              
              {/* شبكة إحداثيات السطح */}
              <rect x="260" y="420" width="300" height="12" fill="#04060a" />
              <line x1="410" y1="420" x2="410" y2="432" stroke="#1e293b" strokeWidth="1.2" />
              <line x1="260" y1="426" x2="560" y2="426" stroke="#1e293b" strokeWidth="1.2" />

              {/* بكرات ضبط مستوى السطح */}
              <circle cx="270" cy="442" r="7.5" fill="#0a0f18" stroke="#475569" strokeWidth="1.5" />
              <circle cx="550" cy="442" r="7.5" fill="#0a0f18" stroke="#475569" strokeWidth="1.5" />
            </g>
          </g>

          {/* --- المجسم المطبوع (يتطور طبقة تلو الأخرى بسرعة وواقعية) --- */}
          <g filter="url(#neonGlow)">
            {printLayers.map((layer, index) => (
              <motion.rect
                key={layer.id}
                x={410 - layer.width / 2}
                y={layer.y}
                width={layer.width}
                height="3.4"
                rx="1.7"
                fill="url(#filamentStream)"
                initial={{ opacity: 0, scaleX: 0.05 }}
                animate={{
                  opacity: [0, 0, 1, 1, 0],
                  scaleX: [0.05, 0.05, 1, 1, 0.05],
                }}
                transition={{
                  duration: 5.5, // سرعة عالية في الطباعة
                  delay: layer.delay,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                  times: [0, 0.04, 0.12, 0.9, 1],
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '410px center' }}
              />
            ))}

            {/* نقطة حرارية ساطعة تمثل فوهة الطابعة أثناء الصهر */}
            <motion.ellipse
              cx="410"
              cy="408"
              rx="22"
              ry="4.5"
              fill="url(#hotendGlow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1, 1, 0] }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                repeatDelay: 0.5,
                times: [0, 0.04, 0.12, 0.9, 1],
              }}
            />
          </g>

          {/* --- رأس الطابعة المتحرك (ينزل للأسفل وقت الطباعة ليلامس المجسم بدقة ثم يرتفع) --- */}
          <motion.g
            animate={{
              y: [0, 155, 155, 0], // ينزل من الأعلى إلى مكان الطباعة، يطبع، ثم يرتفع للأعلى بذكاء
              x: [-110, 110, -70, 0],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.15, 0.85, 1],
            }}
          >
            {/* العارضة الأفقية الحاملة للرأس */}
            <rect x="170" y="128" width="480" height="26" rx="6" fill="url(#aluminumExtrusion)" stroke="#64748b" strokeWidth="2" />
            <line x1="170" y1="141" x2="650" y2="141" stroke="#0a0f14" strokeWidth="2.5" />

            {/* وحدة الإكسترودر (Extruder Assembly) متحركة أفقياً وعمودياً */}
            <g transform="translate(372, 118)">
              {/* محرك الـ Stepper */}
              <rect x="0" y="0" width="76" height="54" rx="8" fill="url(#stepperBody)" stroke="#475569" strokeWidth="2" />
              <rect x="12" y="8" width="52" height="38" rx="4" fill="#0d1218" />
              <circle cx="38" cy="27" r="14" fill="#070a0f" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="38" cy="27" r="4.5" fill="#38bdf8" />

              {/* زعانف تبريد */}
              <line x1="12" y1="48" x2="64" y2="48" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="12" y1="52" x2="64" y2="52" stroke="#94a3b8" strokeWidth="1.5" />

              {/* كتلة التسخين والفوهة البرونزية الواقعية */}
              <rect x="24" y="54" width="28" height="18" rx="3" fill="#d97706" stroke="#fbbf24" strokeWidth="1.5" />
              <polygon points="32,72 44,72 38,84" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />

              {/* شرارة او توهج الفوهة الساخنة */}
              <circle cx="38" cy="84" r="5.5" fill="#ffffff" filter="url(#neonGlow)" />

              {/* مروحة تبريد القطعة الجانبية */}
              <path d="M12 56 L3 76 H24 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
              <path d="M64 56 L73 76 H52 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
              <circle cx="15" cy="66" r="3.5" fill="#38bdf8" opacity="0.9" />
              <circle cx="61" cy="66" r="3.5" fill="#38bdf8" opacity="0.9" />
            </g>
          </motion.g>

          {/* انعكاسات ضوئية جمالية لتعزيز الواقعية */}
          <line x1="183" y1="108" x2="183" y2="490" stroke="#ffffff" strokeWidth="2.5" opacity="0.3" />
          <line x1="617" y1="108" x2="617" y2="490" stroke="#ffffff" strokeWidth="2" opacity="0.2" />
        </svg>
      </div>
    </motion.div>
  );
}
