import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, ShoppingBag, Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  onCartClick: () => void;
}

export default function Header({ onNavigate, onCartClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { totalItems } = useCart();

  const navItems = [
    {
      key: 'home',
      page: 'home',
      labelAr: 'الرئيسية',
      labelEn: 'Home',
    },
    {
      key: 'shop',
      page: 'shop',
      labelAr: 'المتجر',
      labelEn: 'Shop',
    },
    {
      key: 'tracking',
      page: 'about',
      labelAr: 'تتبع الطلب',
      labelEn: 'Track Order',
    },
    {
      key: 'contact',
      page: 'contact',
      labelAr: 'اتصل بنا',
      labelEn: 'Contact Us',
    },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#10292D] text-white border-b border-white/10"
    >
      <div className="relative max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.button
            type="button"
            onClick={() => onNavigate('home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="text-2xl font-bold tracking-wider cursor-pointer"
          >
            <span className="text-white drop-shadow-md">
              3D TECH
            </span>
          </motion.button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.key}
                type="button"
                onClick={() => onNavigate(item.page)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative text-sm tracking-wide text-white/80 hover:text-white transition-colors group"
              >
                {language === 'ar' ? item.labelAr : item.labelEn}
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300"
                />
              </motion.button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Language Toggle */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="p-2 rounded-full hover:bg-white/10 transition-colors flex items-center gap-1 text-white"
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs font-semibold">{language === 'ar' ? 'EN' : 'AR'}</span>
            </motion.button>

            {/* Cart */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCartClick}
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-white"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-[#10292D] rounded-full text-xs flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4"
          >
            {navItems.map((item, index) => (
              <motion.button
                key={item.key}
                type="button"
                onClick={() => {
                  onNavigate(item.page);
                  setIsMenuOpen(false);
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
                className="block py-3 text-sm text-white/80 hover:text-white transition-colors w-full text-left"
              >
                {language === 'ar' ? item.labelAr : item.labelEn}
              </motion.button>
            ))}
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}
