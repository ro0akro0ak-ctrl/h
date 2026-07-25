import { motion } from 'motion/react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { key: 'nav.home', href: '#' },
    { key: 'nav.shop', href: '#shop' },
    { key: 'nav.wholesale', href: '#wholesale' },
    { key: 'nav.about', href: '#about' },
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  return (
    <footer className="relative mt-24 bg-[#16B8BE] text-white border-t border-white/10 overflow-hidden">
      {/* Background Gradient / Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-2xl font-bold mb-4 tracking-wider">
              <span className="text-white drop-shadow-md">
                3D TECH
              </span>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">
              Beyond Dimensions
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-bold mb-4 text-white">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5 }}
                    className="text-white/80 hover:text-white transition-colors inline-block"
                  >
                    {t(link.key)}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-4 text-white">{t('footer.customerService')}</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors inline-block">
                  {t('nav.contact')}
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors inline-block">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors inline-block">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors inline-block">
                  Shipping
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-4 text-white">{t('nav.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/80">
                <Mail className="w-5 h-5 mt-0.5 shrink-0" />
                <span>support@3dtech.com</span>
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <Phone className="w-5 h-5 mt-0.5 shrink-0" />
                <span>+967 777 123 4567</span>
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                <span>Sana'a, Yemen</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-white/10 text-center text-white/70 text-sm"
        >
          <p>© 2026 3D TECH. {t('footer.rights')}</p>
        </motion.div>
      </div>
    </footer>
  );
}
