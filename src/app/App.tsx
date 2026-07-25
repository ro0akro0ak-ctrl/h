import { useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
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
import Wholesale from './pages/Wholesale';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import WholesaleDashboard from './pages/WholesaleDashboard';
import CustomerDashboard from './pages/CustomerDashboard';

type Page =
  | 'home'
  | 'product-detail'
  | 'cart'
  | 'about'
  | 'contact'
  | 'wholesale'
  | 'login'
  | 'admin'
  | 'wholesale-dashboard'
  | 'customer-dashboard'
  | 'shop';

const allowedPages: Page[] = [
  'home',
  'product-detail',
  'cart',
  'about',
  'contact',
  'wholesale',
  'login',
  'admin',
  'wholesale-dashboard',
  'customer-dashboard',
  'shop',
];

function getPageFromHash(): Page {
  const hash = window.location.hash.replace('#', '').trim();

  if (allowedPages.includes(hash as Page)) {
    return hash as Page;
  }

  return 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    if (typeof window === 'undefined') {
      return 'home';
    }

    return getPageFromHash();
  });

  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleNavigate = (page: string) => {
    const targetPage = allowedPages.includes(page as Page)
      ? (page as Page)
      : 'home';

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

  const handleLoginSuccess = (role: string) => {
    if (role === 'admin') {
      handleNavigate('admin');
    } else if (role === 'wholesale') {
      handleNavigate('wholesale-dashboard');
    } else {
      handleNavigate('customer-dashboard');
    }
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

      case 'cart':
        return <Cart onNavigate={handleNavigate} />;

      case 'about':
        return <About />;

      case 'contact':
        return <Contact />;

      case 'wholesale':
        return <Wholesale />;

      case 'login':
        return <Login onSuccess={handleLoginSuccess} />;

      case 'admin':
        return <AdminDashboard />;

      case 'wholesale-dashboard':
        return <WholesaleDashboard onProductClick={handleProductClick} />;

      case 'customer-dashboard':
        return <CustomerDashboard onNavigate={handleNavigate} />;

      default:
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
    }
  };

  const showFooter =
    currentPage !== 'admin' &&
    currentPage !== 'wholesale-dashboard' &&
    currentPage !== 'customer-dashboard';

  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <LanguageProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
            >
              <div
                className="min-h-screen bg-[#16B8BE] transition-colors duration-500"
                dir="rtl"
                lang="ar"
              >
                {currentPage !== 'admin' && (
                  <Header
                    onNavigate={handleNavigate}
                    onCartClick={() => handleNavigate('cart')}
                  />
                )}

                <main>{renderPage()}</main>

                {showFooter && <Footer />}
              </div>
            </ThemeProvider>
          </LanguageProvider>
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}
