import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  PackageCheck,
  Package,
  Truck,
  CheckCircle2,
  Phone,
} from 'lucide-react';

type OrderStatus =
  | 'confirmed'
  | 'preparing'
  | 'shipping'
  | 'delivered';

interface OrderData {
  orderNumber: string;
  customerName: string;
  phone: string;
  productName: string;
  status: OrderStatus;
}

export default function About() {
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState('');

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanPhone = phone.replace(/\s/g, '');

    if (!cleanPhone) {
      setError('أدخل رقم الهاتف أولًا');
      setOrder(null);
      setSearched(false);
      return;
    }

    setError('');
    setSearched(true);

    // بيانات تجريبية مؤقتة
    if (
      cleanPhone === '94355353' ||
      cleanPhone === '96894355353' ||
      cleanPhone === '+96894355353'
    ) {
      setOrder({
        orderNumber: '#3DT-1024',
        customerName: 'حمد',
        phone: '+968 9435 5353',
        productName: 'Bambu Lab A1 Mini',
        status: 'shipping',
      });
    } else {
      setOrder(null);
    }
  };

  const steps = [
    {
      id: 'confirmed',
      title: 'تم تأكيد الطلب',
      description: 'تم استلام طلبك بنجاح',
      icon: PackageCheck,
    },
    {
      id: 'preparing',
      title: 'جاري التحضير',
      description: 'يتم تجهيز الطلب الآن',
      icon: Package,
    },
    {
      id: 'shipping',
      title: 'قيد التوصيل',
      description: 'طلبك في الطريق إليك',
      icon: Truck,
    },
    {
      id: 'delivered',
      title: 'تم الاستلام',
      description: 'تم تسليم الطلب بنجاح',
      icon: CheckCircle2,
    },
  ] as const;

  const statusIndex: Record<OrderStatus, number> = {
    confirmed: 0,
    preparing: 1,
    shipping: 2,
    delivered: 3,
  };

  return (
    <section
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#16B8BE] px-6 pb-24 pt-32 text-white"
    >
      {/* النقاط المتحركة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(45)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, 0.55, 0.2],
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute w-1.5 h-1.5 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            تتبع طلبك
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-white/80">
            أدخل رقم الهاتف المستخدم في الطلب لمعرفة حالة طلبك
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto max-w-3xl rounded-3xl border border-white/25 bg-[#075E66]/75 p-6 shadow-2xl backdrop-blur-xl md:p-10"
        >
          <form onSubmit={handleSearch}>
            <label className="mb-3 block text-lg font-semibold">
              رقم الهاتف
            </label>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Phone className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+968 9435 5353"
                  className="w-full rounded-2xl border border-white/25 bg-white/10 py-4 pl-4 pr-12 text-white outline-none placeholder:text-white/50 focus:border-white"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-black shadow-lg"
              >
                <Search className="h-5 w-5" />
                تتبع الطلب
              </motion.button>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-200">
                {error}
              </p>
            )}
          </form>
        </motion.div>

        {searched && order && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10"
          >
            <div className="mb-8 grid gap-4 rounded-3xl border border-white/25 bg-[#075E66]/75 p-6 shadow-xl backdrop-blur-xl md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-white/60">رقم الطلب</p>
                <p className="mt-1 font-bold">{order.orderNumber}</p>
              </div>

              <div>
                <p className="text-sm text-white/60">اسم العميل</p>
                <p className="mt-1 font-bold">{order.customerName}</p>
              </div>

              <div>
                <p className="text-sm text-white/60">رقم الهاتف</p>
                <p className="mt-1 font-bold">{order.phone}</p>
              </div>

              <div>
                <p className="text-sm text-white/60">المنتج</p>
                <p className="mt-1 font-bold">{order.productName}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/25 bg-[#075E66]/75 p-6 shadow-2xl backdrop-blur-xl md:p-10">
              <h2 className="mb-10 text-center text-2xl font-bold">
                حالة الطلب
              </h2>

              <div className="grid gap-6 md:grid-cols-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const active = index <= statusIndex[order.status];

                  return (
                    <div
                      key={step.id}
                      className="relative text-center"
                    >
                      <div
                        className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border ${
                          active
                            ? 'border-white bg-white text-[#075E66]'
                            : 'border-white/20 bg-white/10 text-white/40'
                        }`}
                      >
                        <Icon className="h-8 w-8" />
                      </div>

                      <h3
                        className={`font-bold ${
                          active ? 'text-white' : 'text-white/40'
                        }`}
                      >
                        {step.title}
                      </h3>

                      <p
                        className={`mt-2 text-sm ${
                          active ? 'text-white/75' : 'text-white/30'
                        }`}
                      >
                        {step.description}
                      </p>

                      {index < steps.length - 1 && (
                        <div
                          className={`absolute left-[-50%] top-8 hidden h-0.5 w-full md:block ${
                            index < statusIndex[order.status]
                              ? 'bg-white'
                              : 'bg-white/20'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {searched && !order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-10 max-w-3xl rounded-3xl border border-white/25 bg-[#075E66]/75 p-10 text-center shadow-xl"
          >
            <Package className="mx-auto mb-4 h-14 w-14 text-white/70" />

            <h2 className="text-2xl font-bold">
              لم يتم العثور على طلب
            </h2>

            <p className="mt-3 text-white/70">
              تأكد من كتابة رقم الهاتف نفسه المستخدم عند إنشاء الطلب
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
