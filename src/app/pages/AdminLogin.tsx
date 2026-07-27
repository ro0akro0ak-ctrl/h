import { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, AlertCircle, Loader } from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';

// تعريف اللون الكحلي الخاص باللوحة فقط (مشتق من image_0.png)
const DARK_NAVY = '#06161C';

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
      // الخلفية العامة عادت كما كانت: تدرج أزرق جميل مع النقاط المتحركة
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#16B8BE] to-[#087F84] relative overflow-hidden"
      dir="rtl"
    >
      {/* Animated background dots */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-white/35 shadow-[0_0_10px_rgba(255,255,255,0.45)]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -35, 0],
              x: [0, 12, 0],
              opacity: [0.25, 0.9, 0.25],
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
        <div
          // اللوحة (الكرت) وحدها أصبحت باللون الكحلي المطلوب
          style={{ backgroundColor: DARK_NAVY }}
          className="rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl p-8 sm:p-10"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 text-center"
          >
            <div className="flex justify-center p-2 rounded-2xl bg-white/5">
              <img
                src="/logo.png?v=2"
                alt="3D TECH"
                className="h-20 w-auto object-contain"
              />
            </div>
          </motion.div>

          {/* Error Message */}
          {(error || localError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex gap-3 rounded-2xl bg-red-900/40 border border-red-700 p-4"
            >
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-200 font-medium">
                {error || localError}
              </p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email / Username */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-semibold text-white mb-2">
                البريد الإلكتروني / اسم المستخدم
              </label>
              <input
                type="text"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@3dtech.store"
                className="w-full px-4 py-3 rounded-2xl border border-white/15 bg-[#030b0e] text-white placeholder:text-gray-400 focus:border-[#16B8BE] focus:outline-none transition-colors"
                disabled={loading}
              />
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-white mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl border border-white/15 bg-[#030b0e] text-white placeholder:text-gray-400 focus:border-[#16B8BE] focus:outline-none transition-colors"
                disabled={loading}
              />
            </motion.div>

            {/* Submit Button - الزر أبيض والنص داخله نفس اللون الكحلي */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ color: DARK_NAVY }}
              className="w-full py-3 rounded-full bg-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          {/* تم إزالة نص المساعدة السفلي بناءً على طلبك */}
        </div>
      </motion.div>
    </div>
  );
}
