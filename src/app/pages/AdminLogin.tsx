import { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, AlertCircle, Loader } from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';

export default function AdminLogin() {
  const { login, loading, error } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please enter both email and password');
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      setLocalError(err.message || 'Login failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#16B8BE] to-[#087F84] relative overflow-hidden"
      dir="rtl"
    >
      {/* Animated background dots */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-white/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md px-6 sm:px-8"
      >
        <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl p-8 sm:p-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 text-center"
          >
            <div className="mb-4 flex justify-center">
              <img
                src="/logo.png?v=2"
                alt="3D TECH"
                className="h-16 w-auto object-contain"
              />
            </div>
            <h1 className="text-3xl font-black text-[#063F43] mb-2">
              3D TECH Admin
            </h1>
            <p className="text-sm text-[#6B7F80]">
              لوحة التحكم
            </p>
          </motion.div>

          {/* Error Message */}
          {(error || localError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex gap-3 rounded-2xl bg-red-50 border border-red-200 p-4"
            >
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">
                {error || localError}
              </p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-semibold text-[#063F43] mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@3dtech.store"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#D8EFEF] bg-[#F5FCFC] text-[#063F43] placeholder:text-[#6B7F80] focus:border-[#16B8BE] focus:outline-none transition-colors"
                disabled={loading}
              />
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-[#063F43] mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#D8EFEF] bg-[#F5FCFC] text-[#063F43] placeholder:text-[#6B7F80] focus:border-[#16B8BE] focus:outline-none transition-colors"
                disabled={loading}
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#16B8BE] to-[#087F84] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  تسجيل الدخول
                </>
              )}
            </motion.button>
          </form>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-sm text-[#6B7F80]"
          >
            هل تحتاج مساعدة؟ تواصل مع فريق الدعم
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
