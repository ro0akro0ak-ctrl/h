import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User,
} from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../../utils/supabase';

export default function Contact() {
  const { language } = useLanguage();
  const ar = language === 'ar';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const contactInfo = [
    {
      icon: Phone,
      title: ar ? 'رقم الهاتف' : 'Phone',
      value: '+968 7197 9631',
      link: 'https://wa.me/96871979631',
      ltr: true,
    },
    {
      icon: MapPin,
      title: ar ? 'العنوان' : 'Address',
      value: ar ? 'مسقط، المعبيلة' : 'Muscat, Al Maabilah',
      link: null,
      ltr: false,
    },
    {
      icon: Clock,
      title: ar ? 'ساعات العمل' : 'Working Hours',
      value: ar ? 'طوال الأسبوع، 24 ساعة' : 'Open 24 hours, 7 days a week',
      link: null,
      ltr: false,
    },
  ];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanPhone || !cleanMessage) {
      setSubmitError(ar ? 'يرجى تعبئة جميع الحقول.' : 'Please complete all fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const { error } = await supabase.from('contact_messages').insert([
        {
          name: cleanName,
          phone: cleanPhone,
          message: cleanMessage,
          status: 'new',
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }

      setName('');
      setPhone('');
      setMessage('');
      setSubmitSuccess(
        ar
          ? 'تم إرسال رسالتك بنجاح، وسنتواصل معك في أقرب وقت.'
          : 'Your message was sent successfully. We will contact you soon.',
      );
    } catch (error) {
      console.error('Contact message error:', error);
      setSubmitError(
        ar
          ? `تعذر إرسال الرسالة: ${
              error instanceof Error ? error.message : 'خطأ غير معروف'
            }`
          : 'Could not send your message.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      dir={ar ? 'rtl' : 'ltr'}
      className="relative min-h-screen overflow-hidden bg-[#16B8BE] px-6 pb-20 pt-32 text-white"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 48 }, (_, index) => (
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
              x: [0, index % 2 === 0 ? 7 : -7, 0],
            }}
            transition={{
              duration: 5 + (index % 6),
              repeat: Infinity,
              delay: (index % 9) * 0.18,
            }}
          />
        ))}

        <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-32 bottom-10 h-80 w-80 rounded-full bg-[#075E66]/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="hidden h-px w-16 bg-white/50 sm:block" />
            <h1 className="text-5xl font-bold tracking-tight drop-shadow-lg md:text-7xl">
              {ar ? 'اتصل بنا' : 'Contact Us'}
            </h1>
            <span className="hidden h-px w-16 bg-white/50 sm:block" />
          </div>

          <div className="mx-auto mb-7 h-1 w-24 rounded-full bg-white/80 shadow-lg" />

          <p className="mx-auto max-w-3xl text-lg font-medium leading-relaxed text-white md:text-xl">
            {ar
              ? 'نحن هنا للإجابة على جميع استفساراتك، وسنرد عليك في أقرب وقت.'
              : 'We are here to answer your questions and will reply as soon as possible.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/25 bg-[#075E66]/80 p-7 shadow-2xl backdrop-blur-xl md:p-10"
          >
            <h2 className="mb-8 text-3xl font-bold">
              {ar ? 'أرسل لنا رسالة' : 'Send us a message'}
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold">
                  {ar ? 'الاسم' : 'Name'}
                </label>

                <div className="relative">
                  <User
                    className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-white/50 ${
                      ar ? 'right-4' : 'left-4'
                    }`}
                  />

                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className={`w-full rounded-2xl border border-white/20 bg-[#10292D]/65 py-4 text-white outline-none placeholder:text-white/45 focus:border-white ${
                      ar ? 'pl-5 pr-12' : 'pl-12 pr-5'
                    }`}
                    placeholder={ar ? 'أدخل اسمك' : 'Enter your name'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-phone" className="mb-2 block text-sm font-semibold">
                  {ar ? 'رقم الهاتف' : 'Phone Number'}
                </label>

                <div className="relative">
                  <Phone
                    className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-white/50 ${
                      ar ? 'right-4' : 'left-4'
                    }`}
                  />

                  <input
                    id="contact-phone"
                    type="tel"
                    inputMode="tel"
                    required
                    dir="ltr"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className={`w-full rounded-2xl border border-white/20 bg-[#10292D]/65 py-4 text-left text-white outline-none placeholder:text-white/45 focus:border-white ${
                      ar ? 'pl-5 pr-12' : 'pl-12 pr-5'
                    }`}
                    placeholder="+968 7197 9631"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold">
                  {ar ? 'الرسالة' : 'Message'}
                </label>

                <div className="relative">
                  <MessageSquare
                    className={`absolute top-5 h-5 w-5 text-white/50 ${
                      ar ? 'right-4' : 'left-4'
                    }`}
                  />

                  <textarea
                    id="contact-message"
                    rows={6}
                    required
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    className={`w-full resize-none rounded-2xl border border-white/20 bg-[#10292D]/65 px-5 py-4 text-white outline-none placeholder:text-white/45 focus:border-white ${
                      ar ? 'pr-12' : 'pl-12'
                    }`}
                    placeholder={ar ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                  />
                </div>
              </div>

              {submitError && (
                <div className="rounded-2xl border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm font-bold text-red-50">
                  {submitError}
                </div>
              )}

              {submitSuccess && (
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-200/30 bg-emerald-500/15 px-4 py-3 text-sm font-bold text-emerald-50">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={isSubmitting ? undefined : { scale: 1.02 }}
                whileTap={isSubmitting ? undefined : { scale: 0.98 }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 text-lg font-bold text-[#10292D] shadow-xl transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}

                {isSubmitting
                  ? ar
                    ? 'جاري الإرسال...'
                    : 'Sending...'
                  : ar
                    ? 'إرسال الرسالة'
                    : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>

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
                    whileHover={{ x: ar ? -5 : 5 }}
                    className="flex items-center gap-5 border-b border-white/15 py-8 last:border-b-0"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                      <Icon className="h-8 w-8" />
                    </div>

                    <div>
                      <h3 className="mb-2 text-xl font-bold">{info.title}</h3>
                      <p
                        dir={info.ltr ? 'ltr' : undefined}
                        className={`text-white/80 ${info.ltr ? 'text-left' : ''}`}
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
