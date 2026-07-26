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
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#18B7BE]"
        >
          <img
            src="/welcome-logo-transparent.png?v=1"
            alt="3D TECH"
            className="w-40 object-contain md:w-52"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
