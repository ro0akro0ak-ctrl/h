import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const translations = {
  ar: {
    // Header
    'nav.home': 'الرئيسية',
    'nav.shop': 'المتجر',
    'nav.contact': 'اتصل بنا',
    'nav.search': 'بحث...',

    // Hero
    'hero.title': 'نطبع أفكارك بإبداع',
    'hero.subtitle': '',
    'hero.cta': 'تسوّق الآن',

    // Products
    'products.title': 'أحدث المنتجات',
    'products.viewAll': 'عرض الكل',
    'products.newCollection': 'منتجات جديدة',
    'products.addToCart': 'أضف للسلة',
    'products.quickView': 'عرض سريع',
    'products.wholesale': 'سعر الجملة',
    'products.retail': 'سعر البيع',

    // Categories
    'categories.title': 'التصنيفات',
    'categories.classic': 'طابعات',
    'categories.modern': 'فيلمنت',
    'categories.elegant': 'ملحقات',
    'categories.casual': 'قطع غيار',

    // Features
    'features.quality': 'جودة عالية',
    'features.qualityDesc': 'طباعة دقيقة بأعلى جودة',
    'features.shipping': 'شحن سريع',
    'features.shippingDesc': 'توصيل سريع وآمن لجميع المناطق',
    'features.wholesale': 'أسعار الجملة',
    'features.wholesaleDesc': 'خصومات خاصة للكميات الكبيرة',
    'features.support': 'دعم 24/7',
    'features.supportDesc': 'دعم فني وخدمة عملاء طوال الأسبوع',

    // Footer
    'footer.description': 'متجرك المتخصص في الطباعة ثلاثية الأبعاد وملحقاتها',
    'footer.quickLinks': 'روابط سريعة',
    'footer.customerService': 'خدمة العملاء',
    'footer.followUs': 'تابعنا',
    'footer.rights': 'جميع الحقوق محفوظة',

    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.signup': 'إنشاء حساب',
    'auth.logout': 'تسجيل الخروج',
    'auth.dashboard': 'لوحة التحكم',
    'auth.profile': 'الملف الشخصي',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.contact': 'Contact',
    'nav.search': 'Search...',

    // Hero
    'hero.title': 'We Print Your Ideas',
    'hero.subtitle': '',
    'hero.cta': 'Shop Now',

    // Products
    'products.title': 'Latest Products',
    'products.viewAll': 'View All',
    'products.newCollection': 'New Products',
    'products.addToCart': 'Add to Cart',
    'products.quickView': 'Quick View',
    'products.wholesale': 'Wholesale Price',
    'products.retail': 'Retail Price',

    // Categories
    'categories.title': 'Categories',
    'categories.classic': 'Printers',
    'categories.modern': 'Filaments',
    'categories.elegant': 'Accessories',
    'categories.casual': 'Spare Parts',

    // Features
    'features.quality': 'High Quality',
    'features.qualityDesc': 'Precision Printing with Premium Quality',
    'features.shipping': 'Fast Shipping',
    'features.shippingDesc': 'Fast and secure delivery to all regions',
    'features.wholesale': 'Wholesale Prices',
    'features.wholesaleDesc': 'Special discounts for bulk orders',
    'features.support': '24/7 Support',
    'features.supportDesc': 'Technical support and customer service all week',

    // Footer
    'footer.description': 'Your destination for 3D printers, filaments and accessories',
    'footer.quickLinks': 'Quick Links',
    'footer.customerService': 'Customer Service',
    'footer.followUs': 'Follow Us',
    'footer.rights': 'All rights reserved',

    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.logout': 'Logout',
    'auth.dashboard': 'Dashboard',
    'auth.profile': 'Profile',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ar] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        dir: language === 'ar' ? 'rtl' : 'ltr',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
