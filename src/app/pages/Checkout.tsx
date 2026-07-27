import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Upload, Building2, House, CheckCircle2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../../utils/supabase';
import Price from '../components/Price';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

interface CheckoutProps {
  onBack: () => void;
  onSuccess: () => void;
}
interface ShippingOption {
  key: string;
  label: string;
  price: number;
  duration: string;
}

interface DiscountCodeRow {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order: number | null;
  max_uses: number | null;
  used_count: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
}

const governorateToWilayah: Record<string, string[]> = {
  مسقط: ['مسقط', 'مطرح', 'بوشر', 'السيب', 'العامرات', 'قريات'],
  ظفار: ['صلالة', 'طاقة', 'مرباط', 'رخيوت', 'ثمريت', 'ضلكوت', 'المزيونة', 'مقشن', 'شليم وجزر الحلانيات', 'سدح'],
  مسندم: ['خصب', 'دبا', 'بخاء', 'مدحاء'],
  البريمي: ['البريمي', 'محضة', 'السنينة'],
  الداخلية: ['نزوى', 'بهلا', 'منح', 'الحمراء', 'آدم', 'إزكي', 'سمائل', 'بدبد', 'الجبل الأخضر'],
  'شمال الباطنة': ['صحار', 'شناص', 'لوى', 'صحم', 'الخابورة', 'السويق'],
  'جنوب الباطنة': ['الرستاق', 'العوابي', 'نخل', 'وادي المعاول', 'بركاء', 'المصنعة'],
  'جنوب الشرقية': ['صور', 'الكامل والوافي', 'جعلان بني بوحسن', 'جعلان بني بو علي', 'مصيرة'],
  'شمال الشرقية': ['إبراء', 'المضيبي', 'بدية', 'القابل', 'وادي بني خالد', 'دماء والطائيين', 'سناو'],
  الظاهرة: ['عبري', 'ينقل', 'ضنك'],
  الوسطى: ['هيما', 'محوت', 'الدقم', 'الجازر'],
};

const FALLBACK_SHIPPING: ShippingOption[] = [
  { key: 'office', label: 'توصيل للمكتب', price: 1, duration: '2-4 أيام عمل' },
  { key: 'home',   label: 'توصيل للمنزل', price: 2, duration: '2-4 أيام عمل' },
];

const FALLBACK_BANK = {
  bank_account_name:         'HAMAD################BAL',
  bank_account_number:       '0401063526560013',
  bank_transfer_number:      '90977867',
  bank_payment_instructions: '',
};

const formatPriceText = (amount: number) => `${amount.toFixed(3)} ريال عُماني`;

