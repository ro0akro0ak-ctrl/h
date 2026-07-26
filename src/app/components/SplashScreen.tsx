import { AnimatePresence, motion } from 'motion/react';

interface SplashScreenProps {
  show: boolean;
}

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
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#18B7BE]"
        >
          {/* توهج خفيف جدًا */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0, 0.16, 0.1],
              scale: [0.8, 1.08, 1],
            }}
            transition={{
              duration: 0.7,
              ease: 'easeOut',
            }}
            className="pointer-events-none absolute h-52 w-52 rounded-full bg-white/20 blur-3xl"
          />

          <motion.img
            src="/Untitled design.png?v=3"
            alt="3D TECH"
            initial={{
              opacity: 0,
              scale: 0.88,
              y: 8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 1.04,
            }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-10 max-h-[46vh] w-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.10)]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
