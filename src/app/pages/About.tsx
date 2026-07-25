import { useMemo, useState, type FormEvent } from 'react';
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

interface Particle {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
  movementX: number;
}

export default function About() {
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState('');

  // تثبيت مواقع النقاط حتى لا تتغير في كل إعادة عرض
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 45 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
        movementX: Math.random() * 100 - 50,
      })),
    [],
  );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanPhone = phone.replace(/[\s,+-]/g, '');

    if (!cleanPhone) {
      setError('أدخل رقم الهاتف أولًا');
      setOrder(null);
      setSearched(false);
      return;
    }

    setError('');
    setSearched(true);

    // طلب تجريبي مؤقت
    if (
      cleanPhone === '94355353' ||
      cleanPhone === '96894355353'
    ) {
      setOrder({
        orderNumber: '#3DT-1024',
        customerName: 'حمد',
        phone: '+968 9435 5353',
        productName: 'Bambu Lab A1 Mini',
        status: 'shipping',
      });

      return;
    }

    setOrder(null);
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
      className="relative min-h-screen overflow-hidden bg-[#16B8BE] px-4 pb-24 pt-32 text-white sm:px-6"
    >
      {/* النقاط المتحركة */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, 0.55, 0.2],
              y: [0, -100, 0],
              x: [0, particle.movementX, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
            className="absolute h-1.5 w-1.5 rounded-full bg-white"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            تتبع طلبك
          </h1>

          <p className="mx-auto max-w-2xl text-base text-white/80 md:text-lg">
            أدخل رقم الهاتف المستخدم في الطلب لمعرفة حالة طلبك
          </p>
        </motion.div>

        {/* مربع البحث */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto max-w-3xl rounded-3xl border border-white/25 bg-[#075E66]/80 p-6 shadow-2xl backdrop-blur-xl md:p-10"
        >
          <form onSubmit={handleSearch}>
            <label
              htmlFor="tracking-phone"
              className="mb-3 block text-lg font-semibold"
            >
              رقم الهاتف
            </label>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Phone className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />

                <input
                  id="tracking-phone"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    setError('');
                  }}
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

        {/* بيانات الطلب */}
        {searched && order && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10"
          >
            <div className="mb-8 grid gap-4 rounded-3xl border border-white/25 bg-[#075E66]/80 p-6 shadow-xl backdrop-blur-xl md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-white/60">رقم الطلب</p>
                <p className="mt-1 font-bold">
                  {order.orderNumber}
                </p>
              </div>

              <div>
                <p className="text-sm text-white/60">اسم العميل</p>
                <p className="mt-1 font-bold">
                  {order.customerName}
                </p>
              </div>

              <div>
                <p className="text-sm text-white/60">رقم الهاتف</p>
                <p className="mt-1 font-bold" dir="ltr">
                  {order.phone}
                </p>
              </div>

              <div>
                <p className="text-sm text-white/60">المنتج</p>
                <p className="mt-1 font-bold">
                  {order.productName}
                </p>
              </div>
            </div>

            {/* حالة الطلب */}
            <div className="rounded-3xl border border-white/25 bg-[#075E66]/80 p-6 shadow-2xl backdrop-blur-xl md:p-10">
              <h2 className="mb-10 text-center text-2xl font-bold">
                حالة الطلب
              </h2>

              <div className="grid gap-8 md:grid-cols-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const active =
                    index <= statusIndex[order.status];

                  return (
                    <div
                      key={step.id}
                      className="relative text-center"
                    >
                      {index < steps.length - 1 && (
                        <div
                          className={`absolute left-[-50%] top-8 hidden h-0.5 w-full md:block ${
                            index < statusIndex[order.status]
                              ? 'bg-white'
                              : 'bg-white/20'
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border ${
                          active
                            ? 'border-white bg-white text-[#075E66]'
                            : 'border-white/20 bg-white/10 text-white/40'
                        }`}
                      >
                        <Icon className="h-8 w-8" />
                      </div>

                      <h3
                        className={`font-bold ${
                          active
                            ? 'text-white'
                            : 'text-white/40'
                        }`}
                      >
                        {step.title}
                      </h3>

                      <p
                        className={`mt-2 text-sm ${
                          active
                            ? 'text-white/75'
                            : 'text-white/30'
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* لم يتم العثور على الطلب */}
        {searched && !order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-10 max-w-3xl rounded-3xl border border-white/25 bg-[#075E66]/80 p-10 text-center shadow-xl"
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
