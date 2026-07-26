import { AnimatePresence, motion } from 'motion/react';

interface SplashScreenProps {
  show: boolean;
}

const particles = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: (index * 29) % 100,
  top: (index * 41) % 100,
  size: 4 + (index % 3),
  duration: 6 + (index % 5),
  delay: (index % 10) * 0.18,
  direction: index % 2 === 0 ? 20 : -20,
}));

export default function SplashScreen({
  show,
}: SplashScreenProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center overflow-hidden bg-[#18B7BE]"
        >
          {/* النقاط الزرقاء المتحركة */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {particles.map((particle) => (
              <motion.span
                key={particle.id}
                className="absolute rounded-full bg-[#087FAE]/55"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  width: particle.size,
                  height: particle.size,
                }}
                animate={{
                  opacity: [0.15, 0.7, 0.15],
                  y: [0, -75, 0],
                  x: [0, particle.direction, 0],
                  scale: [0.8, 1.25, 0.8],
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

          {/* تأثير خفيف خلف اللوجو */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.6,
            }}
            animate={{
              opacity: [0, 0.28, 0.12],
              scale: [0.6, 1.15, 1],
            }}
            transition={{
              duration: 0.85,
              ease: 'easeOut',
            }}
            className="pointer-events-none absolute h-64 w-64 rounded-full bg-white/20 blur-[80px]"
          />

          {/* اللوجو */}
          <motion.img
            src="/Untitled design (1).png?v=2"
            alt="3D TECH"
            initial={{
              opacity: 0,
              scale: 0.68,
              rotate: -4,
              y: 18,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 1.08,
              y: -8,
            }}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-10 w-44 object-contain drop-shadow-[0_14px_28px_rgba(0,55,75,0.20)] sm:w-52 md:w-64"
          />

          {/* نبضة حول اللوجو أول ما يفتح */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.65,
            }}
            animate={{
              opacity: [0, 0.35, 0],
              scale: [0.65, 1.1, 1.5],
            }}
            transition={{
              duration: 1.15,
              ease: 'easeOut',
            }}
            className="pointer-events-none absolute h-56 w-56 rounded-full border border-[#087FAE]/35"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
