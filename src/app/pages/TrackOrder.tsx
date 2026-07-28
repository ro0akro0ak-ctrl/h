import { useMemo, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock3,
  Loader2,
  PackageCheck,
  Search,
  Truck,
  UserRound,
  X,
} from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../../utils/supabase';
import Price from '../components/Price';

type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled'
  | string;

interface TrackedOrder {
  id: number;
  customer_name: string | null;
  phone: string | null;
  product_name: string | null;
  total: number | string | null;
  status: OrderStatus | null;
  created_at: string | null;
}

const STATUS_STEPS = [
  {
    key: 'pending',
    labelAr: 'تم تأكيد الطلب',
    labelEn: 'Order confirmed',
    icon: Check,
  },
  {
    key: 'processing',
    labelAr: 'جاري التحضير',
    labelEn: 'Preparing order',
    icon: PackageCheck,
  },
  {
    key: 'shipped',
    labelAr: 'قيد التوصيل',
    labelEn: 'Out for delivery',
    icon: Truck,
  },
  {
    key: 'completed',
    labelAr: 'تم الاستلام',
    labelEn: 'Delivered',
    icon: CheckCircle2,
  },
] as const;

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '');

  if (digits.startsWith('968') && digits.length > 8) {
    return digits.slice(-8);
  }

  return digits.slice(-8);
}

function getStatusIndex(status: OrderStatus | null) {
  if (status === 'completed') return 3;
  if (status === 'shipped') return 2;
  if (status === 'processing') return 1;
  if (status === 'pending' || status === 'confirmed') return 0;
  return -1;
}

function getStatusLabel(status: OrderStatus | null, ar: boolean) {
  if (status === 'completed') return ar ? 'تم الاستلام' : 'Delivered';
  if (status === 'shipped') return ar ? 'قيد التوصيل' : 'Out for delivery';
  if (status === 'processing') return ar ? 'جاري التحضير' : 'Preparing';
  if (status === 'cancelled') return ar ? 'ملغي' : 'Cancelled';
  return ar ? 'تم تأكيد الطلب' : 'Order confirmed';
}

