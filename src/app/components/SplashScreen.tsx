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
            className="relative w-56 md:w-72 object-contain z-10"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
