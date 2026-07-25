import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import { ProductsProvider } from './contexts/ProductsContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import Features from './components/Features';
import Footer from './components/Footer';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';

type Page =
  | 'home'
  | 'product-detail'
  | 'about'
  | 'contact'
  | 'shop';

const allowedPages: Page[] = [
  'home',
  'product-detail',
  'about',
  'contact',
  'shop',
];

function getPageFromHash(): Page {
  const hash = window.location.hash.replace('#', '').trim();
  return allowedPages.includes(hash as Page) ? (hash as Page) : 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    if (typeof window === 'undefined') return 'home';
    return getPageFromHash();
  });
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const openCart = () => setIsCartOpen(true);
    window.addEventListener('open-cart', openCart);
    return () => window.removeEventListener('open-cart', openCart);
  }, []);

  useEffect(() => {
    if (!isCartOpen) return;
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
    window.location.hash = 'product-detail';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onNavigate={handleNavigate} />
            <Products
              onProductClick={handleProductClick}
              onViewAll={() => handleNavigate('shop')}
              limit={5}
            />
            <Features />
          </>
        );
      case 'shop':
        return <Shop onProductClick={handleProductClick} />;
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onBack={() => handleNavigate('shop')}
          />
        ) : (
          <Shop onProductClick={handleProductClick} />
        );
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return null;
    }
  };

  return (
    <ProductsProvider>
      <CartProvider>
        <LanguageProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <div className="min-h-screen bg-[#16B8BE] transition-colors duration-500" dir="rtl" lang="ar">
              <Header
                onNavigate={handleNavigate}
                onCartClick={() => setIsCartOpen(true)}
              />

              <main>{renderPage()}</main>
              <Footer />

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
                      aria-label="إغلاق السلة"
                      className="absolute inset-0 h-full w-full bg-black/45 backdrop-blur-[2px]"
                      onClick={() => setIsCartOpen(false)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />

                    <motion.aside
                      className="absolute right-0 top-0 h-full w-full max-w-[460px] overflow-hidden bg-[#F7F7F5] shadow-2xl"
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'spring', stiffness: 330, damping: 34 }}
                    >
                      <Cart
                        onNavigate={handleNavigate}
                        onClose={() => setIsCartOpen(false)}
                      />
                    </motion.aside>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ThemeProvider>
        </LanguageProvider>
      </CartProvider>
    </ProductsProvider>
  );
}
