import { motion } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../../utils/supabase';
import { useState } from 'react';

interface CartProps {
  onNavigate: (page: string) => void;
  onClose: () => void;
}

export default function Cart({ onNavigate, onClose }: CartProps) {
  const { language } = useLanguage();
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState('');

  const handleNavigateAndClose = (page: string) => {
    onClose();
    onNavigate(page);
  };

  const handleCheckout = async () => {
    if (!user) {
      alert(language === 'ar' ? 'الرجاء تسجيل الدخول لإتمام الطلب' : 'Please login to checkout');
      handleNavigateAndClose('login');
      return;
    }

    setIsCheckingOut(true);
    setCheckoutMessage('');

    try {
      const finalPrice = totalPrice * 1.15;
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({ user_id: user.id, total_price: finalPrice, status: 'pending' })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItemsData = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        type: item.type,
        size: item.size || null,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);
      if (itemsError) throw itemsError;

      clearCart();
      setCheckoutMessage(language === 'ar' ? 'تم إتمام الطلب بنجاح!' : 'Order placed successfully!');
      window.setTimeout(() => handleNavigateAndClose('home'), 2200);
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutMessage(language === 'ar' ? 'حدث خطأ أثناء إتمام الطلب' : 'Error placing order');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#F7F7F5] text-[#092D31]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between border-b border-black/10 px-5 py-5">
        <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5" aria-label="إغلاق السلة">
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <h2 className="text-xl font-black">{language === 'ar' ? 'السلة' : 'Cart'}</h2>
          <p className="mt-0.5 text-xs text-black/50">{totalItems} {language === 'ar' ? 'منتج' : 'items'}</p>
        </div>

        <div className="flex h-10 min-w-10 items-center justify-center rounded-full bg-white px-3 text-sm font-black shadow-sm">{totalItems}</div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        {items.length === 0 && !checkoutMessage ? (
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="flex h-full min-h-[420px] flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-[#16B8BE]/10">
              <ShoppingBag className="h-11 w-11 text-[#16B8BE]" />
            </div>
            <h3 className="mb-2 text-2xl font-black">{language === 'ar' ? 'سلة التسوق فارغة' : 'Your cart is empty'}</h3>
            <p className="mb-7 max-w-xs text-sm leading-6 text-black/50">{language === 'ar' ? 'أضف منتجاتك المفضلة وستظهر هنا مباشرة.' : 'Add your favourite products and they will appear here.'}</p>
            <button type="button" onClick={() => handleNavigateAndClose('shop')} className="rounded-full bg-[#092D31] px-8 py-3.5 font-bold text-white transition hover:scale-[1.03]">
              {language === 'ar' ? 'تصفح المتجر' : 'Browse shop'}
            </button>
          </motion.div>
        ) : items.length === 0 && checkoutMessage ? (
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="flex h-full min-h-[420px] flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/15 text-green-600">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-2xl font-black">{checkoutMessage}</h3>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <motion.div key={`${item.id}-${item.type}`} initial={{ opacity: 0, x: 35 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="rounded-[22px] bg-[#092D31] p-3.5 text-white shadow-sm">
                <div className="flex gap-3">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-white">
                    <img src={item.image} alt={language === 'ar' ? item.nameAr : item.name} className="h-full w-full object-cover" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-black">{language === 'ar' ? item.nameAr : item.name}</h3>
                        <p className="mt-1 text-base font-black">${item.price}</p>
                      </div>
                      <button type="button" onClick={() => removeFromCart(item.id, item.type)} className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-red-400 transition hover:bg-white/10" aria-label="حذف المنتج">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center rounded-full bg-white text-[#092D31]">
                        <button type="button" onClick={() => updateQuantity(item.id, item.type, Math.max(1, item.quantity - 1))} className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-black/5"><Minus className="h-3.5 w-3.5" /></button>
                        <span className="min-w-8 text-center text-sm font-black">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-black/5"><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                      <span className="text-sm font-black">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-black/10 bg-[#F7F7F5] px-5 pb-5 pt-4">
          <div className="mb-2 flex items-center justify-between text-sm"><span className="text-black/55">{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span><span className="font-bold">${totalPrice.toFixed(2)}</span></div>
          <div className="mb-2 flex items-center justify-between text-sm"><span className="text-black/55">{language === 'ar' ? 'الضريبة' : 'Tax'}</span><span className="font-bold">${(totalPrice * 0.15).toFixed(2)}</span></div>
          <div className="mb-5 mt-4 flex items-center justify-between border-t border-black/10 pt-4"><span className="font-black">{language === 'ar' ? 'الإجمالي' : 'Total'}</span><span className="text-2xl font-black">${(totalPrice * 1.15).toFixed(2)}</span></div>

          <button type="button" onClick={handleCheckout} disabled={isCheckingOut} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#092D31] py-4 text-base font-black text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50">
            {isCheckingOut ? (language === 'ar' ? 'جاري التنفيذ...' : 'Processing...') : (language === 'ar' ? 'إتمام الطلب' : 'Checkout')}
            {!isCheckingOut && <ArrowRight className="h-5 w-5" />}
          </button>

          {checkoutMessage && !isCheckingOut && <p className="mt-3 text-center text-sm font-semibold text-red-500">{checkoutMessage}</p>}

          <button type="button" onClick={() => handleNavigateAndClose('shop')} className="mt-3 w-full rounded-full border border-[#092D31] py-3.5 font-bold text-[#092D31] transition hover:bg-[#092D31] hover:text-white">
            {language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
          </button>
        </div>
      )}
    </div>
  );
}
