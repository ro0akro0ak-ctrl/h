import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { useProducts } from '../contexts/ProductsContext';

export const Shop: React.FC = () => {
  const { products } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('all');

  const [priceRange, setPriceRange] = useState<
    [number, number]
  >([0, 1000]);

  // إنشاء التصنيفات تلقائيًا من المنتجات
  const categories = useMemo(() => {
    const categoryMap = new Map<
      string,
      { id: string; name: string }
    >();

    products.forEach((product) => {
      if (product.category) {
        categoryMap.set(product.category, {
          id: product.category,
          name:
            product.categoryAr ||
            product.category,
        });
      }
    });

    return Array.from(categoryMap.values());
  }, [products]);

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
      dir="rtl"
      className="min-h-screen bg-[#18B7BE] pb-16 pt-28 text-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* عنوان الصفحة */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            المتجر الإلكتروني
          </h1>

          <p className="mt-2 text-white/70">
            تصفح تشكيلتنا من المنتجات المميزة
            بأفضل الأسعار
          </p>
        </div>

        {/* البحث */}
        <div className="mb-8 rounded-3xl border border-white/10 bg-[#10292D]/90 p-5 shadow-xl">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />

            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-[#0A2529] py-4 pl-4 pr-12 text-white placeholder-white/40 outline-none transition focus:border-[#16B8BE]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* الفلاتر */}
          <aside className="h-fit space-y-7 rounded-3xl border border-white/10 bg-[#10292D]/90 p-6 shadow-xl">
            {/* التصنيفات */}
            <div>
              <h3 className="mb-4 text-lg font-bold">
                التصنيفات
              </h3>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCategory('all')
                  }
                  className={`w-full rounded-xl px-4 py-3 text-right font-semibold transition ${
                    selectedCategory === 'all'
                      ? 'bg-[#16B8BE] text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  جميع المنتجات
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(
                        category.id,
                      )
                    }
                    className={`w-full rounded-xl px-4 py-3 text-right font-semibold transition ${
                      selectedCategory ===
                      category.id
                        ? 'bg-[#16B8BE] text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-white/10" />

            {/* نطاق السعر */}
            <div>
              <h3 className="mb-4 text-lg font-bold">
                نطاق السعر
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
                  {priceRange[0].toFixed(3)} ر.ع.
                </span>

                <span>
                  {priceRange[1].toFixed(3)} ر.ع.
                </span>
              </div>
            </div>
          </aside>

          {/* المنتجات */}
          <section className="md:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-[#10292D]/90 px-6 py-20 text-center shadow-xl">
                <p className="text-xl font-bold">
                  لا توجد منتجات حاليًا
                </p>

                <p className="mt-2 text-white/60">
                  جرّب تغيير البحث أو التصنيف أو
                  نطاق السعر.
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
                            product.nameAr ||
                            product.name
                          }
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        />
                      </div>

                      {/* معلومات المنتج */}
                      <div className="p-5">
                        <h3 className="text-xl font-black">
                          {product.nameAr ||
                            product.name}
                        </h3>

                        {(product.descriptionAr ||
                          product.description) && (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">
                            {product.descriptionAr ||
                              product.description}
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
                            ر.ع.
                          </span>

                          {typeof product.stock ===
                            'number' && (
                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/60">
                              المتوفر:{' '}
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
