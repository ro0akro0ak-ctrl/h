import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ThemeProvider } from 'next-themes';

import {
  AdminAuthProvider,
  useAdminAuth,
} from './contexts/AdminAuthContext';

import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import { ProductsProvider } from './contexts/ProductsContext';

import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';

import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Checkout from './pages/Checkout';

type Page =
  | 'home'
  | 'product-detail'
  | 'about'
  | 'contact'
  | 'shop'
  | 'admin'
  | 'checkout';

const allowedPages: Page[] = [
  'home',
  'product-detail',
  'about',
  'contact',
  'shop',
  'admin',
  'checkout',
];

function getPageFromHash(): Page {
  const hash = window.location.hash.replace('#', '').trim();

  return allowedPages.includes(hash as Page)
    ? (hash as Page)
    : 'home';
}

function AdminPage() {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#16B8BE] to-[#087F84]"
        dir="rtl"
      >
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />

          <p className="text-lg font-bold">
            جاري التحقق من تسجيل الدخول...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}

function MainApp() {
  const { language } = useLanguage();
  const ar = language === 'ar';

  const [currentPage, setCurrentPage] = useState<Page>(() => {
    if (typeof window === 'undefined') {
      return 'home';
    }

    return getPageFromHash();
  });

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const isAdminPage = currentPage === 'admin';

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
      setIsCartOpen(false);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    const openCart = () => {
      setIsCartOpen(true);
    };

    window.addEventListener('open-cart', openCart);

    return () => {
      window.removeEventListener('open-cart', openCart);
    };
  }, []);

  useEffect(() => {
    if (!isCartOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isCartOpen]);

  const handleNavigate = (page: string) => {
    if (page === 'cart') {
      setIsCartOpen(true);
      return;
    }

    const targetPage = allowedPages.includes(page as Page)
      ? (page as Page)
      : 'home';

    setIsCartOpen(false);
    window.location.hash = targetPage;
    setCurrentPage(targetPage);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    window.location.hash = 'checkout';
    setCurrentPage('checkout');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
    window.location.hash = 'product-detail';

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onNavigate={handleNavigate} />
            <Features />
          </>
        );

      case 'shop':
        return (
          <Shop
            onProductClick={handleProductClick}
          />
        );

      case 'product-detail':
        return selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onBack={() => handleNavigate('shop')}
          />
        ) : (
          <Shop
            onProductClick={handleProductClick}
          />
        );

      case 'about':
        return <About />;

      case 'contact':
        return <Contact />;

      case 'admin':
        return <AdminPage />;

      case 'checkout':
        return (
          <Checkout
            onBack={() => handleNavigate('shop')}
            onSuccess={() => {
              window.location.hash = 'home';
              setCurrentPage('home');
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {!isAdminPage && (
        <SplashScreen show={showSplash} />
      )}

      <div
        className={
          isAdminPage
            ? 'min-h-screen'
            : 'min-h-screen bg-[#16B8BE] transition-colors duration-500'
        }
        dir={ar ? 'rtl' : 'ltr'}
        lang={ar ? 'ar' : 'en'}
      >
        {!isAdminPage && (
          <Header
            onNavigate={handleNavigate}
            onCartClick={() => setIsCartOpen(true)}
          />
        )}

        <main>
          {renderPage()}
        </main>

        {!isAdminPage && <Footer />}

        {!isAdminPage && (
          <AnimatePresence>
            {isCartOpen && (
              <motion.div
                className="fixed inset-0 z-[99999]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.button
                  type="button"
                  aria-label={ar ? 'إغلاق السلة' : 'Close Cart'}
                  className="absolute inset-0 h-full w-full bg-black/45 backdrop-blur-[2px]"
                  onClick={() => setIsCartOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />

                <motion.aside
                  className={`absolute ${
                    ar ? 'right-0' : 'left-0'
                  } top-0 h-full w-full max-w-[460px] overflow-hidden bg-[#082E33] shadow-2xl`}
                  initial={{
                    x: ar ? '100%' : '-100%',
                  }}
                  animate={{ x: 0 }}
                  exit={{
                    x: ar ? '100%' : '-100%',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 330,
                    damping: 34,
                  }}
                >
                  <Cart
                    onNavigate={handleNavigate}
                    onCheckout={handleCheckout}
                    onClose={() => setIsCartOpen(false)}
                  />
                </motion.aside>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
    >
      <LanguageProvider>
        <AdminAuthProvider>
          <ProductsProvider>
            <CartProvider>
              <MainApp />
            </CartProvider>
          </ProductsProvider>
        </AdminAuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
