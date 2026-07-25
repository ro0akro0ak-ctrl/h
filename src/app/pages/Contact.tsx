import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  Phone,
  MapPin,
  Clock,
  Send,
  User,
  MessageSquare,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Contact() {
  const { language } = useLanguage();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const contactInfo = [
    {
      icon: Phone,
      title: language === 'ar' ? 'رقم الهاتف' : 'Phone',
      value: '+968 9435 5353',
      link: 'https://wa.me/96894353535',
      ltr: true,
    },
    {
      icon: MapPin,
      title: language === 'ar' ? 'العنوان' : 'Address',
      value:
        language === 'ar'
          ? 'مسقط، المعبيلة الثامنة'
          : 'Muscat, Al Maabilah 8',
      link: null,
      ltr: false,
    },
    {
      icon: Clock,
      title: language === 'ar' ? 'ساعات العمل' : 'Working Hours',
      value:
        language === 'ar'
          ? 'طوال الأسبوع، 24 ساعة'
          : 'Open 24 hours, 7 days a week',
      link: null,
      ltr: false,
    },
  ];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const whatsappMessage =
      language === 'ar'
        ? `مرحبًا 3D TECH،%0Aالاسم: ${encodeURIComponent(
            name,
          )}%0Aرقم الهاتف: ${encodeURIComponent(
            phone,
          )}%0Aالرسالة: ${encodeURIComponent(message)}`
        : `Hello 3D TECH,%0AName: ${encodeURIComponent(
            name,
          )}%0APhone: ${encodeURIComponent(
            phone,
          )}%0AMessage: ${encodeURIComponent(message)}`;

    window.open(
      `https://wa.me/96894353535?text=${whatsappMessage}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <section
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="relative min-h-screen overflow-hidden bg-[#16B8BE] px-6 pb-20 pt-32 text-white"
    >
      {/* خلفية بسيطة */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-32 bottom-10 h-80 w-80 rounded-full bg-[#075E66]/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="hidden h-px w-16 bg-white/50 sm:block" />

            <h1 className="text-5xl font-bold tracking-tight drop-shadow-lg md:text-7xl">
              {language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
            </h1>

            <span className="hidden h-px w-16 bg-white/50 sm:block" />
          </div>

          <div className="mx-auto mb-7 h-1 w-24 rounded-full bg-white/80 shadow-lg" />

          <p className="mx-auto max-w-3xl text-lg font-medium leading-relaxed text-white md:text-xl">
            {language === 'ar'
              ? 'نحن هنا للإجابة على جميع استفساراتك والتواصل معنا، وسنرد عليك في أقرب وقت.'
              : 'We are here to answer all your questions. Contact us and we will reply as soon as possible.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* نموذج الرسالة */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/25 bg-[#075E66]/80 p-7 shadow-2xl backdrop-blur-xl md:p-10"
          >
            <h2 className="mb-8 text-3xl font-bold">
              {language === 'ar' ? 'أرسل لنا رسالة' : 'Send us a message'}
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* الاسم */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-sm font-semibold"
                >
                  {language === 'ar' ? 'الاسم' : 'Name'}
                </label>

                <div className="relative">
                  <User className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />

                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-2xl border border-white/20 bg-[#10292D]/65 py-4 pl-5 pr-12 text-white outline-none placeholder:text-white/45 focus:border-white"
                    placeholder={
                      language === 'ar'
                        ? 'أدخل اسمك'
                        : 'Enter your name'
                    }
                  />
                </div>
              </div>

              {/* رقم الهاتف */}
              <div>
                <label
                  htmlFor="contact-phone"
                  className="mb-2 block text-sm font-semibold"
                >
                  {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                </label>

                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />

                  <input
                    id="contact-phone"
                    type="tel"
                    inputMode="tel"
                    required
                    dir="ltr"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="w-full rounded-2xl border border-white/20 bg-[#10292D]/65 py-4 pl-5 pr-12 text-left text-white outline-none placeholder:text-white/45 focus:border-white"
                    placeholder="+968 9435 5353"
                  />
                </div>
              </div>

              {/* الرسالة */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-semibold"
                >
                  {language === 'ar' ? 'الرسالة' : 'Message'}
                </label>

                <div className="relative">
                  <MessageSquare className="absolute right-4 top-5 h-5 w-5 text-white/50" />

                  <textarea
                    id="contact-message"
                    rows={6}
                    required
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    className="w-full resize-none rounded-2xl border border-white/20 bg-[#10292D]/65 px-5 py-4 pr-12 text-white outline-none placeholder:text-white/45 focus:border-white"
                    placeholder={
                      language === 'ar'
                        ? 'اكتب رسالتك هنا...'
                        : 'Write your message here...'
                    }
                  />
                </div>
              </div>

              {/* زر الإرسال */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 text-lg font-bold text-[#10292D] shadow-xl"
              >
                <Send className="h-5 w-5" />

                {language === 'ar'
                  ? 'إرسال الرسالة'
                  : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>

          {/* معلومات التواصل */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/25 bg-[#075E66]/80 p-7 shadow-2xl backdrop-blur-xl md:p-10"
          >
            <div className="space-y-1">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;

                const card = (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.12 }}
                    whileHover={{ x: language === 'ar' ? -5 : 5 }}
                    className="flex items-center gap-5 border-b border-white/15 py-8 last:border-b-0"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                      <Icon className="h-8 w-8" />
                    </div>

                    <div>
                      <h3 className="mb-2 text-xl font-bold">
                        {info.title}
                      </h3>

                      <p
                        dir={info.ltr ? 'ltr' : undefined}
                        className={`text-white/80 ${
                          info.ltr ? 'text-left' : ''
                        }`}
                      >
                        {info.value}
                      </p>
                    </div>
                  </motion.div>
                );

                return info.link ? (
                  <a
                    key={info.title}
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {card}
                  </a>
                ) : (
                  <div key={info.title}>{card}</div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
