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
          className="fixed inset-0 z-[999999] overflow-hidden bg-[#18B7BE]"
        >
          <img
            src="/welcome-logo.png?v=3"
            alt="3D TECH"
            className="h-full w-full object-cover"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
