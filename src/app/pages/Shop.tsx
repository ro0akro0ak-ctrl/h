import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { useProducts } from '../contexts/ProductsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

const categories = [
  'all',
  'printers',
  'accessories',
  'filament',
] as const;

type Category = (typeof categories)[number];

interface ShopProps {
  onProductClick?: (product: any) => void;
}

export const Shop: React.FC<ShopProps> = ({ onProductClick }) => {
  const { products } = useProducts();
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const ar = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<Category>('all');

  const [priceRange, setPriceRange] = useState<
    [number, number]
  >([0, 1000]);

  const categoryLabel = (cat: Category) => {
    if (cat === 'all') return ar ? 'الكل' : 'All';
    if (cat === 'printers') return ar ? 'الطابعات' : 'Printers';
    if (cat === 'accessories') {
      return ar ? 'الأكسسوارات' : 'Accessories';
    }

    return 'Filament';
  };

  // البحث والتصفية
  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        product.category === selectedCategory;

      const matchesSearch =
        normalizedQuery.length === 0 ||
        product.name
          ?.toLowerCase()
          .includes(normalizedQuery) ||
        product.nameAr
          ?.toLowerCase()
          .includes(normalizedQuery) ||
        product.description
          ?.toLowerCase()
          .includes(normalizedQuery) ||
        product.descriptionAr
          ?.toLowerCase()
          .includes(normalizedQuery);

      const matchesPrice =
        Number(product.retailPrice) >=
          priceRange[0] &&
        Number(product.retailPrice) <=
          priceRange[1];

      return (
        matchesCategory &&
        matchesSearch &&
        matchesPrice
      );
    });
  }, [
    products,
    selectedCategory,
    searchQuery,
    priceRange,
  ]);

  return (
    <div
      dir={ar ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#18B7BE] pb-16 pt-28 text-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* عنوان الصفحة */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {ar ? 'المتجر الإلكتروني' : 'Online Store'}
          </h1>

          <p className="mt-2 text-white/70">
            {ar
              ? 'تصفح تشكيلتنا من المنتجات المميزة بأفضل الأسعار'
              : 'Browse our selection of products at the best prices'}
          </p>
        </div>

        {/* البحث */}
        <div className="mb-8 rounded-3xl border border-white/10 bg-[#10292D]/90 p-5 shadow-xl">
          <div className="relative">
            <Search className={`absolute ${ar ? 'right-4' : 'left-4'} top-1/2 h-5 w-5 -translate-y-1/2 text-white/50`} />

            <input
              type="text"
              placeholder={ar ? 'ابحث عن منتج...' : 'Search for a product...'}
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              className={`w-full rounded-2xl border border-white/10 bg-[#0A2529] py-4 ${ar ? 'pl-4 pr-12' : 'pr-4 pl-12'} text-white placeholder-white/40 outline-none transition focus:border-[#16B8BE]`}
            />
          </div>
        </div>

        {/* أزرار الفئات */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={isActive}
                className={`min-w-[110px] rounded-2xl border px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'border-white bg-white text-[#073B3F] shadow-[0_10px_28px_rgba(7,59,63,0.28)] ring-2 ring-white/30 -translate-y-0.5'
                    : 'border-white/15 bg-[#073B3F] text-white shadow-md hover:-translate-y-0.5 hover:border-white/35 hover:bg-[#0A4B50] hover:shadow-lg'
                }`}
              >
                {categoryLabel(cat)}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* الفلاتر الجانبية (نطاق السعر) */}
          <aside className="h-fit space-y-7 rounded-3xl border border-white/10 bg-[#10292D]/90 p-6 shadow-xl">
            <div>
              <h3 className="mb-4 text-lg font-bold">
                {ar ? 'نطاق السعر' : 'Price Range'}
              </h3>

              <input
                type="range"
                min="0"
                max="1000"
                step="5"
                value={priceRange[1]}
                onChange={(event) =>
                  setPriceRange([
                    priceRange[0],
                    Number(event.target.value),
                  ])
                }
                className="w-full cursor-pointer accent-[#16B8BE]"
              />

              <div
                dir="ltr"
                className="mt-4 flex items-center justify-between text-sm font-semibold text-white/70"
              >
                <span>
                  {priceRange[0].toFixed(3)} {ar ? 'ر.ع.' : 'OMR'}
                </span>

                <span>
                  {priceRange[1].toFixed(3)} {ar ? 'ر.ع.' : 'OMR'}
                </span>
              </div>
            </div>
          </aside>

          {/* المنتجات */}
          <section className="md:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-[#10292D]/90 px-6 py-20 text-center shadow-xl">
                <p className="text-xl font-bold">
                  {ar ? 'لا توجد منتجات حاليًا' : 'No products available'}
                </p>

                <p className="mt-2 text-white/60">
                  {ar
                    ? 'جرّب تغيير البحث أو التصنيف أو نطاق السعر.'
                    : 'Try changing the search, category, or price range.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map(
                  (product) => (
                    <article
                      key={product.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => onProductClick?.(product)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          onProductClick?.(product);
                        }
                      }}
                      className="cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-[#10292D] shadow-xl transition duration-300 hover:-translate-y-1 hover:border-[#16B8BE]/60 hover:shadow-2xl"
                    >
                      {/* صورة المنتج */}
                      <div className="aspect-square overflow-hidden bg-white/5">
                        <img
                          src={product.image}
                          alt={
                            ar
                              ? product.nameAr || product.name
                              : product.name || product.nameAr
                          }
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        />
                      </div>

                      {/* معلومات المنتج */}
                      <div className="p-5">
                        <h3 className="text-xl font-black">
                          {ar
                            ? product.nameAr || product.name
                            : product.name || product.nameAr}
                        </h3>

                        {(ar
                          ? product.descriptionAr || product.description
                          : product.description || product.descriptionAr) && (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">
                            {ar
                              ? product.descriptionAr || product.description
                              : product.description || product.descriptionAr}
                          </p>
                        )}

                        <div className="mt-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <span
                              dir="ltr"
                              className="text-xl font-black text-[#20CDD4]"
                            >
                              {(Number(product.retailPrice) || 0).toFixed(3)}{' '}
                              {ar ? 'ر.ع.' : 'OMR'}
                            </span>
                          </div>

                          <button
                            type="button"
                            disabled={product.stock === 0}
                            onClick={(event) => {
                              event.stopPropagation();
                              addToCart(product);
                            }}
                            className="w-full rounded-2xl bg-[#16B8BE] px-5 py-3 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#0B969C] disabled:cursor-not-allowed disabled:bg-gray-500 disabled:opacity-60"
                          >
                            {product.stock === 0
                              ? ar
                                ? 'نفد من المخزون'
                                : 'Out of stock'
                              : ar
                                ? 'إضافة إلى السلة'
                                : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </article>
                  ),
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Shop;
