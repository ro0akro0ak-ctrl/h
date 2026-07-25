import { motion, AnimatePresence } from "motion/react";

interface SplashScreenProps {
  show: boolean;
}

export default function SplashScreen({ show }: SplashScreenProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#10292D]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0.82, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-[#16B8BE]/30 blur-[70px]" />

            <img
              src="/logo.png"
              alt="3D TECH"
              className="relative w-40 md:w-52"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
