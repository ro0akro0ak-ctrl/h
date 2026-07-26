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
          <motion.img
            src="/Untitled design.png?v=2"
            alt="3D TECH"
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 1.02,
            }}
            transition={{
              duration: 0.55,
              ease: 'easeOut',
            }}
            className="max-h-[58vh] w-auto object-contain"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
