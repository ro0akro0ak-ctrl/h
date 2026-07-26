import React, { useMemo, useState } from 'react';
import { Grid, List, Search, SlidersHorizontal } from 'lucide-react';

import { ProductCard } from '../components/ProductCard';
import { useStore } from '../../store/useStore';

export const Shop: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    1000,
  ]);
  const [sortBy, setSortBy] = useState<
    'featured' | 'price-asc' | 'price-desc' | 'newest'
  >('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(
    'grid',
  );
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] =
    useState(false);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === 'all' ||
          product.category === selectedCategory;

        const normalizedQuery = searchQuery.trim().toLowerCase();

        const matchesSearch =
          normalizedQuery.length === 0 ||
          product.name.toLowerCase().includes(normalizedQuery) ||
          product.description.toLowerCase().includes(normalizedQuery);

        const matchesPrice =
          product.retailPrice >= priceRange[0] &&
          product.retailPrice <= priceRange[1];

        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') {
          return a.retailPrice - b.retailPrice;
        }

        if (sortBy === 'price-desc') {
          return b.retailPrice - a.retailPrice;
        }

        if (sortBy === 'newest') {
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
        }

        return 0;
      });
  }, [
    products,
    selectedCategory,
    searchQuery,
    priceRange,
    sortBy,
  ]);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-950 pb-16 pt-24 text-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            المتجر الإلكتروني
          </h1>

          <p className="mt-2 text-gray-400">
            تصفح تشكيلتنا الواسعة من المنتجات المميزة بأفضل الأسعار
          </p>
        </div>

        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-gray-900 py-2.5 pl-4 pr-10 text-white placeholder-gray-500 transition-colors focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-end">
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value as
                    | 'featured'
                    | 'price-asc'
                    | 'price-desc'
                    | 'newest',
                )
              }
              className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-white transition-colors focus:border-indigo-500 focus:outline-none"
            >
              <option value="featured">المميزة</option>
              <option value="price-asc">السعر: من الأرخص للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأرخص</option>
              <option value="newest">الأحدث</option>
            </select>

            <div className="hidden items-center rounded-xl border border-gray-800 bg-gray-900 p-1 sm:flex">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="عرض شبكي"
                className={`rounded-lg p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="عرض قائمة"
                className={`rounded-lg p-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                setIsMobileFiltersOpen((current) => !current)
              }
              className="flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-gray-300 hover:text-white md:hidden"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>الفلاتر</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <aside
            className={`h-fit space-y-6 rounded-2xl border border-gray-800/80 bg-gray-900/50 p-6 ${
              isMobileFiltersOpen ? 'block' : 'hidden'
            } md:block`}
          >
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">
                الأقسام
              </h3>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full rounded-lg px-3 py-2 text-right transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-indigo-600 font-medium text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  جميع المنتجات
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full rounded-lg px-3 py-2 text-right transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-indigo-600 font-medium text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-800" />

            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">
                نطاق السعر
              </h3>

              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(event) =>
                    setPriceRange([
                      priceRange[0],
                      Number(event.target.value),
                    ])
                  }
                  className="w-full cursor-pointer accent-indigo-600"
                />

                <div
                  dir="ltr"
                  className="flex items-center justify-between text-sm text-gray-400"
                >
                  <span>{priceRange[0]} ر.ع.</span>
                  <span>{priceRange[1]} ر.ع.</span>
                </div>
              </div>
            </div>
          </aside>

          <section className="md:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-gray-800 bg-gray-900/30 py-16 text-center">
                <p className="text-lg text-gray-400">
                  لم يتم العثور على منتجات تطابق بحثك.
                </p>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
                    : 'space-y-4'
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Shop;
