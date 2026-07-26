import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const Shop: React.FC = () => {
  const { products, categories, selectedCategory, setSelectedCategory } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesSearch =
      normalizedQuery.length === 0 ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery);
    const matchesPrice =
      product.retailPrice >= priceRange[0] &&
      product.retailPrice <= priceRange[1];

    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div dir="rtl" className="min-h-screen bg-gray-950 pb-16 pt-24 text-white">
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
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <aside className="h-fit space-y-6 rounded-2xl border border-gray-800/80 bg-gray-900/50 p-6 md:block">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">الأقسام</h3>
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
              <h3 className="mb-4 text-lg font-semibold text-white">نطاق السعر</h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(event) =>
                    setPriceRange([priceRange[0], Number(event.target.value)])
                  }
                  className="w-full cursor-pointer accent-indigo-600"
                />
                <div dir="ltr" className="flex items-center justify-between text-sm text-gray-400">
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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <h3 className="font-bold text-white">{product.name}</h3>
                    <p className="text-sm text-gray-400">{product.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-indigo-400 font-semibold">{product.retailPrice} ر.ع.</span>
                    </div>
                  </div>
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
