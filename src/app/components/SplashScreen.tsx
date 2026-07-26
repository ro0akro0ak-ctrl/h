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

          {/* اللوجو */}
          <motion.img
            src="/Untitled design (1).png?v=3"
            alt="3D TECH"
            initial={{
              opacity: 0,
              scale: 0.82,
            }}
            animate={{
              opacity: 1,
              scale: 0.92,
            }}
            exit={{
              opacity: 0,
              scale: 0.98,
            }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-10 w-40 object-contain md:w-48"
            style={{
              filter: "drop-shadow(0 8px 18px rgba(0,70,90,0.12))",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