export default function Checkout({ onBack, onSuccess }: CheckoutProps) {
  const { items, totalPrice, clearCart } = useCart();
  const checkoutItems = items;

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>(FALLBACK_SHIPPING);
  const [bankInfo, setBankInfo] = useState(FALLBACK_BANK);
  
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'cash_on_delivery'>('bank_transfer');

  useEffect(() => {
    supabase
      .from('shipping_methods')
      .select('key, label, price, duration')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setShippingOptions(
            data.map(m => ({
              key: m.key,
              label: m.label,
              price: Number(m.price),
              duration: m.duration ?? '',
            }))
          );
        }
      })
      .catch(() => {});

    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['bank_account_name', 'bank_account_number', 'bank_transfer_number', 'bank_payment_instructions'])
      .then(({ data }) => {
        if (data && data.length > 0) {
          const map: Record<string, string> = {};
          data.forEach((row: { key: string; value: string }) => { map[row.key] = row.value; });
          setBankInfo(prev => ({ ...prev, ...map }));
        }
      })
      .catch(() => {});
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    country: 'سلطنة عمان',
    governorate: '',
    city: '',
    addressDetails: '',
    notes: '',
    shippingMethod: 'office',
  });

  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [receiptFileName, setReceiptFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponStatus, setCouponStatus] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ amount: number; label: string; codeId?: number } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const subtotal = Number(totalPrice) || 0;
  const selectedShipping = shippingOptions.find(s => s.key === formData.shippingMethod) ?? shippingOptions[0];
  const shippingCost = selectedShipping?.price ?? 0;
  const discountAmount = appliedDiscount?.amount ?? 0;
  const total = subtotal - discountAmount + shippingCost;
  const wilayahOptions = governorateToWilayah[formData.governorate] || [];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'governorate') {
      setFormData(prev => ({ ...prev, governorate: value, city: '' }));
      return;
    }

    if (name === 'shippingMethod') {
      setFormData(prev => ({ ...prev, shippingMethod: value }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptImage(file);
      setReceiptFileName(file.name);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setReceiptImage(file);
      setReceiptFileName(file.name);
    }
  };

  const applyCoupon = async () => {
    const trimmedCode = couponCode.trim();
    if (!trimmedCode) return;

    setIsApplyingCoupon(true);
    setCouponStatus('');

    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .ilike('code', trimmedCode)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) {
        setIsCouponApplied(false);
        setAppliedDiscount(null);
        setCouponStatus('كود الخصم غير صالح');
        setIsApplyingCoupon(false);
        return;
      }

      const coupon = data as DiscountCodeRow;
      const now = new Date();

      if (coupon.starts_at && new Date(coupon.starts_at) > now) {
        setIsCouponApplied(false);
        setAppliedDiscount(null);
        setCouponStatus('كود الخصم لم يبدأ بعد');
        setIsApplyingCoupon(false);
        return;
      }

      if (coupon.expires_at && new Date(coupon.expires_at) < now) {
        setIsCouponApplied(false);
        setAppliedDiscount(null);
        setCouponStatus('انتهت صلاحية كود الخصم');
        setIsApplyingCoupon(false);
        return;
      }

      if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
        setIsCouponApplied(false);
        setAppliedDiscount(null);
        setCouponStatus('تم استخدام هذا الكود بالحد الأقصى');
        setIsApplyingCoupon(false);
        return;
      }

      if (coupon.min_order !== null && subtotal < coupon.min_order) {
        setIsCouponApplied(false);
        setAppliedDiscount(null);
        setCouponStatus(`الحد الأدنى للطلب هو ${formatPriceText(coupon.min_order)}`);
        setIsApplyingCoupon(false);
        return;
      }

      const discountAmt =
        coupon.discount_type === 'percentage'
          ? (subtotal * coupon.discount_value) / 100
          : coupon.discount_value;

      const label =
        coupon.discount_type === 'percentage'
          ? `${coupon.code} (${coupon.discount_value}%)`
          : `${coupon.code} (${formatPriceText(coupon.discount_value)})`;

      setAppliedDiscount({ amount: discountAmt, label, codeId: coupon.id });
      setIsCouponApplied(true);
      setCouponStatus('تم تطبيق كود الخصم بنجاح');
    } catch {
      setIsCouponApplied(false);
      setAppliedDiscount(null);
      setCouponStatus('كود الخصم غير صالح');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
    setIsCouponApplied(false);
    setAppliedDiscount(null);
    setCouponStatus('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (checkoutItems.length === 0) {
      alert('لا يوجد منتج لإتمام الطلب');
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.governorate || !formData.city) {
      alert('يرجى تعبئة جميع البيانات المطلوبة');
      return;
    }

    if (!receiptImage) {
      alert(paymentMethod === 'bank_transfer' ? 'يرجى رفع صورة الإيصال للتحويل الكامل' : 'يرجى رفع صورة إيصال تحويل العربون لتأكيد الطلب');
      return;
    }

    setIsSubmitting(true);

    try {
      const productNames = checkoutItems
        .map(item => `${item.name} × ${item.quantity || 1}`)
        .join('، ');
      
      const paymentMethodNote = paymentMethod === 'cash_on_delivery' 
        ? 'العربون 5 ريالات عُمانية والباقي عند الاستلام' 
        : 'تحويل بنكي كامل';

      const noteLines = [
        `طريقة الدفع: ${paymentMethodNote}`,
        formData.addressDetails ? `تفاصيل العنوان: ${formData.addressDetails}` : '',
        formData.notes ? `ملاحظات الطلب: ${formData.notes}` : '',
        isCouponApplied && appliedDiscount
          ? `كوبون الخصم: ${appliedDiscount.label}`
          : '',

      ].filter(Boolean);

      const fileName = `${Date.now()}-${receiptImage.name}`;

      const { error: uploadError } = await supabase.storage.from('receipts').upload(fileName, receiptImage);

      if (uploadError) {
        alert('فشل رفع صورة الإيصال');
        console.error(uploadError);
        setIsSubmitting(false);
        return;
      }

      const { data: publicUrl } = supabase.storage.from('receipts').getPublicUrl(fileName);

      const { data: insertedOrder, error } = await supabase.from('orders').insert([
        {
          customer_name: formData.fullName,
          phone: formData.phone,
          product_name: productNames,
          total,
          payment_status: 'pending',
          receipt_url: publicUrl.publicUrl,
          governorate: formData.governorate,
          city: formData.city,
          notes: noteLines.join(' | '),
          shipping_method: formData.shippingMethod,
          payment_method: paymentMethod, 
        },
      ]).select('id').single();

      if (error) {
        alert('فشل الطلب: ' + error.message);
        console.error('Supabase error:', error);
        setIsSubmitting(false);
        return;
      }

      try {
        for (const item of checkoutItems as any[]) {
          if (item.is_auction_buy_now && item.auction_id) {
            await supabase.from('auctions').update({
              status:'ended',
              is_active:false,
              buy_now_enabled:false,
              sold_via_buy_now:true
            }).eq('id', item.auction_id);
          }
        }

        if (isCouponApplied && appliedDiscount?.codeId) {
          await supabase.rpc('increment_coupon_used_count', {
            coupon_id: appliedDiscount.codeId,
          });
        }
      } catch (couponError) {
        console.warn('Coupon usage update failed, but order was created:', couponError);
      }

      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');

      savedOrders.push({
        id: insertedOrder.id
      });

      localStorage.setItem('orders', JSON.stringify(savedOrders));

      clearCart();

      alert('تم إرسال الطلب بنجاح');
      onSuccess();
    } catch (err) {
      console.error(err);
      alert('فشل الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      dir="rtl"
      lang="ar"
      className="relative min-h-screen overflow-hidden bg-[#082E33] px-4 pb-20 pt-32 text-white sm:px-6"
    >
      {/* خلفية 3D TECH مع نقاط متحركة أكثر */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(22,184,190,0.22),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(22,184,190,0.12),_transparent_34%)]" />

        {Array.from({ length: 78 }, (_, index) => (
          <motion.span
            key={index}
            className="absolute rounded-full bg-[#16B8BE]/45 shadow-[0_0_12px_rgba(22,184,190,0.25)]"
            style={{
              width: `${3 + (index % 4)}px`,
              height: `${3 + (index % 4)}px`,
              right: `${(index * 31) % 100}%`,
              top: `${(index * 43) % 100}%`,
            }}
            animate={{
              opacity: [0.15, 0.72, 0.15],
              y: [0, -28, 0],
              x: [0, index % 2 === 0 ? 9 : -9, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 5 + (index % 6),
              delay: (index % 10) * 0.16,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* الرجوع */}
        <motion.button
          type="button"
          onClick={onBack}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-bold text-white/80 backdrop-blur transition hover:bg-white/10 hover:text-white"
        >
          <ChevronRight className="h-5 w-5" />
          العودة للسلة
        </motion.button>

        {/* عنوان الصفحة — نازل عن الهيدر */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <span className="mb-4 inline-flex rounded-full border border-[#16B8BE]/25 bg-[#16B8BE]/10 px-5 py-2 text-xs font-black tracking-[0.22em] text-[#6FE8ED]">
            3D TECH
          </span>

          <h1 className="text-3xl font-black sm:text-5xl">إتمام الطلب</h1>

          <p className="mt-3 text-sm text-white/55 sm:text-base">
            أكمل بياناتك واختر طريقة الشحن والدفع المناسبة
          </p>
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
          {/* المحتوى الرئيسي */}
          <div className="space-y-6 lg:col-span-2">
            {/* معلومات العميل */}
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[30px] border border-white/10 bg-[#0D3A40]/90 p-5 shadow-2xl backdrop-blur-xl sm:p-8"
            >
              <h2 className="mb-6 text-2xl font-black">معلومات العميل</h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#082E33] px-4 py-3.5 text-white outline-none placeholder:text-white/35 focus:border-[#16B8BE]"
                  placeholder="الاسم الكامل"
                  required
                />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#082E33] px-4 py-3.5 text-white outline-none placeholder:text-white/35 focus:border-[#16B8BE]"
                  placeholder="+968 XXXX XXXX"
                  required
                />

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  readOnly
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-white/75 outline-none"
                />

                <Select
                  name="governorate"
                  required
                  value={formData.governorate}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      governorate: value,
                      city: '',
                    }))
                  }
                >
                  <SelectTrigger className="!h-[54px] !w-full !rounded-2xl !border !border-white/10 !bg-[#082E33] !px-4 !text-white !shadow-none !ring-0 [&_svg]:text-white/55">
                    <SelectValue placeholder="اختر المحافظة" />
                  </SelectTrigger>

                  <SelectContent
                    position="popper"
                    className="rounded-2xl border border-white/10 bg-[#0D3A40] p-2 text-white shadow-2xl"
                  >
                    {Object.keys(governorateToWilayah).map((governorate) => (
                      <SelectItem
                        key={governorate}
                        value={governorate}
                        className="mb-1 min-h-[44px] rounded-xl px-4 text-white outline-none data-[highlighted]:bg-[#16B8BE] data-[highlighted]:text-white data-[state=checked]:bg-[#16B8BE]"
                      >
                        {governorate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  name="city"
                  required
                  value={formData.city}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, city: value }))
                  }
                  disabled={!formData.governorate}
                >
                  <SelectTrigger className="!h-[54px] !w-full !rounded-2xl !border !border-white/10 !bg-[#082E33] !px-4 !text-white !shadow-none !ring-0 disabled:!opacity-40 [&_svg]:text-white/55">
                    <SelectValue placeholder="اختر الولاية / المدينة" />
                  </SelectTrigger>

                  <SelectContent
                    position="popper"
                    className="rounded-2xl border border-white/10 bg-[#0D3A40] p-2 text-white shadow-2xl"
                  >
                    {wilayahOptions.map((wilayah) => (
                      <SelectItem
                        key={wilayah}
                        value={wilayah}
                        className="mb-1 min-h-[44px] rounded-xl px-4 text-white outline-none data-[highlighted]:bg-[#16B8BE] data-[highlighted]:text-white data-[state=checked]:bg-[#16B8BE]"
                      >
                        {wilayah}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <textarea
                  name="addressDetails"
                  value={formData.addressDetails}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-[#082E33] px-4 py-3.5 text-white outline-none placeholder:text-white/35 focus:border-[#16B8BE] md:col-span-2"
                  placeholder="تفاصيل العنوان (اختياري)"
                />

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-[#082E33] px-4 py-3.5 text-white outline-none placeholder:text-white/35 focus:border-[#16B8BE] md:col-span-2"
                  placeholder="ملاحظات الطلب (اختياري)"
                />
              </div>
            </motion.section>

            {/* طرق الشحن */}
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-[30px] border border-white/10 bg-[#0D3A40]/90 p-5 shadow-2xl backdrop-blur-xl sm:p-8"
            >
              <h2 className="mb-6 text-2xl font-black">طرق الشحن</h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {shippingOptions.map((option) => {
                  const isSelected =
                    formData.shippingMethod === option.key;

                  return (
                    <label
                      key={option.key}
                      className={`cursor-pointer rounded-3xl border p-5 transition ${
                        isSelected
                          ? 'border-[#16B8BE] bg-[#16B8BE]/12 shadow-[0_0_0_1px_rgba(22,184,190,0.15)]'
                          : 'border-white/10 bg-[#082E33] hover:border-[#16B8BE]/55'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={option.key}
                        checked={isSelected}
                        onChange={handleInputChange}
                        className="sr-only"
                      />

                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                              isSelected
                                ? 'bg-[#16B8BE] text-white'
                                : 'bg-white/10 text-white/75'
                            }`}
                          >
                            {option.key === 'office' ? (
                              <Building2 className="h-5 w-5" />
                            ) : (
                              <House className="h-5 w-5" />
                            )}
                          </span>

                          <span className="font-black">{option.label}</span>
                        </div>

                        <span
                          className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                            isSelected
                              ? 'border-[#16B8BE] bg-[#16B8BE]'
                              : 'border-white/35'
                          }`}
                        >
                          {isSelected && (
                            <span className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </span>
                      </div>

                      <div className="mb-2 flex items-center justify-between text-sm text-white/65">
                        <span>رسوم الشحن</span>
                        <Price
                          amount={option.price}
                          className="font-black text-white"
                        />
                      </div>

                      {option.duration && (
                        <p className="text-sm text-white/50">
                          مدة التوصيل: {option.duration}
                        </p>
                      )}
                    </label>
                  );
                })}
              </div>
            </motion.section>

            {/* طريقة الدفع */}
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[30px] border border-white/10 bg-[#0D3A40]/90 p-5 shadow-2xl backdrop-blur-xl sm:p-8"
            >
              <h2 className="mb-6 text-2xl font-black">طريقة الدفع</h2>

              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  { key: 'bank_transfer', label: 'تحويل بنكي' },
                  {
                    key: 'cash_on_delivery',
                    label: 'الدفع عند الاستلام',
                  },
                ].map((method) => {
                  const selected = paymentMethod === method.key;

                  return (
                    <button
                      key={method.key}
                      type="button"
                      onClick={() =>
                        setPaymentMethod(
                          method.key as
                            | 'bank_transfer'
                            | 'cash_on_delivery',
                        )
                      }
                      className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-right font-black transition ${
                        selected
                          ? 'border-[#16B8BE] bg-[#16B8BE]/12'
                          : 'border-white/10 bg-[#082E33] hover:border-[#16B8BE]/55'
                      }`}
                    >
                      <span>{method.label}</span>

                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          selected
                            ? 'border-[#16B8BE] bg-[#16B8BE]'
                            : 'border-white/35'
                        }`}
                      >
                        {selected && (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* معلومات البنك */}
              <div className="mb-6 rounded-3xl border border-[#16B8BE]/20 bg-[#082E33] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-black">
                    {paymentMethod === 'bank_transfer'
                      ? 'معلومات التحويل البنكي'
                      : 'الدفع عند الاستلام'}
                  </h3>

                  <span className="rounded-full bg-[#16B8BE] px-3 py-1 text-xs font-black">
                    يدوي
                  </span>
                </div>

                {paymentMethod === 'cash_on_delivery' && (
                  <p className="mb-5 rounded-2xl border border-[#16B8BE]/15 bg-[#16B8BE]/10 p-4 text-sm leading-7 text-white/75">
                    يرجى تحويل عربون لا يقل عن 5 ريالات عُمانية
                    لتأكيد الطلب، ويتم دفع باقي المبلغ عند الاستلام.
                  </p>
                )}

                <div className="space-y-4 text-sm">
                  <div className="flex flex-wrap justify-between gap-3 border-b border-white/10 pb-3">
                    <span className="text-white/55">اسم الحساب:</span>
                    <b>{bankInfo.bank_account_name}</b>
                  </div>

                  <div className="flex flex-wrap justify-between gap-3 border-b border-white/10 pb-3">
                    <span className="text-white/55">رقم الحساب:</span>
                    <b dir="ltr">{bankInfo.bank_account_number}</b>
                  </div>

                  <div className="flex flex-wrap justify-between gap-3 border-b border-white/10 pb-3">
                    <span className="text-white/55">رقم التحويل:</span>
                    <b dir="ltr">{bankInfo.bank_transfer_number}</b>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-lg">
                    <span className="font-black">
                      {paymentMethod === 'bank_transfer'
                        ? 'المبلغ المطلوب:'
                        : 'العربون المطلوب:'}
                    </span>

                    <Price
                      amount={
                        paymentMethod === 'bank_transfer' ? total : 5
                      }
                      className="text-2xl font-black text-[#6FE8ED]"
                    />
                  </div>

                  {bankInfo.bank_payment_instructions && (
                    <p className="border-t border-white/10 pt-4 leading-7 text-white/55">
                      {bankInfo.bank_payment_instructions}
                    </p>
                  )}
                </div>
              </div>

              {/* رفع الإيصال */}
              <div
                className={`rounded-3xl border-2 border-dashed p-8 text-center transition ${
                  dragActive
                    ? 'border-[#16B8BE] bg-[#16B8BE]/12'
                    : 'border-white/15 bg-[#082E33]'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="receipt-upload"
                />

                <label
                  htmlFor="receipt-upload"
                  className="flex cursor-pointer flex-col items-center"
                >
                  <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#16B8BE]/12 text-[#6FE8ED]">
                    <Upload className="h-8 w-8" />
                  </span>

                  <span className="font-black">
                    {receiptFileName
                      ? `تم الرفع: ${receiptFileName}`
                      : paymentMethod === 'bank_transfer'
                        ? 'رفع صورة التحويل / إرفاق إثبات الدفع'
                        : 'إرفاق إيصال تحويل العربون (5 ريالات عُمانية)'}
                  </span>

                  <span className="mt-2 text-sm text-white/45">
                    PNG / JPG
                  </span>
                </label>
              </div>
            </motion.section>
          </div>

          {/* ملخص الطلب */}
          <aside className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-28 rounded-[30px] border border-white/10 bg-[#0D3A40]/95 p-5 shadow-2xl backdrop-blur-xl sm:p-7"
            >
              <h2 className="mb-6 text-2xl font-black">ملخص الطلب</h2>

              <div className="mb-6 space-y-4">
                {checkoutItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 border-b border-white/10 pb-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-14 rounded-2xl border border-white/10 object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-xs font-bold">
                          منتج
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate font-black">{item.name}</p>
                        <p className="mt-1 text-xs text-white/50">
                          الكمية: {item.quantity || 1}
                        </p>
                      </div>
                    </div>

                    <Price
                      amount={item.price * (item.quantity || 1)}
                      className="font-black text-white"
                    />
                  </div>
                ))}
              </div>

              {/* كوبون الخصم */}
              <div className="mb-6 rounded-3xl border border-white/10 bg-[#082E33] p-4">
                <label className="mb-3 block font-black">كوبون الخصم</label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={handleCouponChange}
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-white outline-none placeholder:text-white/35 focus:border-[#16B8BE]"
                    placeholder="أدخل كود الخصم"
                  />

                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={isApplyingCoupon}
                    className="rounded-xl bg-[#16B8BE] px-4 py-2.5 font-black text-white transition hover:bg-[#13A7AD] disabled:opacity-55"
                  >
                    {isApplyingCoupon ? '...' : 'تطبيق'}
                  </button>
                </div>

                {couponStatus &&
                  (isCouponApplied ? (
                    <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>{couponStatus}</span>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-red-300">
                      {couponStatus}
                    </p>
                  ))}
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/55">المنتجات:</span>
                  <Price amount={subtotal} className="font-black" />
                </div>

                <div className="flex justify-between">
                  <span className="text-white/55">الخصم:</span>
                  <span className="inline-flex items-center gap-1 font-black">
                    <span>-</span>
                    <Price amount={discountAmount} />
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-white/55">رسوم التوصيل:</span>
                  <Price amount={shippingCost} className="font-black" />
                </div>

                <div className="flex items-center justify-between text-lg">
                  <span className="font-black">الإجمالي الكامل:</span>
                  <Price
                    amount={total}
                    className="text-2xl font-black text-[#6FE8ED]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !receiptImage ||
                  !formData.fullName ||
                  !formData.phone ||
                  !formData.governorate ||
                  !formData.city
                }
                className="mt-7 w-full rounded-full bg-[#16B8BE] py-4 text-lg font-black text-white shadow-[0_14px_34px_rgba(22,184,190,0.26)] transition hover:-translate-y-0.5 hover:bg-[#13A7AD] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
              >
                {isSubmitting ? 'جاري إرسال الطلب...' : 'تأكيد الطلب'}
              </button>
            </motion.div>
          </aside>
        </div>
      </div>
    </form>
  );
}
