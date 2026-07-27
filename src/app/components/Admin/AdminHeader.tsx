import { motion } from 'motion/react';
import { Menu, ExternalLink, Plus } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description?: string;
  onMenuClick: () => void;
}

export default function AdminHeader({
  title,
  description,
  onMenuClick,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#D8EFEF] bg-white/95 backdrop-blur shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left - Title & Description */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-[#063F43] truncate">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-[#6B7F80] mt-1 truncate">
                {description}
              </p>
            )}
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View Store */}
            <motion.a
              href="/#home"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#16B8BE] text-white font-semibold text-sm hover:bg-[#087F84] transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              عرض المتجر
            </motion.a>

            {/* Add Product */}
            <motion.a
              href="#admin-products"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#16B8BE] to-[#087F84] text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="h-4 w-4" />
              إضافة منتج
            </motion.a>

            {/* Mobile Menu Button */}
            <motion.button
              type="button"
              onClick={onMenuClick}
              whileTap={{ scale: 0.9 }}
              className="md:hidden flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F5FCFC] hover:bg-[#E9F8F9] text-[#16B8BE] transition-colors"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
