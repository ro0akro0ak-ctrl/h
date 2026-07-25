import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Phone,
  Package,
  PackageCheck,
  Truck,
  CheckCircle2,
} from 'lucide-react';

export default function About() {
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [found, setFound] = useState(false);

  const handleSearch = (event: any) => {
    event.preventDefault();

    const cleanPhone = phone.replace(/[^0-9]/g, '');

    if (
      cleanPhone === '94355353' ||
      cleanPhone === '96894355353'
    ) {
      setFound(true);
    } else {
      setFound(false);
    }

    setSearched(true);
  };

  const particles = Array.from({ length: 35 });

  return (
    <section
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#16B8BE] px-6 pb-24 pt-32 text-white"
    >
      {/* النقاط المتحركة */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((_, index) => (
          <motion.div
            key={index}
            animate={{
              opacity: [0.15, 0.55, 0.15],
              y: [0, -80, 0],
            }}
            transition={{
              duration: 8 + (index % 8),
              repeat: Infinity,
              delay: (index % 10) * 0.3,
            }}
            className="absolute h-1.5 w-1.5 rounded-full bg-white"
            style={{
              left: `${(index * 17) % 100}%`,
              top: `${(index * 23) % 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
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

          <p className="text-lg text-white/80">
            أدخل رقم الهاتف المستخدم عند الطلب لمعرفة حالة طلبك
          </p>
        </motion.div>

        {/* البحث */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto max-w-3xl rounded-3xl border border-white/25 bg-[#075E66]/80 p-6 shadow-2xl md:p-10"
        >
          <form onSubmit={handleSearch}>
            <label
              htmlFor="phone"
              className="mb-3 block text-lg font-bold"
            >
              رقم الهاتف
            </label>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Phone className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+968 9435 5353"
                  className="w-full rounded-2xl border border-white/30 bg-white/10 py-4 pl-4 pr-12 text-white outline-none placeholder:text-white/50 focus:border-white"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-black"
              >
                <Search className="h-5 w-5" />
                تتبع الطلب
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* الطلب موجود */}
        {searched && found && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10"
          >
            <div className="mb-8 grid gap-4 rounded-3xl border border-white/25 bg-[#075E66]/80 p-6 shadow-xl md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-white/60">رقم الطلب</p>
                <p className="mt-1 font-bold">#3DT-1024</p>
              </div>

              <div>
                <p className="text-sm text-white/60">اسم العميل</p>
                <p className="mt-1 font-bold">حمد</p>
              </div>

              <div>
                <p className="text-sm text-white/60">رقم الهاتف</p>
                <p className="mt-1 font-bold" dir="ltr">
                  +968 9435 5353
                </p>
              </div>

              <div>
                <p className="text-sm text-white/60">المنتج</p>
                <p className="mt-1 font-bold">
                  Bambu Lab A1 Mini
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/25 bg-[#075E66]/80 p-6 shadow-2xl md:p-10">
              <h2 className="mb-10 text-center text-2xl font-bold">
                حالة الطلب
              </h2>

              <div className="grid gap-8 md:grid-cols-4">
                <StatusStep
                  icon={PackageCheck}
                  title="تم تأكيد الطلب"
                  description="تم استلام طلبك"
                  active
                />

                <StatusStep
                  icon={Package}
                  title="جاري التحضير"
                  description="تم تجهيز الطلب"
                  active
                />

                <StatusStep
                  icon={Truck}
                  title="قيد التوصيل"
                  description="طلبك في الطريق"
                  active
                />

                <StatusStep
                  icon={CheckCircle2}
                  title="تم الاستلام"
                  description="لم يتم التسليم بعد"
                  active={false}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* الطلب غير موجود */}
        {searched && !found && (
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
              تأكد من إدخال رقم الهاتف المستخدم عند إنشاء الطلب
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function StatusStep({
  icon: Icon,
  title,
  description,
  active,
}: any) {
  return (
    <div className="text-center">
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
        {title}
      </h3>

      <p
        className={`mt-2 text-sm ${
          active ? 'text-white/75' : 'text-white/30'
        }`}
      >
        {description}
      </p>
    </div>
  );
}
