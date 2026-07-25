import { motion } from 'motion/react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

interface CartProps {
  onNavigate: (page: string) => void;
}

export default function Cart({ onNavigate }: CartProps) {
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
    const orderDetails = items
      .map((item) => {
        const productName = ar ? item.nameAr : item.name;
        const itemTotal = item.price * item.quantity;

        return `${productName}
الكمية: ${item.quantity}
السعر: ${itemTotal.toFixed(3)} ر.ع`;
      })
      .join('\n\n');

    const message = `مرحبًا 3D TECH، أريد إتمام هذا الطلب:

${orderDetails}

المجموع: ${totalPrice.toFixed(3)} ر.ع`;

    const whatsappUrl = `https://wa.me/96894353535?text=${encodeURIComponent(
      message,
    )}`;

    window.open(
      whatsappUrl,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <section
      dir={ar ? 'rtl' : 'ltr'}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-[#F5FCFF] to-[#EAF9FC] px-4 pb-20 pt-32 text-[#10292D] sm:px-6"
    >
      {/* خلفية زخرفية */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 35 }, (_, index) => (
          <motion.div
            key={index}
            animate={{
              opacity: [0.15, 0.5, 0.15],
              y: [0, -80, 0],
            }}
            transition={{
              duration: 9 + (index % 8),
              repeat: Infinity,
              delay: (index % 10) * 0.25,
            }}
            className="absolute h-1.5 w-1.5 rounded-full bg-[#16B8BE]"
            style={{
              left: `${(index * 17) % 100}%`,
              top: `${(index * 23) % 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl font-black md:text-6xl text-[#10292D]">
            {ar ? 'سلة التسوق' : 'Shopping Cart'}
          </h1>

          <p className="mt-4 text-[#10292D]/65">
            {ar
              ? `${totalItems} منتج في السلة`
              : `${totalItems} items in your cart`}
          </p>
        </motion.div>

        {items.length === 0 ? (
          /* السلة فارغة */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto flex min-h-[430px] max-w-3xl flex-col items-center justify-center rounded-3xl border border-[#16B8BE]/20 bg-white/70 p-8 text-center shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#16B8BE]/10">
              <ShoppingBag className="h-12 w-12 text-[#16B8BE]" />
            </div>

            <h2 className="mb-3 text-3xl font-black text-[#10292D]">
              {ar
                ? 'سلة التسوق فارغة'
                : 'Your cart is empty'}
            </h2>

            <p className="mb-8 max-w-md leading-7 text-[#10292D]/65">
              {ar
                ? 'أضف المنتجات التي تريدها من المتجر، وستظهر هنا مباشرة.'
                : 'Add products from the shop and they will appear here.'}
            </p>

            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onNavigate('shop')}
              className="rounded-full bg-[#16B8BE] px-9 py-4 font-bold text-white shadow-xl transition hover:bg-[#139da2]"
            >
              {ar ? 'تصفح المتجر' : 'Browse Shop'}
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* المنتجات */}
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.article
                  key={`${item.id}-${item.type}`}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.05,
                  }}
                  className="rounded-3xl border border-[#16B8BE]/20 bg-white/80 p-4 shadow-xl backdrop-blur-xl sm:p-5"
                >
                  <div className="flex gap-4">
                    {/* الصورة */}
                    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                      <img
                        src={item.image}
                        alt={
                          ar
                            ? item.nameAr
                            : item.name
                        }
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* البيانات */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-black text-[#10292D]">
                            {ar
                              ? item.nameAr
                              : item.name}
                          </h3>

                          <p
                            dir="ltr"
                            className="mt-2 text-xl font-black text-[#10292D]"
                          >
                            {item.price.toFixed(3)} ر.ع
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.id,
                              item.type,
                            )
                          }
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-red-400 transition hover:bg-red-50 hover:text-red-600"
                          aria-label={
                            ar
                              ? 'حذف المنتج'
                              : 'Remove item'
                          }
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                        {/* الكمية */}
                        <div className="flex items-center rounded-full bg-[#16B8BE]/10 text-[#10292D] border border-[#16B8BE]/20">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.type,
                                Math.max(
                                  1,
                                  item.quantity - 1,
                                ),
                              )
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#16B8BE]/20"
                          >
                            <Minus className="h-4 w-4" />
                          </button>

                          <span className="min-w-10 text-center font-black">
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
                            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#16B8BE]/20"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <p
                          dir="ltr"
                          className="text-lg font-black text-[#10292D]"
                        >
                          {(
                            item.price * item.quantity
                          ).toFixed(3)}{' '}
                          ر.ع
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* ملخص الطلب */}
            <motion.aside
              initial={{ opacity: 0, x: ar ? -25 : 25 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-fit rounded-3xl border border-[#16B8BE]/20 bg-white/85 p-6 shadow-2xl backdrop-blur-xl lg:sticky lg:top-28"
            >
              <h2 className="mb-6 text-2xl font-black text-[#10292D]">
                {ar ? 'ملخص الطلب' : 'Order Summary'}
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-[#10292D]/70">
                  <span>
                    {ar
                      ? 'عدد المنتجات'
                      : 'Items'}
                  </span>

                  <span className="font-bold text-[#10292D]">
                    {totalItems}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#10292D]/70">
                  <span>
                    {ar
                      ? 'المجموع الفرعي'
                      : 'Subtotal'}
                  </span>

                  <span
                    dir="ltr"
                    className="font-bold text-[#10292D]"
                  >
                    {totalPrice.toFixed(3)} ر.ع
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#10292D]/70">
                  <span>
                    {ar ? 'التوصيل' : 'Delivery'}
                  </span>

                  <span className="font-bold text-[#10292D]">
                    {ar
                      ? 'يحدد لاحقًا'
                      : 'Calculated later'}
                  </span>
                </div>
              </div>

              <div className="my-6 border-t border-[#16B8BE]/20" />

              <div className="mb-6 flex items-center justify-between">
                <span className="text-lg font-black text-[#10292D]">
                  {ar ? 'الإجمالي' : 'Total'}
                </span>

                <span
                  dir="ltr"
                  className="text-2xl font-black text-[#10292D]"
                >
                  {totalPrice.toFixed(3)} ر.ع
                </span>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#16B8BE] py-4 font-black text-white shadow-xl transition hover:bg-[#139da2]"
              >
                {ar
                  ? 'إتمام الطلب عبر واتساب'
                  : 'Checkout via WhatsApp'}

                <ArrowRight
                  className={`h-5 w-5 ${
                    ar ? 'rotate-180' : ''
                  }`}
                />
              </motion.button>

              <button
                type="button"
                onClick={() => onNavigate('shop')}
                className="mt-4 w-full rounded-full border border-[#16B8BE]/30 py-3.5 font-bold text-[#10292D] transition hover:bg-[#16B8BE]/10"
              >
                {ar
                  ? 'متابعة التسوق'
                  : 'Continue Shopping'}
              </button>
            </motion.aside>
          </div>
        )}
      </div>
    </section>
  );
}
