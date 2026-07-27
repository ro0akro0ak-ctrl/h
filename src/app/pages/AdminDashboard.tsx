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
  percentage: number;
}

export interface StoreSettingsData {
  shippingFee: string;
}

type AdminTab = 'dashboard' | 'products' | 'orders' | 'discounts' | 'shipping';

const BRAND = {
  dark: '#082E33',
  darkSoft: '#0B3A40',
  teal: '#17B8BE',
  tealDark: '#0B8F96',
  page: '#F2FBFB',
  border: '#CDEBEC',
  muted: '#6D8588',
};

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
  const [formCategory, setFormCategory] = useState('');
  const [formRetailPrice, setFormRetailPrice] = useState('');
  const [formWholesalePrice, setFormWholesalePrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [savingProduct, setSavingProduct] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);
  const [discCode, setDiscCode] = useState('');
  const [discPercentage, setDiscPercentage] = useState('');

  const [storeSettings, setStoreSettings] = useState<StoreSettingsData>({
    shippingFee: '25',
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    void fetchSupabaseData();
  }, []);

  const fetchSupabaseData = async () => {
    try {
      setLoading(true);
      setGlobalError(null);

      const [prodRes, ordRes, discRes, setRes] = await Promise.all([
        supabase.from('products').select('*').order('id', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('discounts').select('*').order('id', { ascending: false }),
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
        category: formCategory,
        categoryAr: formCategory,
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

  const handleAddDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('discounts').insert([
        { code: discCode.trim().toUpperCase(), percentage: Number(discPercentage) },
      ]);
      if (error) throw new Error(error.message);
      setShowAddDiscountModal(false);
      setDiscCode('');
      setDiscPercentage('');
      await fetchSupabaseData();
    } catch (err) {
      alert(`خطأ: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
    }
  };

  const handleDeleteDiscount = async (id: number) => {
    try {
      const { error } = await supabase.from('discounts').delete().eq('id', id);
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

  const totalSalesValue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const lowStockCount = products.filter((product) => product.stock <= 5).length;

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
                  { icon: DollarSign, label: 'إجمالي المبيعات', value: `$${totalSalesValue.toLocaleString()}` },
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
                          <td className="px-6 py-4 text-xs text-[#6D8588]">{product.category}</td>
                          <td className="px-6 py-4 font-bold text-sm text-[#082E33]">${product.retailPrice}</td>
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
                        <p className="text-xs text-[#0B8F96] font-bold mt-1">الإجمالي: ${order.total}</p>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {discounts.map((discount) => (
                  <div key={discount.id} className="p-6 rounded-3xl bg-white/90 border border-[#CDEBEC] shadow-lg flex justify-between items-center">
                    <div>
                      <h3 className="font-black text-lg text-[#082E33]">{discount.code}</h3>
                      <p className="text-sm text-[#0B8F96] font-bold">خصم {discount.percentage}%</p>
                    </div>
                    <button type="button" onClick={() => void handleDeleteDiscount(discount.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {!loading && activeTab === 'shipping' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h1 className="text-3xl font-black text-[#082E33]">إعدادات الشحن والتوصيل</h1>
              <div className="p-8 rounded-3xl bg-white/90 border border-[#CDEBEC] shadow-xl space-y-4 max-w-xl">
                <label className="block text-sm font-bold text-[#082E33]">تكلفة الشحن الثابتة ($)</label>
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
              {[{
                value: formNameAr, set: setFormNameAr, placeholder: 'اسم المنتج (عربي)', required: true,
              }, {
                value: formNameEn, set: setFormNameEn, placeholder: 'اسم المنتج (إنجليزي)', required: false,
              }, {
                value: formCategory, set: setFormCategory, placeholder: 'الفئة', required: true,
              }].map((field) => (
                <input
                  key={field.placeholder}
                  type="text"
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  required={field.required}
                  className="w-full px-4 py-3 rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/30"
                />
              ))}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input type="number" step="0.01" placeholder="سعر القطاعي" value={formRetailPrice} onChange={(e) => setFormRetailPrice(e.target.value)} required className="w-full px-4 py-3 rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] outline-none" />
                <input type="number" step="0.01" placeholder="سعر الجملة" value={formWholesalePrice} onChange={(e) => setFormWholesalePrice(e.target.value)} required className="w-full px-4 py-3 rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] outline-none" />
                <input type="number" placeholder="المخزون" value={formStock} onChange={(e) => setFormStock(e.target.value)} required className="w-full px-4 py-3 rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] outline-none" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#082E33] mb-2">رفع صور المنتج</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-dashed border-[#17B8BE] bg-[#F2FBFB]"
                />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#082E33]/70 backdrop-blur-sm">
          <form onSubmit={handleAddDiscount} className="w-full max-w-md p-6 rounded-3xl bg-white shadow-2xl space-y-4">
            <h3 className="font-black text-xl text-[#082E33]">إضافة كوبون خصم</h3>
            <input type="text" placeholder="كود الخصم" value={discCode} onChange={(e) => setDiscCode(e.target.value)} required className="w-full px-4 py-3 rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] outline-none" />
            <input type="number" min="1" max="100" placeholder="نسبة الخصم %" value={discPercentage} onChange={(e) => setDiscPercentage(e.target.value)} required className="w-full px-4 py-3 rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] outline-none" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddDiscountModal(false)} className="px-4 py-2 bg-gray-100 rounded-xl font-bold">إلغاء</button>
              <button type="submit" className="px-4 py-2 bg-[#17B8BE] text-white rounded-xl font-bold">إضافة</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
