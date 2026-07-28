import { motion } from 'motion/react';
import { Boxes, ShieldCheck, Sparkles, Wrench } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';

export default function About() {
  const { language } = useLanguage();
  const ar = language === 'ar';

  const items = [
    {
      icon: Boxes,
      titleAr: 'منتجات مختارة',
      titleEn: 'Selected Products',
      textAr: 'نوفر طابعات ثلاثية الأبعاد وملحقاتها وخيوط الطباعة بعناية.',
      textEn: 'We provide carefully selected 3D printers, accessories, and filaments.',
    },
    {
      icon: ShieldCheck,
      titleAr: 'جودة موثوقة',
      titleEn: 'Trusted Quality',
      textAr: 'نحرص على تقديم منتجات موثوقة وخدمة واضحة قبل وبعد الشراء.',
      textEn: 'We focus on trusted products and clear support before and after purchase.',
    },
    {
      icon: Wrench,
      titleAr: 'دعم ومساعدة',
      titleEn: 'Support',
      textAr: 'نساعدك في اختيار المنتج المناسب والإجابة عن استفساراتك.',
      textEn: 'We help you choose the right product and answer your questions.',
    },
    {
      icon: Sparkles,
      titleAr: 'تجربة سهلة',
      titleEn: 'Easy Experience',
      textAr: 'متجر بسيط وسريع مع تتبع للطلبات وخيارات دفع وشحن واضحة.',
      textEn: 'A simple, fast store with order tracking and clear payment and shipping options.',
    },
  ];

  return (
    <section
      dir={ar ? 'rtl' : 'ltr'}
      className="relative min-h-screen overflow-hidden bg-[#16B8BE] px-6 pb-20 pt-32 text-white"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 42 }, (_, index) => (
          <motion.span
            key={index}
            className="absolute rounded-full bg-white/25"
            style={{
              width: `${3 + (index % 4)}px`,
              height: `${3 + (index % 4)}px`,
              right: `${(index * 31) % 100}%`,
              top: `${(index * 43) % 100}%`,
            }}
            animate={{
              opacity: [0.15, 0.6, 0.15],
              y: [0, -24, 0],
            }}
            transition={{
              duration: 5 + (index % 6),
              repeat: Infinity,
              delay: (index % 8) * 0.2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-flex rounded-full border border-white/20 bg-[#082E33]/20 px-5 py-2 text-xs font-black tracking-[0.2em]">
            3D TECH
          </span>

          <h1 className="text-4xl font-black sm:text-6xl">
            {ar ? 'من نحن' : 'About Us'}
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-base font-semibold leading-8 text-white/80 sm:text-lg">
            {ar
              ? 'متجر متخصص في الطباعة ثلاثية الأبعاد، نوفر لك المنتجات والملحقات التي تحتاجها بتجربة شراء سهلة وواضحة.'
              : 'A store specializing in 3D printing, offering the products and accessories you need through a simple and clear shopping experience.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.titleEn}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="rounded-3xl border border-white/20 bg-[#075E66]/80 p-7 shadow-2xl backdrop-blur-xl"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <Icon className="h-7 w-7" />
                </div>

                <h2 className="text-2xl font-black">
                  {ar ? item.titleAr : item.titleEn}
                </h2>

                <p className="mt-3 font-semibold leading-7 text-white/75">
                  {ar ? item.textAr : item.textEn}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
