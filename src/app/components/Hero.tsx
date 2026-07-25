import { motion } from 'motion/react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import PrinterAnimation from './PrinterAnimation';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const { language } = useLanguage();

  const content =
    language === 'ar'
      ? {
          badge: 'أحدث تقنيات الطباعة ثلاثية الأبعاد',
          title: 'نطبع أفكارك بإبداع',
          shopButton: 'تسوّق الآن',
        }
      : {
          badge: 'Latest 3D Printing Technology',
          title: 'We Print Your Ideas Creatively',
          shopButton: 'Shop Now',
        };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#16B8BE] px-4 pb-14 pt-28 text-white sm:px-6 lg:px-10">
      {/* النقاط المتحركة */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(45)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.15, 0.5, 0.15],
              y: [0, -90, 0],
              x: [
                0,
                index % 2 === 0 ? 30 : -30,
                0,
              ],
            }}
            transition={{
              duration: 11 + (index % 6),
              repeat: Infinity,
              delay: (index % 8) * 0.35,
              ease: 'easeInOut',
            }}
            className="absolute h-1.5 w-1.5 rounded-full bg-white"
            style={{
              left: `${(index * 23) % 100}%`,
              top: `${(index * 37) % 100}%`,
            }}
          />
        ))}
      </div>

      {/* توهج خفيف خلف المحتوى */}
      <div className="pointer-events-none absolute right-[5%] top-[28%] h-[430px] w-[430px] rounded-full bg-white/10 blur-[120px]" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] w-full max-w-[1400px] items-center gap-8 lg:grid-cols-2 lg:gap-16">
        {/* النص على اليمين */}
        <motion.div
          initial={{ opacity: 0, x: 45 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85 }}
          className="order-1 flex flex-col items-center text-center lg:col-start-2 lg:row-start-1 lg:items-start lg:text-right"
        >
          {/* الشارة */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-[#10292D]/30 px-7 py-3.5 shadow-xl backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-[#E8FFFF]" />
            <span className="whitespace-nowrap font-sans text-sm font-semibold tracking-wide text-white">
              {content.badge}
            </span>
          </motion.div>

          {/* العنوان في سطر واحد وبخط فخم وعصري */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.85,
              delay: 0.18,
            }}
            className="relative font-sans text-4xl font-extrabold tracking-tight whitespace-nowrap sm:text-5xl md:text-6xl lg:text-[64px]"
            style={{ fontFamily: 'var(--font-heading, system-ui), sans-serif' }}
          >
            <span className="relative inline-block bg-gradient-to-l from-white via-[#F0FFFF] to-[#C8FBFD] bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(4,44,48,0.25)]">
              {content.title}

              {/* خط مزخرف أنيق وناعم تحت الكلمة */}
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.7,
                }}
                className="absolute -bottom-3.5 left-1/2 h-1 w-[85%] -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-white/80 to-transparent shadow-[0_0_12px_rgba(255,255,255,0.6)]"
              />
            </span>
          </motion.h1>

          {/* زر التسوق */}
          <motion.button
            type="button"
            onClick={() => onNavigate('shop')}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
            }}
            whileHover={{
              scale: 1.05,
              y: -3,
            }}
            whileTap={{ scale: 0.97 }}
            className="group relative mt-14 inline-flex min-w-[200px] items-center justify-center gap-3 overflow-hidden rounded-full border border-white/20 bg-[#10292D] px-10 py-4.5 text-base font-bold text-white shadow-[0_20px_45px_rgba(4,44,48,0.3)]"
          >
            {/* لمعة تمر فوق الزر */}
            <motion.span
              className="absolute inset-y-0 -left-20 w-16 rotate-12 bg-white/20 blur-md"
              animate={{
                left: ['-25%', '125%'],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: 'easeInOut',
              }}
            />

            <span className="relative z-10 tracking-wide">
              {content.shopButton}
            </span>

            <ArrowLeft
              className={`relative z-10 h-5 w-5 transition-transform duration-300 ${
                language === 'ar'
                  ? 'group-hover:-translate-x-1.5'
                  : 'rotate-180 group-hover:translate-x-1.5'
              }`}
            />
          </motion.button>
        </motion.div>

        {/* الطابعة على اليسار */}
        <motion.div
          initial={{
            opacity: 0,
            x: -40,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.9,
            delay: 0.15,
          }}
          className="order-2 flex items-center justify-center lg:col-start-1 lg:row-start-1"
        >
          <PrinterAnimation />
        </motion.div>
      </div>
    </section>
  );
}
