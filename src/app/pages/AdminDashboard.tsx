import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tag, 
  Truck, 
  Settings, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  Menu, 
  X,
  TrendingUp,
  Loader,
  Gavel,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { supabase } from '../../utils/supabase';

// TypeScript Interfaces دقيقة لكل الجداول مع مطابقة أسماء الأعمدة الفعلية
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

export interface Customer {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

export interface Discount {
  id: number;
  code: string;
  percentage: number;
}

export interface Bid {
  id: number;
  auction_id: number;
  user_email: string;
  bid_amount: number;
  created_at: string;
}

export interface Auction {
  id: number;
  title: string;
  start_price: number;
  current_price: number;
  end_time: string;
  status: 'active' | 'ended' | 'completed';
  winner?: string;
  bids?: Bid[];
}

export interface StoreSettingsData {
  storeName: string;
  supportEmail: string;
  shippingFee: string;
  taxRate: string;
}

export default function AdminDashboard() {
  const { language } = useLanguage();
  const { logout } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'discounts' | 'shipping' | 'auctions' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // States للبيانات
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // States لنموذج المنتجات
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formNameAr, setFormNameAr] = useState<string>('');
  const [formNameEn, setFormNameEn] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('');
  const [formRetailPrice, setFormRetailPrice] = useState<string>('');
  const [formWholesalePrice, setFormWholesalePrice] = useState<string>('');
  const [formStock, setFormStock] = useState<string>('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [savingProduct, setSavingProduct] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // الكوبونات
  const [showAddDiscountModal, setShowAddDiscountModal] = useState<boolean>(false);
  const [discCode, setDiscCode] = useState<string>('');
  const [discPercentage, setDiscPercentage] = useState<string>('');

  // المزادات
  const [showAddAuctionModal, setShowAddAuctionModal] = useState<boolean>(false);
  const [auctionTitle, setAuctionTitle] = useState<string>('');
  const [auctionStartPrice, setAuctionStartPrice] = useState<string>('');
  const [auctionEndTime, setAuctionEndTime] = useState<string>('');

  // إعدادات المتجر
  const [storeSettings, setStoreSettings] = useState<StoreSettingsData>({
    storeName: '3D TECH',
    supportEmail: 'support@3dtech.store',
    shippingFee: '25',
    taxRate: '15'
  });
  const [savingSettings, setSavingSettings] = useState<boolean>(false);

  useEffect(() => {
    fetchSupabaseData();
  }, []);

  const fetchSupabaseData = async () => {
    try {
      setLoading(true);
      setGlobalError(null);

      const [prodRes, ordRes, custRes, discRes, aucRes, setRes] = await Promise.all([
        supabase.from('products').select('*').order('id', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('customers').select('*'),
        supabase.from('discounts').select('*'),
        supabase.from('auctions').select('*, bids(*)').order('id', { ascending: false }),
        supabase.from('store_settings').select('*').single()
      ]);

      if (prodRes.error) throw new Error(`خطأ في جلب المنتجات: ${prodRes.error.message}`);
      if (ordRes.error) throw new Error(`خطأ في جلب الطلبات: ${ordRes.error.message}`);
      if (custRes.error) throw new Error(`خطأ في جلب العملاء: ${custRes.error.message}`);
      if (discRes.error) throw new Error(`خطأ في جلب الخصومات: ${discRes.error.message}`);
      if (aucRes.error) throw new Error(`خطأ في جلب المزادات: ${aucRes.error.message}`);

      if (prodRes.data) setProducts(prodRes.data as Product[]);
      if (ordRes.data) setOrders(ordRes.data as Order[]);
      if (custRes.data) setCustomers(custRes.data as Customer[]);
      if (discRes.data) setDiscounts(discRes.data as Discount[]);
      if (aucRes.data) setAuctions(aucRes.data as Auction[]);
      
      if (setRes.data) {
        setStoreSettings({
          storeName: setRes.data.store_name || '3D TECH',
          supportEmail: setRes.data.support_email || 'support@3dtech.store',
          shippingFee: setRes.data.shipping_fee?.toString() || '25',
          taxRate: setRes.data.tax_rate?.toString() || '15'
        });
      }
    } catch (err: any) {
      console.error(err);
      setGlobalError(err.message || 'حدث خطأ غير متوقع أثناء الاتصال بقاعدة البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    setActionError(null);

    try {
      let finalImagesList = [...existingImages];

      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
          const filePath = `products/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

          if (uploadError) throw new Error(`فشل رفع الصورة: ${uploadError.message}`);

          const { data: publicURLData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          finalImagesList.push(publicURLData.publicUrl);
        }
      }

      const primaryImage = finalImagesList.length > 0 ? finalImagesList[0] : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';

      const productPayload = {
        name: formNameEn || formNameAr,
        nameAr: formNameAr,
        category: formCategory,
        categoryAr: formCategory,
        retailPrice: parseFloat(formRetailPrice) || 0,
        wholesalePrice: parseFloat(formWholesalePrice) || 0,
        stock: parseInt(formStock) || 0,
        image: primaryImage,
        additionalImages: finalImagesList
      };

      if (editingProduct) {
        const { error } = await supabase.from('products').update(productPayload).eq('id', editingProduct.id);
        if (error) throw new Error(`فشل التعديل: ${error.message}`);
      } else {
        const { error } = await supabase.from('products').insert([productPayload]);
        if (error) throw new Error(`فشل الإضافة: ${error.message}`);
      }

      closeModal();
      fetchSupabaseData();
    } catch (err: any) {
      setActionError(err.message || 'فشل حفظ المنتج');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw new Error(error.message);
        setProducts(products.filter(p => p.id !== id));
      } catch (err: any) {
        alert('خطأ أثناء الحذف: ' + err.message);
      }
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

  const closeModal = () => {
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
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err: any) {
      alert('فشل تحديث حالة الطلب: ' + err.message);
    }
  };

  const handleAddDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('discounts').insert([{ code: discCode, percentage: parseFloat(discPercentage) }]);
      if (error) throw new Error(error.message);
      setShowAddDiscountModal(false);
      setDiscCode('');
      setDiscPercentage('');
      fetchSupabaseData();
    } catch (err: any) {
      alert('خطأ: ' + err.message);
    }
  };

  const handleDeleteDiscount = async (id: number) => {
    try {
      await supabase.from('discounts').delete().eq('id', id);
      setDiscounts(discounts.filter(d => d.id !== id));
    } catch (err: any) {
      alert('خطأ: ' + err.message);
    }
  };

  const handleAddAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('auctions').insert([{
        title: auctionTitle,
        start_price: parseFloat(auctionStartPrice),
        current_price: parseFloat(auctionStartPrice),
        end_time: auctionEndTime,
        status: 'active'
      }]);
      if (error) throw new Error(error.message);
      setShowAddAuctionModal(false);
      setAuctionTitle('');
      setAuctionStartPrice('');
      setAuctionEndTime('');
      fetchSupabaseData();
    } catch (err: any) {
      alert('خطأ: ' + err.message);
    }
  };

  const handleToggleAuctionStatus = async (auctionId: number, currentStatus: Auction['status']) => {
    const nextStatus = currentStatus === 'active' ? 'ended' : 'active';
    try {
      await supabase.from('auctions').update({ status: nextStatus }).eq('id', auctionId);
      fetchSupabaseData();
    } catch (err: any) {
      alert('خطأ: ' + err.message);
    }
  };

  const handleAutoDetermineWinner = async (auction: Auction) => {
    if (!auction.bids || auction.bids.length === 0) {
      alert('لا توجد أي مزايدات على هذا المنتج حتى الآن.');
      return;
    }

    const highestBid = auction.bids.reduce((max, current) => current.bid_amount > max.bid_amount ? current : max, auction.bids[0]);

    try {
      const { error } = await supabase.from('auctions').update({
        status: 'completed',
        winner: highestBid.user_email
      }).eq('id', auction.id);

      if (error) throw new Error(error.message);
      alert(`تم إعلان الفائز تلقائياً بنجاح: ${highestBid.user_email} بقيمة $${highestBid.bid_amount}`);
      fetchSupabaseData();
    } catch (err: any) {
      alert('خطأ أثناء اختيار الفائز: ' + err.message);
    }
  };

  const handleSaveSettings = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSavingSettings(true);
    try {
      const { error } = await supabase.from('store_settings').upsert({
        id: 1,
        store_name: storeSettings.storeName,
        support_email: storeSettings.supportEmail,
        shipping_fee: parseFloat(storeSettings.shippingFee),
        tax_rate: parseFloat(storeSettings.taxRate)
      });
      if (error) throw new Error(error.message);
      alert('تم حفظ إعدادات المتجر بنجاح في قاعدة البيانات');
    } catch (err: any) {
      alert('خطأ في الحفظ: ' + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const totalSalesValue = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);

  const menuItems = [
    { id: 'dashboard', labelAr: 'الرئيسية', labelEn: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', labelAr: 'المنتجات', labelEn: 'Products', icon: Package },
    { id: 'orders', labelAr: 'الطلبات', labelEn: 'Orders', icon: ShoppingCart },
    { id: 'customers', labelAr: 'العملاء', labelEn: 'Customers', icon: Users },
    { id: 'discounts', labelAr: 'الخصومات', labelEn: 'Discounts', icon: Tag },
    { id: 'shipping', labelAr: 'الشحن', labelEn: 'Shipping', icon: Truck },
    { id: 'auctions', labelAr: 'المزادات', labelEn: 'Auctions', icon: Gavel },
    { id: 'settings', labelAr: 'الإعدادات', labelEn: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F5FCFC] dark:bg-gray-950 flex flex-col md:flex-row" dir="rtl">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-[#D8EFEF] dark:border-gray-800 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <img src="/logo.png?v=2" alt="3D TECH" className="h-8 w-auto object-contain" />
          <span className="font-bold text-[#063F43] dark:text-white">3D TECH Admin</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl bg-[#F5FCFC] dark:bg-gray-800 text-[#063F43] dark:text-white"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 right-0 z-40 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-[#D8EFEF] dark:border-gray-800 flex flex-col transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png?v=2" alt="3D TECH" className="h-10 w-auto object-contain" />
            <div>
              <h2 className="font-black text-lg text-[#063F43] dark:text-white">3D TECH</h2>
              <span className="text-xs text-[#16B8BE] font-semibold">لوحة تحكم احترافية</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 rounded-lg text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#16B8BE] to-[#087F84] text-white shadow-lg shadow-[#16B8BE]/20'
                    : 'text-[#6B7F80] hover:bg-[#F5FCFC] dark:hover:bg-gray-800 hover:text-[#063F43] dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => logout && logout()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {globalError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{globalError}</span>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader className="w-10 h-10 animate-spin text-[#16B8BE]" />
            </div>
          )}

          {!loading && activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black text-[#063F43] dark:text-white mb-1">لوحة التحكم الرئيسية</h1>
                  <p className="text-sm text-[#6B7F80]">إدارة كاملة لمنتجات ومزادات وطلبات متجرك عبر Supabase بأمان تام</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddProductModal(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#16B8BE] to-[#087F84] text-white rounded-2xl font-bold shadow-lg"
                >
                  <Plus className="w-5 h-5" /> إضافة منتج جديد
                </motion.button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { icon: Package, label: 'المنتجات', value: products.length, color: 'from-[#16B8BE] to-[#087F84]' },
                  { icon: DollarSign, label: 'إجمالي المبيعات', value: `$${totalSalesValue.toLocaleString()}`, color: 'from-emerald-500 to-teal-600' },
                  { icon: ShoppingCart, label: 'الطلبات', value: orders.length, color: 'from-purple-500 to-indigo-600' },
                  { icon: Gavel, label: 'المزادات النشطة', value: auctions.filter(a => a.status === 'active').length, color: 'from-amber-500 to-orange-600' }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-[#D8EFEF] dark:border-gray-800 shadow-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} shadow-md`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> متزامن
                        </span>
                      </div>
                      <div className="text-2xl font-black text-[#063F43] dark:text-white mb-1">{stat.value}</div>
                      <div className="text-xs text-[#6B7F80] font-medium">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {!loading && activeTab === 'products' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-[#063F43] dark:text-white mb-1">إدارة المنتجات</h1>
                  <p className="text-sm text-[#6B7F80]">إدارة معرض الصور المتعددة وتعديل بيانات المنتجات</p>
                </div>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#16B8BE] to-[#087F84] text-white rounded-2xl font-bold shadow-lg"
                >
                  <Plus className="w-5 h-5" /> إضافة منتج
                </button>
              </div>

              <div className="rounded-3xl bg-white dark:bg-gray-900 border border-[#D8EFEF] dark:border-gray-800 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F5FCFC] dark:bg-gray-800/50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-right text-xs font-bold text-[#063F43] dark:text-gray-300">الصورة</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-[#063F43] dark:text-gray-300">الاسم</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-[#063F43] dark:text-gray-300">الفئة</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-[#063F43] dark:text-gray-300">القطاعي</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-[#063F43] dark:text-gray-300">المخزون</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-[#063F43] dark:text-gray-300">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-[#F5FCFC]/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <img src={product.image} alt="" className="w-12 h-12 rounded-xl object-cover border" />
                              {product.additionalImages && product.additionalImages.length > 1 && (
                                <span className="text-[10px] font-bold bg-[#16B8BE]/10 text-[#16B8BE] px-1.5 py-0.5 rounded-md">
                                  +{product.additionalImages.length - 1}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-[#063F43] dark:text-white text-sm">
                            {product.nameAr || product.name}
                          </td>
                          <td className="px-6 py-4 text-xs text-[#6B7F80]">{product.category}</td>
                          <td className="px-6 py-4 font-bold text-sm">${product.retailPrice}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-[#16B8BE]">
                              {product.stock || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => openEditModal(product)} className="p-2 rounded-xl bg-blue-50 text-blue-600">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteProduct(product.id)} className="p-2 rounded-xl bg-red-50 text-red-600">
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
              <h1 className="text-3xl font-black text-[#063F43] dark:text-white">إدارة الطلبات الحقيقية</h1>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-center py-12 text-[#6B7F80]">لا توجد طلبات مسجلة.</p>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-[#D8EFEF] dark:border-gray-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-[#063F43] dark:text-white">طلب #{order.id}</h3>
                        <p className="text-sm text-[#6B7F80]">العميل: {order.customer_name || 'عميل مسجل'}</p>
                        <p className="text-xs text-emerald-600 font-bold mt-1">الإجمالي: ${order.total}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <select 
                          value={order.status || 'pending'} 
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="px-4 py-2 rounded-2xl border bg-[#F5FCFC] dark:bg-gray-800 font-bold text-sm"
                        >
                          <option value="pending">قيد المعالجة (Pending)</option>
                          <option value="processing">جار التجهيز (Processing)</option>
                          <option value="shipped">تم الشحن (Shipped)</option>
                          <option value="completed">مكتمل (Completed)</option>
                          <option value="cancelled">ملغي (Cancelled)</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {!loading && activeTab === 'customers' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h1 className="text-3xl font-black text-[#063F43] dark:text-white">قائمة العملاء</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customers.map((cust) => (
                  <div key={cust.id} className="p-6 rounded-3xl bg-white dark:bg-gray-900 border shadow-xl">
                    <h3 className="font-bold text-[#063F43] dark:text-white">{cust.name}</h3>
                    <p className="text-sm text-[#6B7F80]">{cust.email}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {!loading && activeTab === 'discounts' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-[#063F43] dark:text-white">أكواد الخصم</h1>
                <button 
                  onClick={() => setShowAddDiscountModal(true)}
                  className="px-5 py-2.5 bg-[#16B8BE] text-white rounded-2xl font-bold"
                >
                  إضافة كود خصم
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {discounts.map((d) => (
                  <div key={d.id} className="p-6 rounded-3xl bg-white dark:bg-gray-900 border shadow-xl flex justify-between items-center">
                    <div>
                      <h3 className="font-black text-lg text-[#063F43] dark:text-white">{d.code}</h3>
                      <p className="text-sm text-emerald-600 font-bold">خصم بنسبة {d.percentage}%</p>
                    </div>
                    <button onClick={() => handleDeleteDiscount(d.id)} className="p-2 bg-red-50 text-red-600 rounded-xl">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {!loading && activeTab === 'shipping' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h1 className="text-3xl font-black text-[#063F43] dark:text-white">إعدادات الشحن والتوصيل</h1>
              <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border shadow-xl space-y-4">
                <label className="block text-sm font-semibold text-[#063F43]">تكلفة الشحن الثابتة ($)</label>
                <input 
                  type="number" 
                  value={storeSettings.shippingFee} 
                  onChange={(e) => setStoreSettings({...storeSettings, shippingFee: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl border bg-[#F5FCFC]" 
                />
                <button 
                  type="button"
                  onClick={() => handleSaveSettings()}
                  className="px-6 py-3 bg-[#16B8BE] text-white font-bold rounded-2xl"
                >
                  حفظ تكلفة الشحن
                </button>
              </div>
            </motion.div>
          )}

          {!loading && activeTab === 'auctions' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-[#063F43] dark:text-white">لوحة المزادات المباشرة</h1>
                <button 
                  onClick={() => setShowAddAuctionModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#16B8BE] to-[#087F84] text-white rounded-2xl font-bold"
                >
                  إنشاء مزاد جديد
                </button>
              </div>

              <div className="space-y-4">
                {auctions.map((auc) => {
                  const highestBid = auc.bids && auc.bids.length > 0 
                    ? auc.bids.reduce((max, current) => current.bid_amount > max.bid_amount ? current : max, auc.bids[0])
                    : null;

                  return (
                    <div key={auc.id} className="p-6 rounded-3xl bg-white dark:bg-gray-900 border shadow-xl flex flex-col gap-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h3 className="font-bold text-lg text-[#063F43] dark:text-white">{auc.title}</h3>
                          <p className="text-sm text-[#6B7F80]">السعر الابتدائي: ${auc.start_price} | أعلى مزايدة حالياً: <span className="text-emerald-600 font-bold">${highestBid ? highestBid.bid_amount : auc.start_price}</span></p>
                          <p className="text-xs text-blue-600 font-semibold mt-1">عدد المشاركين: {auc.bids ? auc.bids.length : 0} مزايدين</p>
                          {auc.winner && <p className="text-xs font-bold text-purple-600 mt-1">الفائز المُعلن: {auc.winner}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleToggleAuctionStatus(auc.id, auc.status)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold ${auc.status === 'active' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}
                          >
                            {auc.status === 'active' ? 'إيقاف المزاد' : 'تشغيل المزاد'}
                          </button>
                          <button 
                            onClick={() => handleAutoDetermineWinner(auc)}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-50 text-purple-600"
                          >
                            اختيار الفائز تلقائياً
                          </button>
                        </div>
                      </div>

                      {auc.bids && auc.bids.length > 0 && (
                        <div className="mt-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                          <p className="text-xs font-bold text-gray-500 mb-2">سجل المزايدات:</p>
                          <div className="flex flex-wrap gap-2">
                            {auc.bids.map((b) => (
                              <div key={b.id} className="px-3 py-1.5 rounded-xl bg-[#F5FCFC] dark:bg-gray-800 border text-xs flex items-center gap-2">
                                <span className="font-bold text-[#063F43] dark:text-white">{b.user_email}</span>
                                <span className="text-emerald-600 font-black">${b.bid_amount}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {!loading && activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h1 className="text-3xl font-black text-[#063F43] dark:text-white">إعدادات المتجر العامة</h1>
              <form onSubmit={handleSaveSettings} className="p-8 rounded-3xl bg-white dark:bg-gray-900 border shadow-xl space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">اسم المتجر</label>
                  <input 
                    type="text" 
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({...storeSettings, storeName: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border bg-[#F5FCFC]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">إيميل الدعم</label>
                  <input 
                    type="email" 
                    value={storeSettings.supportEmail}
                    onChange={(e) => setStoreSettings({...storeSettings, supportEmail: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border bg-[#F5FCFC]" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={savingSettings}
                  className="px-6 py-3 bg-[#16B8BE] text-white font-bold rounded-2xl shadow-lg"
                >
                  {savingSettings ? 'جاري الحفظ...' : 'حفظ التغييرات في قاعدة البيانات'}
                </button>
              </form>
            </motion.div>
          )}

        </div>
      </main>

      {/* Modal إضافة/تعديل منتج */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl p-8 rounded-3xl bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-[#063F43] dark:text-white">{editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}</h2>
              <button onClick={closeModal}><X className="w-5 h-5" /></button>
            </div>

            {actionError && <div className="mb-4 p-4 rounded-2xl bg-red-50 text-red-700 text-sm">{actionError}</div>}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <input type="text" placeholder="اسم المنتج (عربي)" value={formNameAr} onChange={(e) => setFormNameAr(e.target.value)} required className="w-full px-4 py-3 rounded-2xl border bg-[#F5FCFC]" />
              <input type="text" placeholder="اسم المنتج (إنجليزي)" value={formNameEn} onChange={(e) => setFormNameEn(e.target.value)} className="w-full px-4 py-3 rounded-2xl border bg-[#F5FCFC]" />
              <input type="text" placeholder="الفئة" value={formCategory} onChange={(e) => setFormCategory(e.target.value)} required className="w-full px-4 py-3 rounded-2xl border bg-[#F5FCFC]" />
              
              <div className="grid grid-cols-3 gap-4">
                <input type="number" step="0.01" placeholder="سعر القطاعي" value={formRetailPrice} onChange={(e) => setFormRetailPrice(e.target.value)} required className="w-full px-4 py-3 rounded-2xl border bg-[#F5FCFC]" />
                <input type="number" step="0.01" placeholder="سعر الجملة" value={formWholesalePrice} onChange={(e) => setFormWholesalePrice(e.target.value)} required className="w-full px-4 py-3 rounded-2xl border bg-[#F5FCFC]" />
                <input type="number" placeholder="المخزون" value={formStock} onChange={(e) => setFormStock(e.target.value)} required className="w-full px-4 py-3 rounded-2xl border bg-[#F5FCFC]" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">رفع صور جديدة لمعرض المنتج</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={(e) => e.target.files && setImageFiles(Array.from(e.target.files))} 
                  className="w-full px-4 py-3 rounded-2xl border border-dashed border-[#16B8BE] bg-[#F5FCFC]" 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 rounded-2xl bg-gray-100 font-bold">إلغاء</button>
                <button type="submit" disabled={savingProduct} className="px-6 py-3 rounded-2xl bg-[#16B8BE] text-white font-bold">
                  {savingProduct ? 'جاري الرفع...' : 'حفظ المنتج'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal إضافة كود خصم */}
      {showAddDiscountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <form onSubmit={handleAddDiscount} className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-gray-900 space-y-4">
            <h3 className="font-bold text-xl">إضافة كوبون خصم</h3>
            <input type="text" placeholder="كود الخصم (مثال: SAVE20)" value={discCode} onChange={(e) => setDiscCode(e.target.value)} required className="w-full px-4 py-3 rounded-2xl border" />
            <input type="number" placeholder="نسبة الخصم %" value={discPercentage} onChange={(e) => setDiscPercentage(e.target.value)} required className="w-full px-4 py-3 rounded-2xl border" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddDiscountModal(false)} className="px-4 py-2 bg-gray-100 rounded-xl">إلغاء</button>
              <button type="submit" className="px-4 py-2 bg-[#16B8BE] text-white rounded-xl">إضافة</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal إضافة مزاد */}
      {showAddAuctionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <form onSubmit={handleAddAuction} className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-gray-900 space-y-4">
            <h3 className="font-bold text-xl">إضافة مزاد جديد</h3>
            <input type="text" placeholder="عنوان المزاد" value={auctionTitle} onChange={(e) => setAuctionTitle(e.target.value)} required className="w-full px-4 py-3 rounded-2xl border" />
            <input type="number" step="0.01" placeholder="السعر الابتدائي ($)" value={auctionStartPrice} onChange={(e) => setAuctionStartPrice(e.target.value)} required className="w-full px-4 py-3 rounded-2xl border" />
            <input type="datetime-local" value={auctionEndTime} onChange={(e) => setAuctionEndTime(e.target.value)} required className="w-full px-4 py-3 rounded-2xl border" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddAuctionModal(false)} className="px-4 py-2 bg-gray-100 rounded-xl">إلغاء</button>
              <button type="submit" className="px-4 py-2 bg-[#16B8BE] text-white rounded-xl">إنشاء</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
