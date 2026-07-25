import { useEffect, useState } from 'react';
import {
  motion,
  AnimatePresence,
} from 'motion/react';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Globe,
  Home,
  Box,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  onCartClick: () => void;
}

interface NavItem {
  key: string;
  page: string;
  labelAr: string;
  labelEn: string;
  icon: typeof Home;
}

export default function Header({
  onNavigate,
  onCartClick,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const { language, setLanguage } = useLanguage();
  const { totalItems } = useCart();

  const ar = language === 'ar';

  const navItems: NavItem[] = [
    {
      key: 'home',
      page: 'home',
      labelAr: 'الرئيسية',
      labelEn: 'Home',
      icon: Home,
    },
    {
      key: 'shop',
      page: 'shop',
      labelAr: 'المتجر',
      labelEn: 'Shop',
      icon: Box,
    },
    {
      key: 'tracking',
      page: 'about',
      labelAr: 'تتبع الطلب',
      labelEn: 'Track Order',
      icon: MapPin,
    },
    {
      key: 'contact',
      page: 'contact',
      labelAr: 'اتصل بنا',
      labelEn: 'Contact Us',
      icon: Phone,
    },
  ];

  useEffect(() => {
    const updateCurrentPage = () => {
      const page =
        window.location.hash.replace('#', '').trim() ||
        'home';

      setCurrentPage(page);
    };

    updateCurrentPage();

    window.addEventListener(
      'hashchange',
      updateCurrentPage,
    );

    return () => {
      window.removeEventListener(
        'hashchange',
        updateCurrentPage,
      );
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    onNavigate(page);
  };

  const handleCartClick = () => {
    setIsMenuOpen(false);
    onCartClick();
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#10292D] text-white shadow-lg"
      >
        <div className="relative mx-auto max-w-[1400px] px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.button
              type="button"
              onClick={() => handleNavigate('home')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="cursor-pointer text-xl font-black tracking-[0.12em] text-white sm:text-2xl"
            >
              3D TECH
            </motion.button>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 md:flex">
              {navItems.map((item, index) => {
                const active =
                  currentPage === item.page;

                return (
                  <motion.button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      handleNavigate(item.page)
                    }
                    initial={{
                      opacity: 0,
                      y: -20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.08,
                    }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative py-2 text-sm font-semibold tracking-wide transition-colors ${
                      active
                        ? 'text-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {ar
                      ? item.labelAr
                      : item.labelEn}

                    <span
                      className={`absolute -bottom-0.5 left-0 h-0.5 bg-[#16B8BE] transition-all duration-300 ${
                        active
                          ? 'w-full'
                          : 'w-0'
                      }`}
                    />
                  </motion.button>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() =>
                  handleNavigate('shop')
                }
                className="hidden rounded-full p-2.5 text-white transition hover:bg-white/10 sm:flex"
                aria-label={
                  ar ? 'البحث' : 'Search'
                }
              >
                <Search className="h-5 w-5" />
              </motion.button>

              {/* Language */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() =>
                  setLanguage(ar ? 'en' : 'ar')
                }
                className="flex items-center gap-1 rounded-full p-2.5 text-white transition hover:bg-white/10"
                aria-label={
                  ar
                    ? 'تغيير اللغة'
                    : 'Change language'
                }
              >
                <span className="text-xs font-bold">
                  {ar ? 'EN' : 'AR'}
                </span>

                <Globe className="h-5 w-5" />
              </motion.button>

              {/* Cart */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={handleCartClick}
                className="relative rounded-full p-2.5 text-white transition hover:bg-white/10"
                aria-label={
                  ar ? 'السلة' : 'Cart'
                }
              >
                <ShoppingBag className="h-5 w-5" />

                {totalItems > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#16B8BE] px-1 text-[10px] font-black text-white shadow-lg">
                    {totalItems}
                  </span>
                )}
              </motion.button>

              {/* Mobile Menu */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() =>
                  setIsMenuOpen(true)
                }
                className="rounded-full p-2.5 text-white transition hover:bg-white/10 md:hidden"
                aria-label={
                  ar ? 'فتح القائمة' : 'Open menu'
                }
              >
                <Menu className="h-6 w-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

     {/* Mobile Drawer */}
<AnimatePresence>
  {isMenuOpen && (
    <div className="fixed inset-0 z-[100] md:hidden">
      {/* خلفية التعتيم */}
      <motion.button
        type="button"
        aria-label={ar ? 'إغلاق القائمة' : 'Close menu'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsMenuOpen(false)}
        className="absolute inset-0 h-full w-full bg-black/70 backdrop-blur-sm"
      />

      {/* القائمة الجانبية */}
      <motion.aside
        dir={ar ? 'rtl' : 'ltr'}
        initial={{
          x: ar ? '100%' : '-100%',
        }}
        animate={{ x: 0 }}
        exit={{
          x: ar ? '100%' : '-100%',
        }}
        transition={{
          type: 'spring',
          damping: 28,
          stiffness: 260,
        }}
        className={`absolute top-0 h-full w-[88%] max-w-[390px] overflow-y-auto border-white/10 bg-[#0B1114] text-white shadow-2xl ${
          ar
            ? 'right-0 border-l'
            : 'left-0 border-r'
        }`}
      >
        {/* رأس القائمة */}
        <div className="border-b border-white/10 px-6 pb-7 pt-8">
          <div className="flex items-center justify-between">
            <motion.button
              type="button"
              onClick={() => handleNavigate('home')}
              whileTap={{ scale: 0.97 }}
              className="text-2xl font-black tracking-[0.12em] text-white"
            >
              3D TECH
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
              aria-label={ar ? 'إغلاق القائمة' : 'Close menu'}
            >
              <X className="h-6 w-6" />
            </motion.button>
          </div>

          <p className="mt-5 text-sm font-medium text-white/50">
            {ar
              ? 'Beyond Dimensions'
              : 'Beyond Dimensions'}
          </p>
        </div>

        {/* عنوان التنقل */}
        <div className="px-6 pb-3 pt-8">
          <p className="text-sm font-bold text-white/35">
            {ar ? 'التنقل' : 'Navigation'}
          </p>
        </div>

        {/* الروابط */}
        <nav className="space-y-3 px-5">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = currentPage === item.page;
            const ArrowIcon = ar
              ? ChevronLeft
              : ChevronRight;

            return (
              <motion.button
                key={item.key}
                type="button"
                initial={{
                  opacity: 0,
                  x: ar ? 30 : -30,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: index * 0.07,
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigate(item.page)}
                className={`flex w-full items-center justify-between rounded-2xl border px-5 py-5 text-start transition-all ${
                  active
                    ? 'border-[#16B8BE]/60 bg-[#16B8BE]/15 text-white shadow-lg'
                    : 'border-white/10 bg-white/[0.03] text-white/75 hover:border-white/20 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      active
                        ? 'bg-[#16B8BE] text-white'
                        : 'bg-white/[0.06] text-white/55'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>

                  <span className="text-xl font-black">
                    {ar
                      ? item.labelAr
                      : item.labelEn}
                  </span>
                </div>

                <ArrowIcon
                  className={`h-5 w-5 ${
                    active
                      ? 'text-[#16B8BE]'
                      : 'text-white/25'
                  }`}
                />
              </motion.button>
            );
          })}
        </nav>

        {/* الجزء السفلي */}
        <div className="mt-10 px-6 pb-10">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm font-bold text-white">
              {ar
                ? 'تحتاج مساعدة؟'
                : 'Need help?'}
            </p>

            <p className="mt-2 text-sm leading-6 text-white/50">
              {ar
                ? 'تواصل معنا عبر واتساب وسنرد عليك في أقرب وقت.'
                : 'Contact us on WhatsApp and we will reply soon.'}
            </p>

            <button
              type="button"
              onClick={() => handleNavigate('contact')}
              className="mt-4 w-full rounded-full bg-[#16B8BE] py-3.5 font-black text-white shadow-lg transition hover:bg-[#12A9AF]"
            >
              {ar
                ? 'اتصل بنا'
                : 'Contact Us'}
            </button>
          </div>

          <p className="mt-8 text-center text-xs font-bold tracking-[0.18em] text-white/25">
            3DTECH.STORE
          </p>
        </div>
      </motion.aside>
    </div>
  )}
</AnimatePresence>
    </>
  );
}
