import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Home,
  Package,
  ShoppingCart,
  Users,
  Percent,
  Truck,
  CreditCard,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    id: 'dashboard',
    label: 'الرئيسية',
    icon: Home,
    href: '#admin',
  },
  {
    id: 'products',
    label: 'المنتجات',
    icon: Package,
    href: '#admin-products',
  },
  {
    id: 'orders',
    label: 'الطلبات',
    icon: ShoppingCart,
    href: '#admin-orders',
  },
  {
    id: 'customers',
    label: 'العملاء',
    icon: Users,
    href: '#admin-customers',
  },
  {
    id: 'discounts',
    label: 'أكواد الخصم',
    icon: Percent,
    href: '#admin-discounts',
  },
  {
    id: 'shipping',
    label: 'طرق الشحن',
    icon: Truck,
    href: '#admin-shipping',
  },
  {
    id: 'payment',
    label: 'إعدادات الدفع',
    icon: CreditCard,
    href: '#admin-payment',
  },
  {
    id: 'settings',
    label: 'إعدادات المتجر',
    icon: Settings,
    href: '#admin-settings',
  },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const { logout } = useAdminAuth();
  const currentPage = typeof window !== 'undefined' ? window.location.hash : '#admin';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed right-0 top-0 z-50 h-screen w-64 bg-white shadow-2xl md:static md:translate-x-0 border-l border-[#D8EFEF] md:max-w-xs overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-[#D8EFEF] bg-white/95 backdrop-blur p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png?v=2"
                alt="3D TECH"
                className="h-10 w-auto object-contain"
              />
              <div>
                <h2 className="font-black text-[#063F43]">3D TECH</h2>
                <p className="text-xs text-[#6B7F80]">لوحة التحكم</p>
              </div>
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#F5FCFC]"
            >
              <X className="h-5 w-5 text-[#063F43]" />
            </motion.button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 px-4 py-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPage === item.href;

            return (
              <motion.a
                key={item.id}
                href={item.href}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#16B8BE] to-[#087F84] text-white shadow-lg'
                    : 'text-[#6B7F80] hover:bg-[#F5FCFC] hover:text-[#16B8BE]'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-semibold text-sm">{item.label}</span>
              </motion.a>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-[#D8EFEF] bg-white/95 backdrop-blur p-4 space-y-3">
          {/* View Store */}
          <motion.a
            href="/#home"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#F5FCFC] text-[#16B8BE] font-semibold hover:bg-[#E9F8F9] transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            عرض المتجر
          </motion.a>

          {/* Logout */}
          <motion.button
            type="button"
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
}
