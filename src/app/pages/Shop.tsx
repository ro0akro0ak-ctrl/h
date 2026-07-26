import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, Grid, List } from 'lucide-react';

export const Shop: React.FC = () => {
  const { products, categories, selectedCategory, setSelectedCategory } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = product.retailPrice >= priceRange[0] && product.retailPrice <= priceRange[1];
        
        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.retailPrice - b.retailPrice;
        if (sortBy === 'price-desc') return b.retailPrice - a.retailPrice;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0; // featured
      });
  }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">المتجر الإلكتروني</h1>
          <p className="mt-2 text-gray-400">تصفح تشكيلتنا الواسعة من المنتجات المميزة بأفضل الأسعار</p>
        </div>

        {/* Search and Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl pr-10 pl-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="featured">المميزة</option>
              <option value="price-asc">السعر: من الأرخص للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأرخص</option>
              <option value="newest">الأحدث</option>
            </select>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-gray-900 border border-gray-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="md:hidden flex items-center gap-2 bg-gray-900 border border-gray-800 px-4 py-2.5 rounded-xl text-gray-300 hover:text-white"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>الفلاتر</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className={`md:block ${isMobileFiltersOpen ? 'block' : 'hidden'} space-y-6 bg-gray-900/50 p-6 rounded-2xl border border-gray-800/80 h-fit`}>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">الأقسام</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-right px-3 py-2 rounded-lg transition-colors ${selectedCategory === 'all' ? 'bg-indigo-600 text-white font-medium' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                >
                  جميع المنتجات
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-right px-3 py-2 rounded-lg transition-colors ${selectedCategory === category.id ? 'bg-indigo-600 text-white font-medium' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-800" />

            {/* Price Range Filter */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">نطاق السعر</h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{priceRange[0]} ر.ع.</span>
                  <span>{priceRange[1]} ر.ع.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid / List */}
          <div className="md:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-gray-900/30 rounded-2xl border border-gray-800">
                <p className="text-gray-400 text-lg">لم العثور على منتجات تطابق بحثك.</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredProducts.map((product) => (
                  <div key={product.id} className="relative">
                    <ProductCard product={product} />
                    {/* تعديل سعر المنتج المعروض في بطاقة المنتج إن وجد بشكل مباشر */}
                    <div className="hidden">
                      <p dir="ltr" className="text-2xl font-bold text-white">
                        {product.retailPrice} ر.ع.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
