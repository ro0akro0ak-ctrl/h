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
          {/* توهج خفيف خلف الشعار */}
          <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />

          {/* الشعار */}
          <motion.img
            src="/welcome-logo.png?v=4"
            alt="3D TECH"
            initial={{
              opacity: 0,
              scale: 0.92,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 1.04,
            }}
            transition={{
              duration: 0.55,
              ease: 'easeOut',
            }}
            className="absolute left-1/2 top-1/2 w-56 -translate-x-1/2 -translate-y-1/2 object-contain md:w-72"
            style={{
              filter:
                'drop-shadow(0 8px 20px rgba(255,255,255,0.12))',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
