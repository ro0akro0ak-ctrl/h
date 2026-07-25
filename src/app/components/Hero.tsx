import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const { language } = useLanguage();

  const content =
    language === 'ar'
      ? {
          badge: 'أحدث منتجات الطباعة ثلاثية الأبعاد',
          title: 'كل ما تحتاجه للطباعة ثلاثية الأبعاد',
          subtitle:
            'طابعات ثلاثية الأبعاد، فيلامنت، قطع غيار وإكسسوارات بجودة عالية',
          shopButton: 'تسوق الآن',
          loginButton: 'سجّل دخولك',
        }
      : {
          badge: 'Latest 3D Printing Products',
          title: 'Everything You Need for 3D Printing',
          subtitle:
            '3D printers, filament, spare parts, and accessories with high quality',
          shopButton: 'Shop Now',
          loginButton: 'Sign In',
        };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-br from-[#0796A8] via-[#08A8B0] to-[#0BB8B0]">
      {/* Animated Background Gradient */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.18) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.18) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.18) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 opacity-70"
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.15, 0.45, 0.15],
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black/15 backdrop-blur-xl border border-white/30 mb-8 text-white"
          >
            <Sparkles className="w-4 h-4 shrink-0" />

            <span className="text-sm tracking-normal whitespace-nowrap">
              {content.badge}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-6xl mx-auto text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6"
          >
            <span className="block text-white drop-shadow-lg">
              {content.title}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-white/85 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            {content.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              type="button"
              onClick={() => onNavigate('shop')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-white text-black rounded-full overflow-hidden inline-flex items-center gap-2 shadow-lg"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white to-gray-100"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />

              <span className="relative flex items-center gap-2 font-medium">
                {content.shopButton}

                <ArrowRight
                  className={`w-5 h-5 transition-transform ${
                    language === 'ar'
                      ? 'rotate-180 group-hover:-translate-x-1'
                      : 'group-hover:translate-x-1'
                  }`}
                />
              </span>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => onNavigate('login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full border-2 border-white/50 text-white hover:bg-white/10 hover:border-white transition-colors backdrop-blur-sm inline-block font-medium"
            >
              {content.loginButton}
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-20"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-white/50 mx-auto flex items-start justify-center p-2"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-white rounded-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
