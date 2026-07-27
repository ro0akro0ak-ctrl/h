import { motion } from 'motion/react';
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

interface CartProps {
  onNavigate: (page: string) => void;
  onCheckout: () => void;
  onClose: () => void;
}

export default function Cart({
  onNavigate,
  onCheckout,
  onClose,
}: CartProps) {
  const { language } = useLanguage();
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
  } = useCart();

  const ar = language === 'ar';

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }

    onClose();
    onCheckout();
  };

  const handleContinueShopping = () => {
    onClose();
    onNavigate('shop');
  };

  return (
    <section
      dir={ar ? 'rtl' : 'ltr'}
      className="relative flex h-full flex-col overflow-hidden bg-[#082E33] text-white"
    >
      {/* نقاط الخلفية */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }, (_, index) => (
          <motion.span
            key={index}
            className="absolute h-1.5 w-1.5 rounded-full bg-[#16B8BE]/55"
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

      {/* رأس السلة */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/10 px-5 py-5">
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/85 transition hover:bg-white/10 hover:text-white"
          aria-label={ar ? 'إغلاق السلة' : 'Close cart'}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <h2 className="text-xl font-black">
            {ar ? 'سلة التسوق' : 'Shopping Cart'}
          </h2>
          <p className="mt-1 text-xs text-white/55">
            {ar
              ? `${totalItems} منتج في السلة`
              : `${totalItems} items in cart`}
          </p>
        </div>

        <div className="flex h-10 min-w-10 items-center justify-center rounded-full bg-[#16B8BE] px-3 text-sm font-black text-white shadow-lg shadow-[#16B8BE]/20">
          {totalItems}
        </div>
      </header>

      {/* محتوى السلة */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-5">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex h-full min-h-[420px] flex-col items-center justify-center text-center"
          >
            <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-[#16B8BE]/15 ring-1 ring-[#16B8BE]/25">
              <ShoppingBag className="h-11 w-11 text-[#16B8BE]" />
            </div>

            <h3 className="mb-2 text-2xl font-black">
              {ar ? 'سلة التسوق فارغة' : 'Your cart is empty'}
            </h3>

            <p className="mb-7 max-w-xs text-sm leading-6 text-white/55">
              {ar
                ? 'أضف المنتجات التي تريدها من المتجر وستظهر هنا مباشرة.'
                : 'Add products from the store and they will appear here.'}
            </p>

            <button
              type="button"
              onClick={handleContinueShopping}
              className="rounded-full bg-[#16B8BE] px-8 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#13A7AD]"
            >
              {ar ? 'تصفح المتجر' : 'Browse Store'}
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <motion.article
                key={`${item.id}-${item.type}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-xl backdrop-blur-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10">
                    <img
                      src={item.image}
                      alt={ar ? item.nameAr : item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-black text-white">
                          {ar ? item.nameAr || item.name : item.name || item.nameAr}
                        </h3>

                        <p
                          dir="ltr"
                          className="mt-2 text-lg font-black text-[#21CDD4]"
                        >
                          {Number(item.price).toFixed(3)} ر.ع
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id, item.type)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                        aria-label={ar ? 'حذف المنتج' : 'Remove item'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center rounded-full border border-white/10 bg-white/10">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.type,
                              Math.max(1, item.quantity - 1),
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10"
                          aria-label={ar ? 'تقليل الكمية' : 'Decrease quantity'}
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <span className="min-w-9 text-center text-sm font-black">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.type,
                              item.quantity + 1,
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10"
                          aria-label={ar ? 'زيادة الكمية' : 'Increase quantity'}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* الإجمالي وزر الإتمام */}
      {items.length > 0 && (
        <footer className="relative z-10 border-t border-white/10 bg-[#082E33]/95 px-5 pb-5 pt-4 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-base font-black">
              {ar ? 'الإجمالي' : 'Total'}
            </span>

            <span
              dir="ltr"
              className="text-2xl font-black text-[#21CDD4]"
            >
              {Number(totalPrice).toFixed(3)} ر.ع
            </span>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            className="w-full rounded-full bg-[#16B8BE] py-4 text-base font-black text-white shadow-xl shadow-[#16B8BE]/20 transition hover:-translate-y-0.5 hover:bg-[#13A7AD]"
          >
            {ar ? 'إتمام الطلب' : 'Checkout'}
          </button>
        </footer>
      )}
    </section>
  );
}
