import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import Price from '../components/Price';

interface ProductDetailProps {
  onBack: () => void;
  product: {
    id: number;
    name: string;
    nameAr: string;
    category: string;
    categoryAr: string;
    retailPrice: number;
    wholesalePrice?: number;
    image: string;
    additionalImages?: string[];
    description: string;
    descriptionAr: string;
  };
}

export default function ProductDetail({ onBack, product }: ProductDetailProps) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.retailPrice,
      image: product.image,
      type: 'retail',
      quantity,
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-[#0B2C34] relative overflow-hidden text-white">
      {/* نقاط الخلفية المتحركة */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }, (_, index) => (
          <motion.span
            key={index}
            className="absolute h-1.5 w-1.5 rounded-full bg-[#18C2CF]/40"
            style={{
              right: `${(index * 29) % 100}%`,
              top: `${(index * 37) % 100}%`,
            }}
            animate={{
              opacity: [0.15, 0.55, 0.15],
              y: [0, -18, 0],
            }}
            transition={{
              duration: 5 + (index % 5),
              repeat: Infinity,
              delay: (index % 7) * 0.25,
            }}
          />
        ))}
      </div>

      <div className="max-w-[1180px] mx-auto relative z-10">
        {/* زر العودة */}
        <motion.button
          type="button"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 mb-8 text-white/80 hover:text-white hover:gap-3 transition-all"
        >
          <ArrowLeft className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
          <span>{language === 'ar' ? 'العودة' : 'Back'}</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* قسم الصورة بأبعاد أقصر [4/5] */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#123943] border border-white/10 shadow-2xl"
            >
              <img
                src={product.image}
                alt={language === 'ar' ? product.nameAr : product.name}
                className="w-full h-full object-cover"
              />

              <div className="absolute top-4 right-4 flex gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-black/40 backdrop-blur-xl rounded-full text-white hover:bg-black/60 transition"
                >
                  <Heart className="w-5 h-5" />
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-black/40 backdrop-blur-xl rounded-full text-white hover:bg-black/60 transition"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* تفاصيل المنتج */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium text-[#18C2CF] border border-white/10">
              {language === 'ar' ? product.categoryAr : product.category}
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white">
              {language === 'ar' ? product.nameAr : product.name}
            </h1>

            {/* سعر البيع فقط */}
            <div className="p-4 rounded-2xl border border-white/10 bg-[#123943]">
              <div className="text-sm text-white/60 mb-1">
                {language === 'ar' ? 'السعر' : 'Price'}
              </div>
              <Price
                amount={product.retailPrice}
                className="text-3xl font-black text-[#18C2CF]"
              />
            </div>

            {/* محدد الكمية */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-white/80">
                {language === 'ar' ? 'الكمية' : 'Quantity'}
              </label>
              <div className="flex items-center gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-2xl bg-[#123943] border border-white/10 hover:bg-white/10 flex items-center justify-center text-xl font-bold transition"
                >
                  -
                </motion.button>
                <div className="w-16 text-center text-2xl font-bold">{quantity}</div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-2xl bg-[#123943] border border-white/10 hover:bg-white/10 flex items-center justify-center text-xl font-bold transition"
                >
                  +
                </motion.button>
              </div>
            </div>

            {/* زر إضافة إلى السلة */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full py-4 bg-[#18C2CF] hover:bg-[#15b0bc] text-white rounded-2xl flex items-center justify-center gap-3 text-lg font-bold shadow-lg shadow-[#18C2CF]/20 transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {t('products.addToCart')}
            </motion.button>

            {/* الوصف مع معالجة الحالة الفارغة */}
            <div className="pt-4 space-y-3 border-t border-white/10">
              <h3 className="text-xl font-bold text-white">
                {language === 'ar' ? 'الوصف' : 'Description'}
              </h3>
              <p className="text-gray-300 leading-8">
                {language === 'ar'
                  ? product.descriptionAr || 'لا يوجد وصف لهذا المنتج حاليًا.'
                  : product.description || 'No description available.'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
