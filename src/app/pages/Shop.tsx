import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { useProducts } from '../contexts/ProductsContext';
import { useLanguage } from '../contexts/LanguageContext';

export const Shop: React.FC = () => {
  const { products } = useProducts();
  const { language } = useLanguage();
  const ar = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [priceRange, setPriceRange] = useState<
    [number, number]
  >([0, 1000]);

  // تعريف التصنيفات المحددة
  const categories = ['all', 'printers', 'filament', 'parts'];
  
  const categoryLabel = (cat: string) => {
    if (cat === 'all') return ar ? 'الكل' : 'All';
    if (cat === 'printers') return ar ? 'الطابعات' : 'Printers';
    if (cat === 'filament') return 'Filament';
    if (cat === 'parts') return ar ? 'قطع الغيار' : 'Spare Parts';

    return cat;
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
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#16B8BE] text-white shadow-lg shadow-[#16B8BE]/20'
                  : 'bg-[#073B3F] text-white/75 hover:text-white hover:bg-[#0A4B50]'
              }`}
            >
              {categoryLabel(cat)}
            </button>
          ))}
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
                      className="overflow-hidden rounded-3xl border border-white/10 bg-[#10292D] shadow-xl transition duration-300 hover:-translate-y-1"
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

                        <div className="mt-5 flex items-center justify-between">
                          <span
                            dir="ltr"
                            className="text-lg font-black text-[#16B8BE]"
                          >
                            {Number(
                              product.retailPrice,
                            ).toFixed(3)}{' '}
                            {ar ? 'ر.ع.' : 'OMR'}
                          </span>

                          {typeof product.stock ===
                            'number' && (
                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/60">
                              {ar ? 'المتوفر:' : 'Stock:'}{' '}
                              {product.stock}
                            </span>
                          )}
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
