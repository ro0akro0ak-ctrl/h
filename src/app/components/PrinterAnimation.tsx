import { motion } from 'motion/react';
import {
  Box,
  Layers3,
  Sparkles,
  Zap,
} from 'lucide-react';

const particles = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: (index * 29) % 100,
  top: (index * 37) % 100,
  size: index % 4 === 0 ? 7 : 4,
  duration: 7 + (index % 6),
  delay: (index % 9) * 0.35,
}));

const printLayers = Array.from({ length: 17 }, (_, index) => ({
  id: index,
  width: 98 - index * 2.6,
  y: 422 - index * 5.8,
  delay: index * 0.38,
}));

export default function PrinterAnimation() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden bg-gradient-to-br from-white via-[#F4FCFD] to-[#E5F8FA] px-5 py-20 text-[#10292D] sm:px-8 md:py-28"
    >
      {/* النقاط المتحركة */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute rounded-full bg-[#16B8BE]"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              opacity: [0.12, 0.5, 0.12],
              y: [0, -45, 0],
              x: [
                0,
                particle.id % 2 === 0 ? 16 : -16,
                0,
              ],
              scale: [1, 1.25, 1],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* توهجات خلفية */}
      <motion.div
        className="pointer-events-none absolute -right-36 top-20 h-96 w-96 rounded-full bg-[#16B8BE]/15 blur-[100px]"
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.25, 0.5, 0.25],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="pointer-events-none absolute -bottom-40 -left-20 h-[420px] w-[420px] rounded-full bg-[#16B8BE]/10 blur-[110px]"
        animate={{
          scale: [1.15, 0.95, 1.15],
          opacity: [0.4, 0.18, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-[1400px] items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* النص */}
        <motion.div
          initial={{ opacity: 0, x: 35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-right"
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#16B8BE]/25 bg-white/70 px-5 py-3 text-sm font-bold text-[#117C84] shadow-sm backdrop-blur-xl"
          >
            <Sparkles className="h-4 w-4" />
            الطباعة تبدأ من فكرة
          </motion.div>

          <h2 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
            نصنع فكرتك
            <span className="mt-2 block bg-gradient-to-l from-[#087781] to-[#16B8BE] bg-clip-text text-transparent">
              طبقة بعد طبقة
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-[#10292D]/65 lg:mx-0">
            شاهد كيف تتحول الفكرة الرقمية إلى مجسم حقيقي
            بدقة، وثبات، وتفاصيل احترافية.
          </p>

          <div className="mt-9 grid grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-3xl border border-[#16B8BE]/15 bg-white/65 p-4 shadow-sm backdrop-blur-xl sm:p-5">
              <Layers3 className="mx-auto h-6 w-6 text-[#16B8BE] lg:mx-0" />
              <p className="mt-3 text-lg font-black">
                طبقات دقيقة
              </p>
              <p className="mt-1 text-xs text-[#10292D]/50">
                تفاصيل متناسقة
              </p>
            </div>

            <div className="rounded-3xl border border-[#16B8BE]/15 bg-white/65 p-4 shadow-sm backdrop-blur-xl sm:p-5">
              <Zap className="mx-auto h-6 w-6 text-[#16B8BE] lg:mx-0" />
              <p className="mt-3 text-lg font-black">
                تنفيذ سريع
              </p>
              <p className="mt-1 text-xs text-[#10292D]/50">
                أداء موثوق
              </p>
            </div>

            <div className="rounded-3xl border border-[#16B8BE]/15 bg-white/65 p-4 shadow-sm backdrop-blur-xl sm:p-5">
              <Box className="mx-auto h-6 w-6 text-[#16B8BE] lg:mx-0" />
              <p className="mt-3 text-lg font-black">
                نتيجة حقيقية
              </p>
              <p className="mt-1 text-xs text-[#10292D]/50">
                من فكرة إلى مجسم
              </p>
            </div>
          </div>

          <motion.button
            type="button"
            whileHover={{
              scale: 1.04,
              boxShadow:
                '0 20px 45px rgba(22,184,190,0.25)',
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              window.location.hash = 'shop';
            }}
            className="mt-9 inline-flex items-center justify-center gap-3 rounded-full bg-[#10292D] px-9 py-4 text-base font-black text-white shadow-xl"
          >
            <Box className="h-5 w-5" />
            استكشف منتجاتنا
          </motion.button>
        </motion.div>

        {/* مشهد الطابعة */}
        <motion.div
          initial={{ opacity: 0, x: -40, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.9,
            delay: 0.15,
          }}
          className="relative"
        >
          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative mx-auto max-w-[720px] rounded-[42px] border border-white/80 bg-white/60 p-3 shadow-[0_35px_100px_rgba(16,41,45,0.16)] backdrop-blur-2xl sm:p-6"
          >
            <div className="absolute inset-0 rounded-[42px] bg-gradient-to-br from-white/75 via-transparent to-[#16B8BE]/10" />

            {/* شريط علوي */}
            <div className="relative z-10 mb-4 flex items-center justify-between rounded-3xl border border-[#10292D]/5 bg-white/75 px-5 py-4">
              <div>
                <p className="text-sm font-black">
                  3D TECH PRINTER
                </p>
                <p className="mt-1 text-xs text-[#10292D]/45">
                  Printing in progress
                </p>
              </div>

              <div className="flex items-center gap-2">
                <motion.span
                  animate={{
                    opacity: [0.35, 1, 0.35],
                    scale: [0.9, 1.15, 0.9],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                  className="h-3 w-3 rounded-full bg-[#16B8BE]"
                />

                <span className="text-xs font-bold text-[#117C84]">
                  جارٍ الطباعة
                </span>
              </div>
            </div>

            <div className="relative z-10 overflow-hidden rounded-[32px] border border-[#10292D]/10 bg-[#10292D] p-2 shadow-inner sm:p-4">
              <svg
                viewBox="0 0 660 530"
                className="h-auto w-full"
                role="img"
                aria-label="طابعة ثلاثية الأبعاد تطبع مجسمًا"
              >
                <defs>
                  <linearGradient
                    id="printerFrame"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#24454A" />
                    <stop offset="100%" stopColor="#0A2024" />
                  </linearGradient>

                  <linearGradient
                    id="printerAccent"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#28D1D4" />
                    <stop offset="100%" stopColor="#078D98" />
                  </linearGradient>

                  <linearGradient
                    id="printedObject"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#79F2EE" />
                    <stop offset="55%" stopColor="#16B8BE" />
                    <stop offset="100%" stopColor="#087781" />
                  </linearGradient>

                  <filter
                    id="cyanGlow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur
                      stdDeviation="8"
                      result="blur"
                    />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <filter
                    id="softShadow"
                    x="-40%"
                    y="-40%"
                    width="180%"
                    height="180%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="12"
                      stdDeviation="12"
                      floodColor="#000000"
                      floodOpacity="0.35"
                    />
                  </filter>
                </defs>

                {/* خلفية داخلية */}
                <rect
                  x="0"
                  y="0"
                  width="660"
                  height="530"
                  rx="25"
                  fill="#07191D"
                />

                <circle
                  cx="330"
                  cy="265"
                  r="210"
                  fill="#16B8BE"
                  opacity="0.035"
                />

                <circle
                  cx="330"
                  cy="265"
                  r="155"
                  fill="#16B8BE"
                  opacity="0.035"
                />

                {/* نقاط داخل الطابعة */}
                {Array.from({ length: 22 }).map(
                  (_, index) => (
                    <motion.circle
                      key={index}
                      cx={30 + ((index * 83) % 600)}
                      cy={35 + ((index * 67) % 430)}
                      r={index % 3 === 0 ? 2.4 : 1.4}
                      fill="#4DE4E1"
                      animate={{
                        opacity: [0.08, 0.45, 0.08],
                      }}
                      transition={{
                        duration: 3 + (index % 4),
                        repeat: Infinity,
                        delay: index * 0.11,
                      }}
                    />
                  ),
                )}

                {/* قاعدة الطابعة */}
                <rect
                  x="74"
                  y="455"
                  width="512"
                  height="42"
                  rx="14"
                  fill="url(#printerFrame)"
                  stroke="#33585D"
                  strokeWidth="2"
                  filter="url(#softShadow)"
                />

                <rect
                  x="96"
                  y="466"
                  width="468"
                  height="9"
                  rx="4.5"
                  fill="#16B8BE"
                  opacity="0.28"
                />

                {/* الأعمدة */}
                <rect
                  x="86"
                  y="75"
                  width="38"
                  height="390"
                  rx="12"
                  fill="url(#printerFrame)"
                  stroke="#365E63"
                  strokeWidth="2"
                />

                <rect
                  x="536"
                  y="75"
                  width="38"
                  height="390"
                  rx="12"
                  fill="url(#printerFrame)"
                  stroke="#365E63"
                  strokeWidth="2"
                />

                {/* الجزء العلوي */}
                <rect
                  x="72"
                  y="56"
                  width="516"
                  height="55"
                  rx="18"
                  fill="url(#printerFrame)"
                  stroke="#365E63"
                  strokeWidth="2"
                  filter="url(#softShadow)"
                />

                <rect
                  x="115"
                  y="76"
                  width="430"
                  height="8"
                  rx="4"
                  fill="#16B8BE"
                  opacity="0.35"
                />

                {/* سير الرأس */}
                <rect
                  x="122"
                  y="139"
                  width="414"
                  height="17"
                  rx="8"
                  fill="#182F33"
                  stroke="#3B6065"
                  strokeWidth="2"
                />

                <rect
                  x="137"
                  y="144"
                  width="384"
                  height="5"
                  rx="2.5"
                  fill="#16B8BE"
                  opacity="0.28"
                />

                {/* بكرة الفيلامنت */}
                <motion.g
                  style={{
                    transformOrigin: '516px 92px',
                  }}
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <circle
                    cx="516"
                    cy="92"
                    r="48"
                    fill="#10292D"
                    stroke="#4A7479"
                    strokeWidth="7"
                  />

                  <circle
                    cx="516"
                    cy="92"
                    r="32"
                    fill="none"
                    stroke="#16B8BE"
                    strokeWidth="9"
                    strokeDasharray="15 8"
                  />

                  <circle
                    cx="516"
                    cy="92"
                    r="12"
                    fill="#79F2EE"
                  />
                </motion.g>

                {/* مسار الفيلامنت */}
                <motion.path
                  d="M516 138 C516 165 430 155 390 195"
                  fill="none"
                  stroke="#65EAE7"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="10 8"
                  animate={{
                    strokeDashoffset: [0, -36],
                  }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                {/* سرير الطباعة */}
                <motion.g
                  animate={{
                    y: [0, 2, 0],
                  }}
                  transition={{
                    duration: 0.45,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <path
                    d="M155 415 L505 415 L550 450 L110 450 Z"
                    fill="#172F33"
                    stroke="#4A7075"
                    strokeWidth="3"
                    filter="url(#softShadow)"
                  />

                  <path
                    d="M177 421 L484 421 L512 442 L148 442 Z"
                    fill="#27484C"
                  />

                  <path
                    d="M192 425 L470 425"
                    stroke="#16B8BE"
                    strokeWidth="3"
                    opacity="0.45"
                  />
                </motion.g>

                {/* المجسم الذي تتم طباعته */}
                <g filter="url(#cyanGlow)">
                  {printLayers.map((layer, index) => (
                    <motion.rect
                      key={layer.id}
                      x={330 - layer.width / 2}
                      y={layer.y}
                      width={layer.width}
                      height="6"
                      rx="3"
                      fill="url(#printedObject)"
                      initial={{
                        opacity: 0,
                        scaleX: 0.2,
                      }}
                      animate={{
                        opacity: [0, 0, 1, 1, 0],
                        scaleX: [
                          0.2,
                          0.2,
                          1,
                          1,
                          0.2,
                        ],
                      }}
                      transition={{
                        duration: 12,
                        delay: layer.delay,
                        repeat: Infinity,
                        repeatDelay: 1.5,
                        times: [
                          0,
                          Math.min(
                            0.75,
                            0.08 + index * 0.025,
                          ),
                          Math.min(
                            0.82,
                            0.13 + index * 0.025,
                          ),
                          0.92,
                          1,
                        ],
                        ease: 'easeInOut',
                      }}
                      style={{
                        transformOrigin: '330px center',
                      }}
                    />
                  ))}
                </g>

                {/* رأس الطابعة المتحرك */}
                <motion.g
                  animate={{
                    x: [-105, 105, -105],
                    y: [0, 50, 0],
                  }}
                  transition={{
                    x: {
                      duration: 2.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    y: {
                      duration: 12,
                      repeat: Infinity,
                      ease: 'linear',
                    },
                  }}
                >
                  <rect
                    x="286"
                    y="126"
                    width="88"
                    height="70"
                    rx="18"
                    fill="url(#printerAccent)"
                    stroke="#82F4EF"
                    strokeWidth="2"
                    filter="url(#softShadow)"
                  />

                  <rect
                    x="302"
                    y="142"
                    width="56"
                    height="32"
                    rx="10"
                    fill="#0C3F45"
                  />

                  <motion.circle
                    cx="330"
                    cy="158"
                    r="7"
                    fill="#A5FFFA"
                    animate={{
                      opacity: [0.35, 1, 0.35],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                    }}
                  />

                  <path
                    d="M313 196 L347 196 L339 217 L321 217 Z"
                    fill="#D8FFFF"
                  />

                  <path
                    d="M326 217 L334 217 L338 236 L322 236 Z"
                    fill="#16B8BE"
                  />

                  <motion.path
                    d="M330 236 L330 253"
                    stroke="#8EFFF9"
                    strokeWidth="4"
                    strokeLinecap="round"
                    animate={{
                      opacity: [0.2, 1, 0.2],
                    }}
                    transition={{
                      duration: 0.45,
                      repeat: Infinity,
                    }}
                  />
                </motion.g>

                {/* شاشة صغيرة */}
                <rect
                  x="130"
                  y="467"
                  width="92"
                  height="42"
                  rx="10"
                  fill="#06171A"
                  stroke="#3E686D"
                  strokeWidth="2"
                />

                <motion.rect
                  x="142"
                  y="478"
                  width="52"
                  height="5"
                  rx="2.5"
                  fill="#16B8BE"
                  animate={{
                    width: [15, 52, 15],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                <rect
                  x="142"
                  y="490"
                  width="67"
                  height="4"
                  rx="2"
                  fill="#FFFFFF"
                  opacity="0.25"
                />
              </svg>
            </div>

            {/* معلومات الطباعة أسفل الكرت */}
            <div className="relative z-10 mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-[#10292D]/5 bg-white/70 px-3 py-4 text-center">
                <p className="text-xs text-[#10292D]/45">
                  المادة
                </p>
                <p className="mt-1 font-black">
                  PLA+
                </p>
              </div>

              <div className="rounded-2xl border border-[#10292D]/5 bg-white/70 px-3 py-4 text-center">
                <p className="text-xs text-[#10292D]/45">
                  الدقة
                </p>
                <p className="mt-1 font-black">
                  0.2 mm
                </p>
              </div>

              <div className="rounded-2xl border border-[#10292D]/5 bg-white/70 px-3 py-4 text-center">
                <p className="text-xs text-[#10292D]/45">
                  الحالة
                </p>
                <p className="mt-1 font-black text-[#118B93]">
                  Printing
                </p>
              </div>
            </div>
          </motion.div>

          {/* ظل أسفل الطابعة */}
          <motion.div
            animate={{
              scaleX: [1, 0.86, 1],
              opacity: [0.18, 0.1, 0.18],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="mx-auto mt-8 h-7 w-[75%] rounded-full bg-[#10292D]/25 blur-xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
