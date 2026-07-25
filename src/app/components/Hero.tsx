import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
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
          badge: 'أحدث منتجات الطباعة ثلاثية الأبعاد',
          title: 'نطبع أفكارك بإبداع',
          shopButton: 'تسوق الآن',
        }
      : {
          badge: 'Latest 3D Printing Products',
          title: 'We Print Your Ideas Creatively',
          shopButton: 'Shop Now',
        };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#16B8BE] px-4 pb-14 pt-28 text-white sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(45)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, 0.55, 0.2],
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute h-1.5 w-1.5 rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] w-full max-w-[1400px] items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="order-1 flex flex-col items-center text-center lg:col-start-2 lg:row-start-1 lg:items-start lg:text-right"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-7 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/30 bg-black/15 px-6 py-3 text-white backdrop-blur-xl"
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            <span className="text-sm">{content.badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold leading-tight tracking-tight drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {content.title}
          </motion.h1>

          <motion.button
            type="button"
            onClick={() => onNavigate('shop')}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative mt-9 inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-black shadow-lg"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white to-gray-100"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />

            <span className="relative flex items-center gap-2 font-medium">
              {content.shopButton}
              <ArrowRight
                className={`h-5 w-5 transition-transform ${
                  language === 'ar'
                    ? 'rotate-180 group-hover:-translate-x-1'
                    : 'group-hover:translate-x-1'
                }`}
              />
            </span>
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -35, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="order-2 flex items-center justify-center lg:col-start-1 lg:row-start-1"
        >
          <PrinterAnimation />
        </motion.div>
      </div>
    </section>
  );
}
