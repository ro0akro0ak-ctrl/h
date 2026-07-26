import { AnimatePresence, motion } from 'motion/react';

interface SplashScreenProps {
  show: boolean;
}

const particles = Array.from({ length: 45 }, (_, index) => ({
  id: index,
  left: (index * 23) % 100,
  top: (index * 37) % 100,
  duration: 8 + (index % 6),
  delay: (index % 9) * 0.2,
  direction: index % 2 === 0 ? 25 : -25,
}));

export default function SplashScreen({
  show,
}: SplashScreenProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center overflow-hidden bg-[#16B8BE]"
        >
          {/* النقاط المتحركة مثل الصفحة الرئيسية */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {particles.map((particle) => (
              <motion.span
                key={particle.id}
                className="absolute h-1.5 w-1.5 rounded-full bg-white"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                }}
                animate={{
                  opacity: [0.15, 0.55, 0.15],
                  y: [0, -85, 0],
                  x: [0, particle.direction, 0],
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

          {/* التوهج خلف الشعار */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
              opacity: [0, 0.4, 0.22],
              scale: [0.7, 1.15, 1],
            }}
            transition={{
              duration: 0.75,
              ease: 'easeOut',
            }}
            className="pointer-events-none absolute h-72 w-72 rounded-full bg-white/25 blur-[85px]"
          />

          {/* شعار شاشة الترحيب */}
          <motion.img
            src="/welcome-logo.png"
            alt="3D TECH"
            initial={{
              opacity: 0,
              scale: 0.72,
              y: 12,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 1.08,
            }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative w-40 md:w-52 object-contain z-10 drop-shadow-[0_18px_35px_rgba(4,44,48,0.25)]"
          />

          {/* دائرة بسيطة متحركة */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.75,
            }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0.75, 1.2, 1.45],
            }}
            transition={{
              duration: 1.05,
              ease: 'easeOut',
            }}
            className="pointer-events-none absolute h-52 w-52 rounded-full border border-white/30"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
