import { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Eye, Heart, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useProducts, Product } from '../contexts/ProductsContext';

interface ProductsProps {
  onProductClick: (product: Product) => void;
  onViewAll?: () => void;
  limit?: number;
}

export default function Products({
  onProductClick,
  onViewAll,
  limit = 5,
}: ProductsProps) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // عرض أحدث المنتجات أولًا
  const displayed = [...products]
    .sort((a, b) => b.id - a.id)
    .slice(0, limit);

  return (
    <section
      id="shop"
      className="relative py-24 px-6 overflow-hidden bg-[#16B8BE] text-white"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-black/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            {language === 'ar' ? 'أحدث المنتجات' : 'Latest Products'}
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto" />

          <p className="text-white/80 mt-4 text-base md:text-lg">
            {language === 'ar'
              ? 'أحدث منتجات الطباعة ثلاثية الأبعاد والفيلامنت والإكسسوارات'
              : 'Latest 3D printers, filament, parts, and accessories'}
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayed.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onHoverStart={() => setHoveredId(product.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="group relative"
            >
              {/* Product Card */}
              <div className="relative overflow-hidden rounded-3xl bg-[#075E66]/80 backdrop-blur-xl border border-white/20 hover:border-white/50 shadow-xl transition-all duration-300">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-white">
                  <motion.img
                    src={product.image}
                    alt={
                      language === 'ar'
                        ? product.nameAr
                        : product.name
                    }
                    className="w-full h-full object-cover"
                    animate={{
                      scale: hoveredId === product.id ? 1.08 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Overlay on Hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: hoveredId === product.id ? 1 : 0,
                    }}
                    className="absolute inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center gap-4"
                  >
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onProductClick(product);
                      }}
                      className="p-4 bg-white text-black rounded-full shadow-lg"
                    >
                      <Eye className="w-5 h-5" />
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => e.stopPropagation()}
                      className="p-4 bg-white text-black rounded-full shadow-lg"
                    >
                      <Heart className="w-5 h-5" />
                    </motion.button>
                  </motion.div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-black/65 backdrop-blur-xl text-white text-xs">
                    {language === 'ar'
                      ? product.categoryAr
                      : product.category}
                  </div>

                  {/* New Badge */}
                  {index === 0 && (
                    <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-white text-[#16B8BE] text-xs font-bold shadow-lg">
                      {language === 'ar' ? 'جديد' : 'NEW'}
                    </div>
                  )}
                </div>

                {/* Product Information */}
                <div className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">
                    {language === 'ar'
                      ? product.nameAr
                      : product.name}
                  </h3>

                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="text-sm text-white/70">
                        {t('products.retail')}
                      </div>

                      <div className="text-2xl font-bold text-white">
                        ${product.retailPrice}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-white/70">
                        {t('products.wholesale')}
                      </div>

                      <div className="text-xl font-bold text-[#7FFFE9]">
                        ${product.wholesalePrice}
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();

                      addToCart({
                        id: product.id,
                        name: product.name,
                        nameAr: product.nameAr,
                        price: product.retailPrice,
                        image: product.image,
                        type: 'retail',
                      });
                    }}
                    className="w-full py-3 bg-white text-black rounded-full flex items-center justify-center gap-2 font-semibold shadow-lg group/btn"
                  >
                    <ShoppingCart className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />

                    {t('products.addToCart')}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewAll}
            className="inline-flex items-center gap-3 px-12 py-4 rounded-full bg-white text-black font-semibold text-lg shadow-xl"
          >
            {language === 'ar'
              ? 'عرض جميع المنتجات'
              : 'View All Products'}

            <ArrowRight
              className={`w-5 h-5 ${
                language === 'ar' ? 'rotate-180' : ''
              }`}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
