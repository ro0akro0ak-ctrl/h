import { Instagram, MapPin, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Footer() {
  return (
    <footer
      dir="rtl"
      className="relative overflow-hidden bg-gradient-to-br from-[#ffffff] via-[#f5fcff] to-[#edfaff] px-6 py-10 text-[#10292D]"
    >
      {/* الخلفية المتحركة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, index) => (
          <motion.span
            key={index}
            animate={{
              opacity: [0.15, 0.6, 0.15],
              y: [0, -110, 0],
              x: [0, index % 2 === 0 ? 25 : -25, 0],
            }}
            transition={{
              duration: 3 + (index % 4),
              repeat: Infinity,
              delay: (index % 8) * 0.12,
              ease: 'linear',
            }}
            className="absolute h-1.5 w-1.5 rounded-full bg-[#16B8BE]"
            style={{
              left: `${(index * 19) % 100}%`,
              top: `${(index * 27) % 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* بيانات المتجر */}
          <div className="text-center md:text-right">
            <h2 className="text-2xl font-bold tracking-wider text-[#10292D]">
              3D TECH
            </h2>

            <p className="mt-4 text-[#10292D]/70">
              Beyond Dimensions
            </p>

            <div className="mt-4 flex items-center justify-center gap-3 md:justify-start">
              {/* واتساب */}
              <a
                href="https://wa.me/96894353535"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#16B8BE]/15 transition hover:bg-[#16B8BE]/30"
              >
                <MessageCircle className="h-6 w-6 text-[#10292D]" />
              </a>

              {/* إنستغرام */}
              <a
                href="https://instagram.com/3dtech.om"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#16B8BE]/15 transition hover:bg-[#16B8BE]/30"
              >
                <Instagram className="h-6 w-6 text-[#10292D]" />
              </a>
            </div>
          </div>

          {/* اتصل بنا */}
          <div className="text-center md:mr-auto md:text-left">
            <h3 className="text-lg font-bold text-[#10292D]">
              اتصل بنا
            </h3>

            <div className="mt-3 space-y-4">
              {/* الرقم */}
              <a
                href="https://wa.me/96894353535"
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="flex items-center justify-center gap-3 text-[#10292D]/80 transition hover:text-[#10292D] md:justify-start"
              >
                <MessageCircle className="h-5 w-5" />

                <span className="whitespace-nowrap">
                  +968 9435 3535
                </span>
              </a>

              {/* الموقع */}
              <div className="flex items-center justify-center gap-3 text-[#10292D]/80 md:justify-start">
                <MapPin className="h-5 w-5" />

                <span>
                  مسقط، المعبيلة
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[#16B8BE]/20 pt-5 text-center text-sm text-[#10292D]/60">
          © 2026 3D TECH. جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}