export default function TrackOrder() {
  const { language } = useLanguage();
  const ar = language === 'ar';

  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [searchedPhone, setSearchedPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const normalizedPhone = useMemo(() => normalizePhone(phone), [phone]);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (normalizedPhone.length !== 8) {
      setErrorMessage(
        ar
          ? 'أدخل رقم هاتف عُماني صحيحًا من 8 أرقام.'
          : 'Enter a valid 8-digit Omani phone number.',
      );
      setOrders([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setErrorMessage('');
    setOrders([]);
    setHasSearched(false);

    try {
      const { data, error } = await supabase.rpc('get_orders_by_phone', {
        search_phone: phone.trim(),
      });

      if (error) {
        throw new Error(error.message);
      }

      const result = Array.isArray(data) ? (data as TrackedOrder[]) : [];

      setOrders(result);
      setSearchedPhone(normalizedPhone);
      setHasSearched(true);
    } catch (error) {
      console.error('Track order error:', error);
      setErrorMessage(
        ar
          ? `تعذر البحث عن الطلب: ${
              error instanceof Error ? error.message : 'خطأ غير معروف'
            }`
          : 'Could not track the order.',
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section
      dir={ar ? 'rtl' : 'ltr'}
      className="relative min-h-screen overflow-hidden bg-[#16B8BE] px-4 pb-20 pt-32 text-[#082E33] sm:px-6"
    >
      {/* خلفية متجر 3D TECH */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {Array.from({ length: 62 }, (_, index) => (
          <motion.span
            key={index}
            className="absolute rounded-full bg-white/35"
            style={{
              width: `${3 + (index % 4)}px`,
              height: `${3 + (index % 4)}px`,
              right: `${(index * 31) % 100}%`,
              top: `${(index * 43) % 100}%`,
            }}
            animate={{
              opacity: [0.12, 0.62, 0.12],
              y: [0, -24, 0],
              x: [0, index % 2 === 0 ? 8 : -8, 0],
            }}
            transition={{
              duration: 5 + (index % 6),
              repeat: Infinity,
              delay: (index % 10) * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-9 text-center text-white"
        >
          <span className="mb-4 inline-flex rounded-full border border-white/20 bg-[#082E33]/20 px-5 py-2 text-xs font-black tracking-[0.2em] backdrop-blur">
            3D TECH
          </span>

          <h1 className="text-4xl font-black sm:text-5xl">
            {ar ? 'تتبع الطلب' : 'Track Your Order'}
          </h1>

        </motion.div>

        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 rounded-[28px] border border-white/15 bg-[#082E33]/92 p-4 shadow-[0_20px_60px_rgba(8,46,51,0.28)] backdrop-blur-xl sm:p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <UserRound
                className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-[#16B8BE] ${
                  ar ? 'right-5' : 'left-5'
                }`}
              />

              <input
                type="tel"
                inputMode="tel"
                dir="ltr"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setErrorMessage('');
                }}
                placeholder={ar ? 'اكتب رقم الهاتف' : 'Enter phone number'}
                className={`h-14 w-full rounded-2xl border border-white/10 bg-white px-5 text-center text-base font-black text-[#082E33] outline-none transition placeholder:text-center placeholder:font-bold placeholder:text-[#8EA1A3] focus:border-[#16B8BE] focus:ring-4 focus:ring-[#16B8BE]/20 ${
                  ar ? 'pl-12 pr-12' : 'pl-12 pr-12'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#16B8BE] px-8 font-black text-white shadow-[0_12px_28px_rgba(22,184,190,0.28)] transition hover:-translate-y-0.5 hover:bg-[#13A7AD] disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[150px]"
            >
              {isSearching ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}

              {isSearching
                ? ar
                  ? 'جاري البحث...'
                  : 'Searching...'
                : ar
                  ? 'بحث'
                  : 'Search'}
            </button>
          </div>

          {errorMessage && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </motion.form>

        {hasSearched && orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[30px] border border-white/25 bg-white/95 p-10 text-center shadow-xl"
          >
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#16B8BE]/12 text-[#0B8F96]">
              <Search className="h-9 w-9" />
            </div>

            <h2 className="text-2xl font-black">
              {ar ? 'لم نجد طلبات بهذا الرقم' : 'No orders found'}
            </h2>

            <p className="mt-2 text-sm font-semibold text-[#6D8588]">
              {ar
                ? `تأكد من الرقم ${searchedPhone} أو جرّب الرقم المستخدم عند تنفيذ الطلب.`
                : 'Check the number and try again.'}
            </p>
          </motion.div>
        )}

        <div className="space-y-6">
          {orders.map((order, orderIndex) => {
            const statusIndex = getStatusIndex(order.status);
            const isCancelled = order.status === 'cancelled';

            return (
              <motion.article
                key={order.id}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: orderIndex * 0.06 }}
                className="overflow-hidden rounded-[30px] border border-white/25 bg-white/95 shadow-[0_18px_55px_rgba(8,46,51,0.17)]"
              >
                <div className="grid grid-cols-2 gap-5 border-b border-[#DCEEEF] px-5 py-6 sm:grid-cols-4 sm:px-8">
                  <div>
                    <div className="mb-1 text-xs font-bold text-[#7B9295]">
                      {ar ? 'رقم الطلب' : 'Order number'}
                    </div>
                    <div className="text-lg font-black">#{order.id}</div>
                  </div>

                  <div>
                    <div className="mb-1 text-xs font-bold text-[#7B9295]">
                      {ar ? 'الحالة' : 'Status'}
                    </div>
                    <div
                      className={`font-black ${
                        isCancelled ? 'text-red-600' : 'text-[#082E33]'
                      }`}
                    >
                      {getStatusLabel(order.status, ar)}
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 text-xs font-bold text-[#7B9295]">
                      {ar ? 'التاريخ' : 'Date'}
                    </div>
                    <div className="font-black">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString(
                            ar ? 'ar-OM' : 'en-GB',
                          )
                        : '—'}
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 text-xs font-bold text-[#7B9295]">
                      {ar ? 'الإجمالي' : 'Total'}
                    </div>
                    <Price
                      amount={order.total ?? 0}
                      className="text-lg font-black text-[#082E33]"
                    />
                  </div>
                </div>

                <div className="px-5 py-6 sm:px-8">
                  <h3 className="mb-4 text-lg font-black">
                    {ar ? 'تفاصيل الطلب والعميل' : 'Order and customer details'}
                  </h3>

                  <div className="grid grid-cols-1 gap-3 rounded-2xl bg-[#F2FBFB] p-4 text-sm sm:grid-cols-2">
                    <p className="font-semibold text-[#526D70]">
                      <span className="font-black text-[#082E33]">
                        {ar ? 'اسم العميل: ' : 'Customer: '}
                      </span>
                      {order.customer_name || '—'}
                    </p>

                    <p className="font-semibold text-[#526D70]">
                      <span className="font-black text-[#082E33]">
                        {ar ? 'المنتج: ' : 'Product: '}
                      </span>
                      {order.product_name || '—'}
                    </p>
                  </div>

                  <div className="my-6 h-px bg-[#DCEEEF]" />

                  <h3 className="mb-5 text-lg font-black">
                    {ar ? 'مراحل الطلب' : 'Order progress'}
                  </h3>

                  <div className="relative">
                    <div
                      className={`absolute bottom-5 top-5 w-0.5 bg-[#DCEEEF] ${
                        ar ? 'right-5' : 'left-5'
                      }`}
                    />

                    <div className="space-y-5">
                      {STATUS_STEPS.map((step, index) => {
                        const StepIcon = step.icon;
                        const completed =
                          !isCancelled && statusIndex >= index;
                        const active =
                          !isCancelled && statusIndex === index;

                        return (
                          <div
                            key={step.key}
                            className="relative flex items-center gap-4"
                          >
                            <div
                              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition ${
                                completed
                                  ? 'border-[#16B8BE] bg-[#16B8BE] text-white'
                                  : 'border-[#E4E9E9] bg-[#F2F0ED] text-white'
                              } ${active ? 'ring-4 ring-[#16B8BE]/15' : ''}`}
                            >
                              {completed ? (
                                <StepIcon className="h-5 w-5" />
                              ) : (
                                <span className="text-sm font-black">
                                  {index + 1}
                                </span>
                              )}
                            </div>

                            <span
                              className={`font-black ${
                                completed
                                  ? 'text-[#082E33]'
                                  : 'text-[#8FA0A2]'
                              }`}
                            >
                              {ar ? step.labelAr : step.labelEn}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {isCancelled && (
                    <div className="mt-7 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                        <X className="h-5 w-5" />
                      </div>

                      <div>
                        <div className="font-black">
                          {ar ? 'تم إلغاء الطلب' : 'Order cancelled'}
                        </div>
                        <p className="mt-1 text-sm font-semibold text-red-500">
                          {ar
                            ? 'تم إلغاء هذا الطلب ولم يتم إكمال المراحل التالية.'
                            : 'This order was cancelled and will not proceed.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {!isCancelled && (
                    <div className="mt-7 flex items-center gap-3 rounded-2xl border border-[#16B8BE]/20 bg-[#16B8BE]/10 p-4 text-[#087F84]">
                      <Clock3 className="h-5 w-5 shrink-0" />
                      <p className="text-sm font-bold">
                        {ar
                          ? 'يتم تحديث حالة الطلب تلقائيًا عند تغييرها من لوحة التحكم.'
                          : 'The order status updates automatically when changed by the store.'}
                      </p>
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
