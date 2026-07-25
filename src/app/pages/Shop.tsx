import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  SlidersHorizontal,
  X,
  ShoppingCart,
  Eye,
  Heart,
  ChevronDown,
  PackageSearch,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useProducts, Product } from '../contexts/ProductsContext';

interface ShopProps {
  onProductClick: (product: Product) => void;
}

interface Particle {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
  movementX: number;
}

const SORT_OPTIONS = {
  ar: ['الأحدث', 'السعر: الأقل أولًا', 'السعر: الأعلى أولًا', 'الاسم'],
  en: ['Newest', 'Price: Low to High', 'Price: High to Low', 'Name'],
};

export default function Shop({ onProductClick }: ShopProps) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { products } = useProducts();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    1000,
  ]);
  const [sortIndex, setSortIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const ar = language === 'ar';

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 50 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
        movementX: Math.random() * 100 - 50,
      })),
    [],
  );

  const categories = useMemo(() => {
    const categorySet = new Set(
      products.map((product) => product.category || 'all'),
    );

    return [
      'all',
      ...Array.from(categorySet).filter(
        (category) => category !== 'all',
      ),
    ];
  }, [products]);

  const categoryLabel = (category: string) => {
    if (category === 'all') {
      return ar ? 'الكل' : 'All';
    }

    const product = products.find(
      (item) => item.category === category,
    );

    return ar
      ? product?.categoryAr ?? category
      : category;
  };

  const maxPrice = useMemo(() => {
    return Math.max(
      ...products.map((product) => product.retailPrice || 0),
      1000,
    );
  }, [products]);

  const filtered = useMemo(() => {
    let productList = products.filter((product) => {
      const productName = product.name || '';
      const productNameAr = product.nameAr || '';
      const productCategory = product.category || 'all';
      const productPrice = product.retailPrice || 0;

      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        productName.toLowerCase().includes(searchValue) ||
        productNameAr.includes(search.trim());

      const matchesCategory =
        selectedCategory === 'all' ||
        productCategory === selectedCategory;

      const matchesPrice =
        productPrice >= priceRange[0] &&
        productPrice <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });

    switch (sortIndex) {
      case 1:
        productList = [...productList].sort(
          (a, b) =>
            (a.retailPrice || 0) - (b.retailPrice || 0),
        );
        break;

      case 2:
        productList = [...productList].sort(
          (a, b) =>
            (b.retailPrice || 0) - (a.retailPrice || 0),
        );
        break;

      case 3:
        productList = [...productList].sort((a, b) =>
          (ar ? a.nameAr || '' : a.name || '').localeCompare(
            ar ? b.nameAr || '' : b.name || '',
          ),
        );
        break;

      default:
        productList = [...productList].sort(
          (a, b) => (b.id || 0) - (a.id || 0),
        );
    }

    return productList;
  }, [
    products,
    search,
    selectedCategory,
    priceRange,
    sortIndex,
    ar,
  ]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setPriceRange([0, maxPrice]);
    setSortIndex(0);
    setShowSortMenu(false);
  };

  const activeFilters =
    search !== '' ||
    selectedCategory !== 'all' ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    sortIndex !== 0;

  return (
    <section
      dir={ar ? 'rtl' : 'ltr'}
      className="relative min-h-screen overflow-hidden bg-[#16B8BE] px-4 pb-20 pt-28 text-white sm:px-6"
    >
      {/* النقاط المتحركة */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.15, 0.55, 0.15],
              y: [0, -100, 0],
              x: [0, particle.movementX, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
            className="absolute h-1.5 w-1.5 rounded-full bg-white"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
          />
        ))}
      </div>

      {/* دوائر خلفية خفيفة */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-52 top-10 h-[450px] w-[450px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-52 bottom-10 h-[450px] w-[450px] rounded-full bg-[#075E66]/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* شريط البحث والفلاتر */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 rounded-3xl border border-white/25 bg-[#075E66]/75 p-4 shadow-2xl backdrop-blur-xl md:p-6"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* البحث */}
            <div className="relative min-w-0 flex-1">
              <Search
                className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-white/55 ${
                  ar ? 'right-4' : 'left-4'
                }`}
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder={
                  ar
                    ? 'ابحث عن طابعة، فيلامنت أو إكسسوار...'
                    : 'Search printers, filament, or accessories...'
                }
                className={`w-full rounded-2xl border border-white/20 bg-[#10292D]/65 py-4 text-sm text-white outline-none placeholder:text-white/45 focus:border-white ${
                  ar ? 'pl-12 pr-12' : 'pl-12 pr-12'
                }`}
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className={`absolute top-1/2 -translate-y-1/2 rounded-full p-1 text-white/60 transition hover:bg-white/10 hover:text-white ${
                    ar ? 'left-4' : 'right-4'
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {/* الفلاتر */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  setShowFilters((current) => !current)
                }
                className={`flex items-center justify-center gap-2 rounded-2xl border px-5 py-4 text-sm font-semibold transition ${
                  showFilters
                    ? 'border-white bg-white text-[#10292D]'
                    : 'border-white/25 bg-white/10 text-white hover:bg-white/15'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />

                {ar ? 'الفلاتر' : 'Filters'}

                {activeFilters && (
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                )}
              </motion.button>

              {/* الترتيب */}
              <div className="relative">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    setShowSortMenu((current) => !current)
                  }
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  {
                    SORT_OPTIONS[ar ? 'ar' : 'en'][
                      sortIndex
                    ]
                  }

                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      showSortMenu ? 'rotate-180' : ''
                    }`}
                  />
                </motion.button>

                <AnimatePresence>
                  {showSortMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className={`absolute top-full z-30 mt-2 w-56 rounded-2xl border border-white/20 bg-[#10292D]/95 p-2 text-white shadow-2xl backdrop-blur-xl ${
                        ar ? 'right-0' : 'left-0'
                      }`}
                    >
                      {SORT_OPTIONS[
                        ar ? 'ar' : 'en'
                      ].map((option, index) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setSortIndex(index);
                            setShowSortMenu(false);
                          }}
                          className={`w-full rounded-xl px-4 py-3 text-start text-sm transition ${
                            sortIndex === index
                              ? 'bg-white text-[#10292D] font-bold'
                              : 'hover:bg-white/10'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {activeFilters && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={resetFilters}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-rose-200/35 bg-rose-400/15 px-5 py-4 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/25"
                >
                  <X className="h-4 w-4" />
                  {ar ? 'مسح' : 'Clear'}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* لوحة الفلاتر */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{
                opacity: 1,
                height: 'auto',
                y: 0,
              }}
              exit={{
                opacity: 0,
                height: 0,
                y: -10,
              }}
              className="mb-8 overflow-hidden"
            >
              <div className="space-y-8 rounded-3xl border border-white/25 bg-[#075E66]/75 p-6 shadow-2xl backdrop-blur-xl">
                {/* التصنيفات */}
                <div>
                  <p className="mb-4 text-lg font-bold">
                    {ar ? 'التصنيفات' : 'Categories'}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                      <motion.button
                        key={category}
                        type="button"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() =>
                          setSelectedCategory(category)
                        }
                        className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                          selectedCategory === category
                            ? 'border-white bg-white text-[#10292D]'
                            : 'border-white/20 bg-white/10 text-white hover:bg-white/15'
                        }`}
                      >
                        {categoryLabel(category)}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* نطاق السعر */}
                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-lg font-bold">
                      {ar ? 'نطاق السعر' : 'Price Range'}
                    </p>

                    <span
                      dir="ltr"
                      className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/80"
                    >
                      ${priceRange[0]} — ${priceRange[1]}
                    </span>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="rounded-2xl bg-[#10292D]/45 p-4">
                      <p className="mb-3 text-sm text-white/70">
                        {ar
                          ? 'أقل سعر'
                          : 'Minimum price'}
                      </p>

                      <input
                        type="range"
                        min={0}
                        max={maxPrice}
                        value={priceRange[0]}
                        onChange={(event) =>
                          setPriceRange([
                            Math.min(
                              Number(event.target.value),
                              priceRange[1] - 1,
                            ),
                            priceRange[1],
                          ])
                        }
                        className="w-full accent-white"
                      />
                    </div>

                    <div className="rounded-2xl bg-[#10292D]/45 p-4">
                      <p className="mb-3 text-sm text-white/70">
                        {ar
                          ? 'أعلى سعر'
                          : 'Maximum price'}
                      </p>

                      <input
                        type="range"
                        min={0}
                        max={maxPrice}
                        value={priceRange[1]}
                        onChange={(event) =>
                          setPriceRange([
                            priceRange[0],
                            Math.max(
                              Number(event.target.value),
                              priceRange[0] + 1,
                            ),
                          ])
                        }
                        className="w-full accent-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* التصنيفات السريعة */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10 flex flex-wrap items-center justify-center gap-3"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`rounded-full border px-5 py-2 text-sm font-semibold shadow-sm transition ${
                selectedCategory === category
                  ? 'border-white bg-white text-[#10292D]'
                  : 'border-white/25 bg-[#075E66]/45 text-white hover:bg-[#075E66]/70'
              }`}
            >
              {categoryLabel(category)}
            </button>
          ))}
        </motion.div>

        {/* شبكة المنتجات */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-2xl rounded-3xl border border-white/25 bg-[#075E66]/70 px-6 py-16 text-center shadow-2xl backdrop-blur-xl"
            >
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10">
                <PackageSearch className="h-12 w-12 text-white" />
              </div>

              <h3 className="mb-3 text-3xl font-bold">
                {ar
                  ? 'لا توجد منتجات حاليًا'
                  : 'No products available'}
              </h3>

              <p className="mx-auto mb-8 max-w-md text-white/70">
                {ar
                  ? 'سيتم إضافة المنتجات قريبًا. يمكنك أيضًا تجربة تغيير الفلاتر أو كلمة البحث.'
                  : 'Products will be added soon. You can also try changing the filters or search term.'}
              </p>

              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={resetFilters}
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-[#10292D] shadow-xl"
              >
                <X className="h-5 w-5" />
                {ar ? 'مسح الفلاتر' : 'Clear Filters'}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filtered.map((product, index) => (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.05,
                  }}
                  onHoverStart={() =>
                    setHoveredId(product.id)
                  }
                  onHoverEnd={() =>
                    setHoveredId(null)
                  }
                  className="group relative"
                >
                  <div className="relative h-full overflow-hidden rounded-3xl border border-white/25 bg-[#075E66]/75 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-white/50 hover:shadow-2xl">
                    {/* الصورة */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-white">
                      <motion.img
                        src={product.image}
                        alt={
                          ar
                            ? product.nameAr
                            : product.name
                        }
                        className="h-full w-full object-cover"
                        animate={{
                          scale:
                            hoveredId === product.id
                              ? 1.08
                              : 1,
                        }}
                        transition={{ duration: 0.5 }}
                      />

                      {/* طبقة التحويم */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity:
                            hoveredId === product.id
                              ? 1
                              : 0,
                        }}
                        className="absolute inset-0 flex items-center justify-center gap-3 bg-[#10292D]/60 backdrop-blur-sm"
                      >
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(event) => {
                            event.stopPropagation();
                            onProductClick(product);
                          }}
                          className="rounded-full bg-white p-4 text-[#10292D] shadow-xl"
                          title={
                            ar
                              ? 'عرض المنتج'
                              : 'View product'
                          }
                        >
                          <Eye className="h-5 w-5" />
                        </motion.button>

                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                          className="rounded-full bg-white p-4 text-[#10292D] shadow-xl"
                          title={
                            ar
                              ? 'إضافة للمفضلة'
                              : 'Add to wishlist'
                          }
                        >
                          <Heart className="h-5 w-5" />
                        </motion.button>
                      </motion.div>

                      {/* التصنيف */}
                      <div
                        className={`absolute top-4 rounded-full bg-[#10292D]/80 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-xl ${
                          ar ? 'right-4' : 'left-4'
                        }`}
                      >
                        {ar
                          ? product.categoryAr
                          : product.category}
                      </div>

                      {index === 0 && (
                        <div
                          className={`absolute top-4 flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#075E66] shadow-lg ${
                            ar ? 'left-4' : 'right-4'
                          }`}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          {ar ? 'جديد' : 'NEW'}
                        </div>
                      )}
                    </div>

                    {/* معلومات المنتج */}
                    <div className="p-6">
                      <h3 className="mb-2 truncate text-lg font-bold text-white">
                        {ar
                          ? product.nameAr
                          : product.name}
                      </h3>

                      {product.stock !== undefined &&
                        product.stock < 10 && (
                          <p className="mb-3 text-xs text-amber-200">
                            {ar
                              ? `متبقي ${product.stock} فقط`
                              : `Only ${product.stock} left`}
                          </p>
                        )}

                      <div className="mb-5">
                        <p className="mb-1 text-xs text-white/60">
                          {t('products.retail')}
                        </p>

                        <p
                          dir="ltr"
                          className="text-2xl font-bold text-white"
                        >
                          ${product.retailPrice}
                        </p>
                      </div>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(event) => {
                          event.stopPropagation();

                          addToCart({
                            id: product.id,
                            name: product.name,
                            nameAr: product.nameAr,
                            price: product.retailPrice,
                            image: product.image,
                            type: 'retail',
                          });
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-3.5 text-sm font-bold text-[#10292D] shadow-lg"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        {t('products.addToCart')}
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
