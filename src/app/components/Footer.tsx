import { Instagram, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      dir="rtl"
      className="bg-[#16B8BE] px-6 py-14 text-white"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          {/* بيانات المتجر */}
          <div className="text-center md:text-right">
            <h2 className="text-2xl font-bold tracking-wider">
              3D TECH
            </h2>

            <p className="mt-4 text-white/85">
              Beyond Dimensions
            </p>

            <div className="mt-6 flex items-center justify-center gap-3 md:justify-start">
              {/* واتساب */}
              <a
                href="https://wa.me/96894353535"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <MessageCircle className="h-6 w-6" />
              </a>

              {/* إنستغرام */}
              <a
                href="https://instagram.com/3dtech.om"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* اتصل بنا */}
          <div className="text-center md:mr-auto md:text-left">
            <h3 className="text-lg font-bold">
              اتصل بنا
            </h3>

            <div className="mt-5 space-y-4">
              {/* الرقم */}
              <a
                href="https://wa.me/96894353535"
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="flex items-center justify-center gap-3 text-white/90 transition hover:text-white md:justify-start"
              >
                <MessageCircle className="h-5 w-5" />

                <span className="whitespace-nowrap">
                  +968 9435 3535
                </span>
              </a>

              {/* الموقع */}
              <div className="flex items-center justify-center gap-3 text-white/90 md:justify-start">
                <MapPin className="h-5 w-5" />

                <span>
                  مسقط، المعبيلة
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/20 pt-8 text-center text-sm text-white/75">
          © 2026 3D TECH. جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}
