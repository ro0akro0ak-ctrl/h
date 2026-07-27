import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  DollarSign,
  Edit,
  LayoutDashboard,
  Loader,
  LogOut,
  Menu,
  Package,
  Plus,
  ShoppingCart,
  Tag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { supabase } from '../../utils/supabase';
import Price from '../components/Price';

export interface Product {
  id: number;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  retailPrice: number;
  wholesalePrice: number;
  stock: number;
  image: string;
  additionalImages?: string[];
  description?: string;
  descriptionAr?: string;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Discount {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order: number | null;
  max_uses: number | null;
  used_count: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
}

export interface StoreSettingsData {
  shippingFee: string;
}

type AdminTab = 'dashboard' | 'products' | 'orders' | 'discounts' | 'shipping';

export default function AdminDashboard() {
  const { language } = useLanguage();
  const { logout } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formNameAr, setFormNameAr] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formDescriptionAr, setFormDescriptionAr] = useState('');
  const [formDescriptionEn, setFormDescriptionEn] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formRetailPrice, setFormRetailPrice] = useState('');
  const [formWholesalePrice, setFormWholesalePrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [savingProduct, setSavingProduct] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);
  const [discCode, setDiscCode] = useState('');
  const [discType, setDiscType] = useState<'percentage' | 'fixed'>('percentage');
  const [discValue, setDiscValue] = useState('');
  const [discMinOrder, setDiscMinOrder] = useState('');
  const [discMaxUsesPreset, setDiscMaxUsesPreset] = useState('unlimited');
  const [discMaxUsesCustom, setDiscMaxUsesCustom] = useState('');
  const [discStartPreset, setDiscStartPreset] = useState('now');
  const [discStartCustom, setDiscStartCustom] = useState('');
  const [discEndPreset, setDiscEndPreset] = useState('month');
  const [discEndCustom, setDiscEndCustom] = useState('');
  const [discIsActive, setDiscIsActive] = useState(true);
  const [savingDiscount, setSavingDiscount] = useState(false);

  const [storeSettings, setStoreSettings] = useState<StoreSettingsData>({
    shippingFee: '25',
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    void fetchSupabaseData();
  }, []);

  useEffect(() => {
    const previewUrls = imageFiles.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(previewUrls);

    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  const fetchSupabaseData = async () => {
    try {
      setLoading(true);
      setGlobalError(null);

      const [prodRes, ordRes, discRes, setRes] = await Promise.all([
        supabase.from('products').select('*').order('id', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('discount_codes').select('*').order('id', { ascending: false }),
        supabase.from('store_settings').select('*').eq('id', 1).maybeSingle(),
      ]);

      if (prodRes.error) throw new Error(`خطأ في جلب المنتجات: ${prodRes.error.message}`);
      if (ordRes.error) throw new Error(`خطأ في جلب الطلبات: ${ordRes.error.message}`);
      if (discRes.error) throw new Error(`خطأ في جلب الخصومات: ${discRes.error.message}`);
      if (setRes.error) throw new Error(`خطأ في جلب إعدادات الشحن: ${setRes.error.message}`);

      setProducts((prodRes.data ?? []) as Product[]);
      setOrders((ordRes.data ?? []) as Order[]);
      setDiscounts((discRes.data ?? []) as Discount[]);

      if (setRes.data) {
        setStoreSettings({
          shippingFee: setRes.data.shipping_fee?.toString() || '25',
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء الاتصال بقاعدة البيانات';
      console.error(err);
      setGlobalError(message);
    } finally {
      setLoading(false);
    }
  };

  const totalSalesValue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const lowStockCount = products.filter((product) => product.stock <= 5).length;

  const getCategoryLabel = (category: string) => {
    if (category === 'printers') {
      return language === 'ar' ? 'الطابعات' : 'Printers';
    }

    if (category === 'accessories') {
      return language === 'ar'
        ? 'الأكسسوارات'
        : 'Accessories';
    }

    if (category === 'filament') {
      return 'Filament';
    }

    return category;
  };

  const getCategoryArabicLabel = (category: string) => {
    if (category === 'printers') return 'الطابعات';
    if (category === 'accessories') return 'الأكسسوارات';
    if (category === 'filament') return 'Filament';

    return category;
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    setActionError(null);

    try {
      const finalImagesList = [...existingImages];

      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw new Error(`فشل رفع الصورة: ${uploadError.message}`);

        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
        finalImagesList.push(data.publicUrl);
      }

      const primaryImage = finalImagesList[0] || '';
      const productPayload = {
        name: formNameEn || formNameAr,
        nameAr: formNameAr,
        description: formDescriptionEn,
        descriptionAr: formDescriptionAr,
        category: formCategory,
        categoryAr: getCategoryArabicLabel(formCategory),
        retailPrice: Number(formRetailPrice) || 0,
        wholesalePrice: Number(formWholesalePrice) || 0,
        stock: Number.parseInt(formStock, 10) || 0,
        image: primaryImage,
        additionalImages: finalImagesList,
      };

      const query = editingProduct
        ? supabase.from('products').update(productPayload).eq('id', editingProduct.id)
        : supabase.from('products').insert([productPayload]);

      const { error } = await query;
      if (error) throw new Error(editingProduct ? `فشل التعديل: ${error.message}` : `فشل الإضافة: ${error.message}`);

      closeProductModal();
      await fetchSupabaseData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'فشل حفظ المنتج');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Delete this product?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw new Error(error.message);
      setProducts((current) => current.filter((product) => product.id !== id));
    } catch (err) {
      alert(`خطأ أثناء الحذف: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormNameAr(product.nameAr || '');
    setFormNameEn(product.name || '');
    setFormDescriptionAr(product.descriptionAr || '');
    setFormDescriptionEn(product.description || '');
    setFormCategory(product.category || '');
    setFormRetailPrice(product.retailPrice?.toString() || '');
    setFormWholesalePrice(product.wholesalePrice?.toString() || '');
    setFormStock(product.stock?.toString() || '');
    setExistingImages(product.additionalImages || (product.image ? [product.image] : []));
    setShowAddProductModal(true);
  };

  const closeProductModal = () => {
    setShowAddProductModal(false);
    setEditingProduct(null);
    setFormNameAr('');
    setFormNameEn('');
    setFormDescriptionAr('');
    setFormDescriptionEn('');
    setFormCategory('');
    setFormRetailPrice('');
    setFormWholesalePrice('');
    setFormStock('');
    setImageFiles([]);
    setExistingImages([]);
    setActionError(null);
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: Order['status']) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (error) throw new Error(error.message);
      setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
    } catch (err) {
      alert(`فشل تحديث حالة الطلب: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
    }
  };

  const closeDiscountModal = () => {
    setShowAddDiscountModal(false);
    setDiscCode('');
    setDiscType('percentage');
    setDiscValue('');
    setDiscMinOrder('');
    setDiscMaxUsesPreset('unlimited');
    setDiscMaxUsesCustom('');
    setDiscStartPreset('now');
    setDiscStartCustom('');
    setDiscEndPreset('month');
    setDiscEndCustom('');
    setDiscIsActive(true);
  };

  const startOfSelectedDay = (date: Date) => {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
  };

  const endOfSelectedDay = (date: Date) => {
    const copy = new Date(date);
    copy.setHours(23, 59, 59, 999);
    return copy;
  };

  const resolveStartDate = () => {
    const now = new Date();

    if (discStartPreset === 'now') return now.toISOString();

    if (discStartPreset === 'tomorrow') {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return startOfSelectedDay(tomorrow).toISOString();
    }

    if (discStartPreset === '3days') {
      const afterThreeDays = new Date(now);
      afterThreeDays.setDate(afterThreeDays.getDate() + 3);
      return startOfSelectedDay(afterThreeDays).toISOString();
    }

    if (discStartPreset === 'custom' && discStartCustom) {
      return startOfSelectedDay(new Date(`${discStartCustom}T00:00:00`)).toISOString();
    }

    return now.toISOString();
  };

  const resolveEndDate = () => {
    const now = new Date();

    if (discEndPreset === 'none') return null;

    if (discEndPreset === 'week') {
      const afterWeek = new Date(now);
      afterWeek.setDate(afterWeek.getDate() + 7);
      return endOfSelectedDay(afterWeek).toISOString();
    }

    if (discEndPreset === 'month') {
      const afterMonth = new Date(now);
      afterMonth.setMonth(afterMonth.getMonth() + 1);
      return endOfSelectedDay(afterMonth).toISOString();
    }

    if (discEndPreset === '3months') {
      const afterThreeMonths = new Date(now);
      afterThreeMonths.setMonth(afterThreeMonths.getMonth() + 3);
      return endOfSelectedDay(afterThreeMonths).toISOString();
    }

    if (discEndPreset === 'custom' && discEndCustom) {
      return endOfSelectedDay(new Date(`${discEndCustom}T00:00:00`)).toISOString();
    }

    return null;
  };

  const resolveMaxUses = () => {
    if (discMaxUsesPreset === 'unlimited') return null;
    if (discMaxUsesPreset === 'custom') {
      const customValue = Number.parseInt(discMaxUsesCustom, 10);
      return Number.isFinite(customValue) && customValue > 0 ? customValue : null;
    }

    return Number.parseInt(discMaxUsesPreset, 10);
  };

  const handleAddDiscount = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCode = discCode.trim();
    const numericValue = Number(discValue);
    const numericMinOrder = discMinOrder.trim() ? Number(discMinOrder) : null;

    if (!cleanCode) {
      alert('اكتب كود الخصم');
      return;
    }

    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      alert('اكتب قيمة خصم صحيحة');
      return;
    }

    if (discType === 'percentage' && numericValue > 100) {
      alert('نسبة الخصم لا يمكن أن تتجاوز 100%');
      return;
    }

    setSavingDiscount(true);

    try {
      const { error } = await supabase.from('discount_codes').insert([
        {
          code: cleanCode.toUpperCase(),
          discount_type: discType,
          discount_value: numericValue,
          min_order:
            numericMinOrder !== null && Number.isFinite(numericMinOrder) && numericMinOrder > 0
              ? numericMinOrder
              : null,
          max_uses: resolveMaxUses(),
          used_count: 0,
          starts_at: resolveStartDate(),
          expires_at: resolveEndDate(),
          is_active: discIsActive,
        },
      ]);

      if (error) throw new Error(error.message);

      closeDiscountModal();
      await fetchSupabaseData();
    } catch (err) {
      alert(`خطأ: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
    } finally {
      setSavingDiscount(false);
    }
  };

  const handleDeleteDiscount = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف كود الخصم؟')) return;

    try {
      const { error } = await supabase.from('discount_codes').delete().eq('id', id);
      if (error) throw new Error(error.message);
      setDiscounts((current) => current.filter((discount) => discount.id !== id));
    } catch (err) {
      alert(`خطأ: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
    }
  };

  const handleSaveShipping = async () => {
    setSavingSettings(true);
    try {
      const { error } = await supabase.from('store_settings').upsert({
        id: 1,
        shipping_fee: Number(storeSettings.shippingFee),
      });
      if (error) throw new Error(error.message);
      alert('تم حفظ تكلفة الشحن بنجاح');
    } catch (err) {
      alert(`خطأ في الحفظ: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
    } finally {
      setSavingSettings(false);
    }
  };

  const menuItems = [
    { id: 'dashboard' as const, labelAr: 'الرئيسية', labelEn: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as const, labelAr: 'المنتجات', labelEn: 'Products', icon: Package },
    { id: 'orders' as const, labelAr: 'الطلبات', labelEn: 'Orders', icon: ShoppingCart },
    { id: 'discounts' as const, labelAr: 'الخصومات', labelEn: 'Discounts', icon: Tag },
    { id: 'shipping' as const, labelAr: 'الشحن', labelEn: 'Shipping', icon: Truck },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F2FBFB] flex flex-col md:flex-row" dir="rtl">
      {/* نقاط خلفية بسيطة */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {Array.from({ length: 42 }, (_, index) => (
          <motion.span
            key={index}
            className="absolute rounded-full bg-[#17B8BE]/20"
            style={{
              width: `${4 + (index % 4) * 2}px`,
              height: `${4 + (index % 4) * 2}px`,
              right: `${(index * 23) % 100}%`,
              top: `${(index * 31) % 100}%`,
            }}
            animate={{ opacity: [0.12, 0.42, 0.12], y: [0, -18, 0] }}
            transition={{ duration: 5 + (index % 6), repeat: Infinity, delay: (index % 8) * 0.25 }}
          />
        ))}
      </div>

      {/* شريط الجوال */}
      <div className="relative z-30 md:hidden flex items-center justify-between p-4 bg-[#082E33] border-b border-white/10 sticky top-0">
        <img src="/logo.png?v=2" alt="3D TECH" className="h-10 w-auto object-contain" />
        <button
          type="button"
          onClick={() => setIsSidebarOpen((open) => !open)}
          className="p-2.5 rounded-xl bg-white/10 text-white border border-white/10"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* القائمة الجانبية */}
      <aside
        className={`fixed md:static inset-y-0 right-0 z-40 w-72 bg-[#082E33] border-l border-white/10 flex flex-col transition-transform duration-300 overflow-hidden ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 26 }, (_, index) => (
            <motion.span
              key={index}
              className="absolute rounded-full bg-white/15"
              style={{
                width: `${3 + (index % 3) * 2}px`,
                height: `${3 + (index % 3) * 2}px`,
                right: `${(index * 29) % 100}%`,
                top: `${(index * 37) % 100}%`,
              }}
              animate={{ opacity: [0.08, 0.35, 0.08], y: [0, -28, 0] }}
              transition={{ duration: 6 + (index % 5), repeat: Infinity, delay: (index % 7) * 0.3 }}
            />
          ))}
        </div>

        <div className="relative z-10 p-7 border-b border-white/10 flex items-center justify-center">
          <img src="/logo.png?v=2" alt="3D TECH" className="h-16 w-auto object-contain" />
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden absolute left-5 top-5 p-2 rounded-xl text-white/80 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="relative z-10 flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#17B8BE] text-white shadow-[0_12px_28px_rgba(23,184,190,0.30)]'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
              </button>
            );
          })}
        </nav>

        <div className="relative z-10 p-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => logout?.()}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-white/80 hover:text-white hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      <main className="relative z-10 flex-1 p-5 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {globalError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{globalError}</span>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader className="w-10 h-10 animate-spin text-[#17B8BE]" />
            </div>
          )}

          {!loading && activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black text-[#082E33] mb-1">لوحة التحكم الرئيسية</h1>
                  <p className="text-sm text-[#6D8588]">إدارة منتجات وطلبات وخصومات متجر 3D TECH</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#17B8BE] hover:bg-[#0B8F96] text-white rounded-2xl font-bold shadow-lg shadow-[#17B8BE]/20 transition-colors"
                >
                  <Plus className="w-5 h-5" /> إضافة منتج جديد
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { icon: Package, label: 'المنتجات', value: products.length },
                  {
                    icon: DollarSign,
                    label: 'إجمالي المبيعات',
                    value: (
                      <Price
                        amount={totalSalesValue}
                        className="text-2xl font-black text-[#082E33]"
                      />
                    ),
                  },
                  { icon: ShoppingCart, label: 'الطلبات', value: orders.length },
                  { icon: AlertCircle, label: 'مخزون منخفض', value: lowStockCount },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                      className="p-6 rounded-3xl bg-white/90 border border-[#CDEBEC] shadow-xl shadow-[#082E33]/5 backdrop-blur"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#082E33] flex items-center justify-center mb-5 shadow-lg">
                        <Icon className="w-6 h-6 text-[#17B8BE]" />
                      </div>
                      <div className="text-2xl font-black text-[#082E33] mb-1">{stat.value}</div>
                      <div className="text-xs text-[#6D8588] font-semibold">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {!loading && activeTab === 'products' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black text-[#082E33] mb-1">إدارة المنتجات</h1>
                  <p className="text-sm text-[#6D8588]">إضافة وتعديل وحذف منتجات المتجر</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#17B8BE] hover:bg-[#0B8F96] text-white rounded-2xl font-bold shadow-lg transition-colors"
                >
                  <Plus className="w-5 h-5" /> إضافة منتج
                </button>
              </div>

              <div className="rounded-3xl bg-white/90 border border-[#CDEBEC] shadow-xl overflow-hidden backdrop-blur">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#082E33] text-white">
                      <tr>
                        {['الصورة', 'الاسم', 'الفئة', 'القطاعي', 'المخزون', 'الإجراءات'].map((heading) => (
                          <th key={heading} className="px-6 py-4 text-right text-xs font-bold">{heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#CDEBEC]">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-[#F2FBFB] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <img src={product.image} alt={product.nameAr || product.name} className="w-12 h-12 rounded-xl object-cover border border-[#CDEBEC]" />
                              {product.additionalImages && product.additionalImages.length > 1 && (
                                <span className="text-[10px] font-bold bg-[#17B8BE]/10 text-[#0B8F96] px-1.5 py-0.5 rounded-md">
                                  +{product.additionalImages.length - 1}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-[#082E33] text-sm">{product.nameAr || product.name}</td>
                          <td className="px-6 py-4 text-xs font-bold text-[#6D8588]">{getCategoryLabel(product.category)}</td>
                          <td className="px-6 py-4 font-bold text-sm text-[#082E33]">
                            <Price amount={product.retailPrice} className="font-black" />
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#17B8BE]/10 text-[#0B8F96]">{product.stock || 0}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button type="button" onClick={() => openEditModal(product)} className="p-2 rounded-xl bg-[#082E33]/10 text-[#082E33] hover:bg-[#082E33]/20">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button type="button" onClick={() => void handleDeleteProduct(product.id)} className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {!loading && activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h1 className="text-3xl font-black text-[#082E33]">إدارة الطلبات</h1>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="p-12 text-center rounded-3xl bg-white/90 border border-[#CDEBEC] text-[#6D8588]">لا توجد طلبات مسجلة.</div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="p-6 rounded-3xl bg-white/90 border border-[#CDEBEC] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-[#082E33]">طلب #{order.id}</h3>
                        <p className="text-sm text-[#6D8588]">العميل: {order.customer_name || 'عميل مسجل'}</p>
                        <div className="mt-1 flex items-center gap-1 text-xs font-bold text-[#0B8F96]">
                          <span>الإجمالي:</span>
                          <Price amount={order.total} className="font-black" />
                        </div>
                      </div>
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => void handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                        className="px-4 py-2.5 rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] font-bold text-sm text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/30"
                      >
                        <option value="pending">قيد المعالجة</option>
                        <option value="processing">جار التجهيز</option>
                        <option value="shipped">تم الشحن</option>
                        <option value="completed">مكتمل</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {!loading && activeTab === 'discounts' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-black text-[#082E33]">أكواد الخصم</h1>
                <button type="button" onClick={() => setShowAddDiscountModal(true)} className="px-5 py-2.5 bg-[#17B8BE] hover:bg-[#0B8F96] text-white rounded-2xl font-bold transition-colors">
                  إضافة كود خصم
                </button>
              </div>

              {discounts.length === 0 ? (
                <div className="rounded-3xl border border-[#CDEBEC] bg-white/90 p-12 text-center text-[#6D8588]">
                  لا توجد أكواد خصم حتى الآن.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {discounts.map((discount) => {
                    const valueText =
                      discount.discount_type === 'percentage'
                        ? `${discount.discount_value}%`
                        : (
                          <Price
                            amount={discount.discount_value}
                            className="font-black text-[#0B8F96]"
                          />
                        );

                    const expiresText = discount.expires_at
                      ? new Date(discount.expires_at).toLocaleDateString('ar-OM')
                      : 'بدون انتهاء';

                    const usageText =
                      discount.max_uses === null
                        ? `${discount.used_count || 0} استخدام • غير محدود`
                        : `${discount.used_count || 0} من ${discount.max_uses}`;

                    return (
                      <div
                        key={discount.id}
                        className="rounded-3xl border border-[#CDEBEC] bg-white/90 p-6 shadow-lg"
                      >
                        <div className="mb-5 flex items-start justify-between gap-3">
                          <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-black text-[#082E33]">
                                {discount.code}
                              </h3>
                              <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
                                  discount.is_active
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-gray-100 text-gray-500'
                                }`}
                              >
                                {discount.is_active ? 'مفعل' : 'متوقف'}
                              </span>
                            </div>

                            <div className="text-sm font-bold text-[#0B8F96]">
                              خصم {valueText}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => void handleDeleteDiscount(discount.id)}
                            className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                            aria-label="حذف كود الخصم"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="space-y-2 border-t border-[#E2F0F1] pt-4 text-xs font-semibold text-[#6D8588]">
                          <div className="flex items-center justify-between gap-3">
                            <span>عدد الاستخدامات</span>
                            <span className="text-[#082E33]">{usageText}</span>
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <span>الحد الأدنى</span>
                            <span className="text-[#082E33]">
                              {discount.min_order ? (
                                <Price amount={discount.min_order} className="font-black" />
                              ) : (
                                'بدون حد أدنى'
                              )}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <span>ينتهي</span>
                            <span className="text-[#082E33]">{expiresText}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {!loading && activeTab === 'shipping' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h1 className="text-3xl font-black text-[#082E33]">إعدادات الشحن والتوصيل</h1>
              <div className="p-8 rounded-3xl bg-white/90 border border-[#CDEBEC] shadow-xl space-y-4 max-w-xl">
                <label className="block text-sm font-bold text-[#082E33]">تكلفة الشحن الثابتة</label>
                <input
                  type="number"
                  value={storeSettings.shippingFee}
                  onChange={(e) => setStoreSettings({ shippingFee: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/30"
                />
                <button
                  type="button"
                  onClick={() => void handleSaveShipping()}
                  disabled={savingSettings}
                  className="px-6 py-3 bg-[#17B8BE] hover:bg-[#0B8F96] disabled:opacity-50 text-white font-bold rounded-2xl transition-colors"
                >
                  {savingSettings ? 'جاري الحفظ...' : 'حفظ تكلفة الشحن'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#082E33]/70 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl p-8 rounded-3xl bg-white shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-[#082E33]">{editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}</h2>
              <button type="button" onClick={closeProductModal} className="p-2 rounded-xl hover:bg-[#F2FBFB]"><X className="w-5 h-5" /></button>
            </div>

            {actionError && <div className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{actionError}</div>}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <input
                type="text"
                placeholder="اسم المنتج (عربي)"
                value={formNameAr}
                onChange={(e) => setFormNameAr(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/30"
              />
              <input
                type="text"
                placeholder="اسم المنتج (إنجليزي)"
                value={formNameEn}
                onChange={(e) => setFormNameEn(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/30"
              />
              
              <textarea
                placeholder="وصف المنتج (عربي)"
                value={formDescriptionAr}
                onChange={(e) => setFormDescriptionAr(e.target.value)}
                rows={4}
                className="w-full resize-y px-4 py-3 rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/30"
              />

              <textarea
                placeholder="وصف المنتج (إنجليزي)"
                value={formDescriptionEn}
                onChange={(e) => setFormDescriptionEn(e.target.value)}
                rows={4}
                className="w-full resize-y px-4 py-3 rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/30"
              />

              {/* قائمة الفئات المحدثة */}
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#BDE5E7] bg-[#F3FCFC] px-4 py-3 text-[#073B3F] outline-none transition-all focus:border-[#16B8BE] focus:ring-2 focus:ring-[#16B8BE]/20"
              >
                <option value="" disabled>
                  اختر فئة المنتج
                </option>
                <option value="printers">
                  الطابعات
                </option>
                <option value="accessories">
                  الأكسسوارات
                </option>
                <option value="filament">
                  Filament
                </option>
              </select>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input type="number" step="0.01" placeholder="سعر القطاعي" value={formRetailPrice} onChange={(e) => setFormRetailPrice(e.target.value)} required className="w-full px-4 py-3 rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] outline-none" />
                <input type="number" step="0.01" placeholder="سعر الجملة" value={formWholesalePrice} onChange={(e) => setFormWholesalePrice(e.target.value)} required className="w-full px-4 py-3 rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] outline-none" />
                <input type="number" placeholder="المخزون" value={formStock} onChange={(e) => setFormStock(e.target.value)} required className="w-full px-4 py-3 rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] outline-none" />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-[#082E33]">
                  {editingProduct ? 'صورة المنتج الحالية أو اختر صورة جديدة' : 'رفع صورة المنتج'}
                </label>

                {(existingImages.length > 0 || imageFiles.length > 0) && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {existingImages.map((imageUrl, index) => (
                      <div
                        key={`existing-${imageUrl}-${index}`}
                        className="relative aspect-square overflow-hidden rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB]"
                      >
                        <img
                          src={imageUrl}
                          alt={`الصورة الحالية ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        {index === 0 && (
                          <span className="absolute bottom-1 right-1 rounded-lg bg-[#082E33]/80 px-2 py-1 text-[10px] font-bold text-white">
                            الصورة الحالية
                          </span>
                        )}
                      </div>
                    ))}

                    {imagePreviewUrls.map((previewUrl, index) => (
                      <div
                        key={`new-preview-${index}`}
                        className="relative aspect-square overflow-hidden rounded-2xl border-2 border-[#17B8BE] bg-[#F2FBFB]"
                      >
                        <img
                          src={previewUrl}
                          alt={`الصورة الجديدة ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 rounded-lg bg-[#17B8BE]/90 px-2 py-1 text-[10px] font-bold text-white">
                          صورة جديدة
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-dashed border-[#17B8BE] bg-[#F2FBFB]"
                />

                <p className="text-xs leading-5 text-[#6D8588]">
                  إذا لم تختر صورة جديدة، ستبقى الصورة الحالية كما هي. عند اختيار صورة جديدة ستظهر معاينتها هنا قبل الحفظ.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={closeProductModal} className="px-6 py-3 rounded-2xl bg-gray-100 text-gray-700 font-bold">إلغاء</button>
                <button type="submit" disabled={savingProduct} className="px-6 py-3 rounded-2xl bg-[#17B8BE] hover:bg-[#0B8F96] disabled:opacity-50 text-white font-bold transition-colors">
                  {savingProduct ? 'جاري الحفظ...' : 'حفظ المنتج'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showAddDiscountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082E33]/70 p-4 backdrop-blur-sm">
          <motion.form
            onSubmit={handleAddDiscount}
            initial={{ opacity: 0, scale: 0.97, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-[#082E33]">
                  إضافة كوبون خصم
                </h3>
                <p className="mt-1 text-sm text-[#6D8588]">
                  اختر الإعدادات السريعة، والتاريخ والوقت سيتم ضبطهما تلقائيًا.
                </p>
              </div>

              <button
                type="button"
                onClick={closeDiscountModal}
                className="rounded-xl p-2 text-[#082E33] transition hover:bg-[#F2FBFB]"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-black text-[#082E33]">
                  كود الخصم
                </label>
                <input
                  type="text"
                  placeholder="مثال: SAVE20"
                  value={discCode}
                  onChange={(e) => setDiscCode(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] px-4 py-3 text-[#082E33] uppercase outline-none focus:ring-2 focus:ring-[#17B8BE]/30"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-black text-[#082E33]">
                  نوع الخصم
                </label>
                <select
                  value={discType}
                  onChange={(e) =>
                    setDiscType(e.target.value as 'percentage' | 'fixed')
                  }
                  className="w-full rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] px-4 py-3 text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/30"
                >
                  <option value="percentage">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ ثابت</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-black text-[#082E33]">
                  قيمة الخصم
                </label>
                <input
                  type="number"
                  min="0.001"
                  max={discType === 'percentage' ? '100' : undefined}
                  step="0.001"
                  placeholder={discType === 'percentage' ? 'مثال: 10' : 'مثال: 5.000'}
                  value={discValue}
                  onChange={(e) => setDiscValue(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] px-4 py-3 text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/30"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-black text-[#082E33]">
                  الحد الأدنى للطلب
                  <span className="mr-1 font-medium text-[#6D8588]">
                    (اختياري)
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  placeholder="اتركه فارغًا بدون حد أدنى"
                  value={discMinOrder}
                  onChange={(e) => setDiscMinOrder(e.target.value)}
                  className="w-full rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] px-4 py-3 text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/30"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-black text-[#082E33]">
                  عدد مرات الاستخدام
                </label>
                <select
                  value={discMaxUsesPreset}
                  onChange={(e) => setDiscMaxUsesPreset(e.target.value)}
                  className="w-full rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] px-4 py-3 text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/30"
                >
                  <option value="unlimited">غير محدود</option>
                  <option value="1">مرة واحدة</option>
                  <option value="10">10 مرات</option>
                  <option value="50">50 مرة</option>
                  <option value="100">100 مرة</option>
                  <option value="custom">رقم مخصص</option>
                </select>

                {discMaxUsesPreset === 'custom' && (
                  <input
                    type="number"
                    min="1"
                    placeholder="اكتب العدد"
                    value={discMaxUsesCustom}
                    onChange={(e) => setDiscMaxUsesCustom(e.target.value)}
                    required
                    className="mt-2 w-full rounded-2xl border border-[#CDEBEC] bg-white px-4 py-3 text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/30"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-black text-[#082E33]">
                  بداية الكوبون
                </label>
                <select
                  value={discStartPreset}
                  onChange={(e) => setDiscStartPreset(e.target.value)}
                  className="w-full rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] px-4 py-3 text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/30"
                >
                  <option value="now">يبدأ الآن</option>
                  <option value="tomorrow">غدًا الساعة 12:00 صباحًا</option>
                  <option value="3days">بعد 3 أيام</option>
                  <option value="custom">تحديد تاريخ</option>
                </select>

                {discStartPreset === 'custom' && (
                  <input
                    type="date"
                    value={discStartCustom}
                    onChange={(e) => setDiscStartCustom(e.target.value)}
                    required
                    className="mt-2 w-full rounded-2xl border border-[#CDEBEC] bg-white px-4 py-3 text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/30"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-black text-[#082E33]">
                  انتهاء الكوبون
                </label>
                <select
                  value={discEndPreset}
                  onChange={(e) => setDiscEndPreset(e.target.value)}
                  className="w-full rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] px-4 py-3 text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/30"
                >
                  <option value="week">بعد أسبوع</option>
                  <option value="month">بعد شهر</option>
                  <option value="3months">بعد 3 أشهر</option>
                  <option value="none">بدون انتهاء</option>
                  <option value="custom">تحديد تاريخ</option>
                </select>

                {discEndPreset === 'custom' && (
                  <input
                    type="date"
                    value={discEndCustom}
                    onChange={(e) => setDiscEndCustom(e.target.value)}
                    required
                    className="mt-2 w-full rounded-2xl border border-[#CDEBEC] bg-white px-4 py-3 text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/30"
                  />
                )}
              </div>
            </div>

            <label className="mt-6 flex cursor-pointer items-center justify-between rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] px-4 py-4">
              <div>
                <div className="font-black text-[#082E33]">تفعيل الكوبون</div>
                <div className="mt-1 text-xs text-[#6D8588]">
                  عند إيقافه سيبقى محفوظًا لكنه لن يعمل في صفحة الدفع.
                </div>
              </div>

              <input
                type="checkbox"
                checked={discIsActive}
                onChange={(e) => setDiscIsActive(e.target.checked)}
                className="h-5 w-5 accent-[#17B8BE]"
              />
            </label>

            <div className="mt-7 flex flex-col-reverse justify-end gap-3 sm:flex-row">
              <button
                type="button"
                onClick={closeDiscountModal}
                className="rounded-2xl bg-gray-100 px-6 py-3 font-bold text-gray-700"
              >
                إلغاء
              </button>

              <button
                type="submit"
                disabled={savingDiscount}
                className="rounded-2xl bg-[#17B8BE] px-7 py-3 font-bold text-white transition hover:bg-[#0B8F96] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingDiscount ? 'جاري الحفظ...' : 'حفظ الكوبون'}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </div>
  );
}
