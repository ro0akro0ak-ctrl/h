import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  DollarSign,
  Edit,
  Eye,
  Image as ImageIcon,
  LayoutDashboard,
  Loader,
  LogOut,
  Menu,
  Package,
  Plus,
  ShoppingCart,
  Settings,
  Tag,
  Trash2,
  Truck,
  TrendingUp,
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
  customer_email?: string | null;
  phone?: string | null;
  product_name?: string | null;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  payment_status?: string | null;
  receipt_url?: string | null;
  governorate?: string | null;
  city?: string | null;
  address_details?: string | null;
  notes?: string | null;
  shipping_method?: string | null;
  payment_method?: string | null;
  created_at: string;
}

export interface ShippingMethod {
  id: number;
  key: string;
  label: string;
  price: number;
  duration: string;
  is_active: boolean;
  sort_order: number;
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

export interface BankSettingsData {
  bankAccountName: string;
  bankAccountNumber: string;
  bankTransferNumber: string;
  bankPaymentInstructions: string;
}

type AdminTab = 'dashboard' | 'products' | 'orders' | 'discounts' | 'shipping' | 'settings';

const toDateTimeLocalValue = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const getDefaultStartDateTime = () => {
  const now = new Date();
  now.setSeconds(0, 0);
  return toDateTimeLocalValue(now);
};

const getDefaultEndDateTime = () => {
  const afterMonth = new Date();
  afterMonth.setMonth(afterMonth.getMonth() + 1);
  afterMonth.setSeconds(0, 0);
  return toDateTimeLocalValue(afterMonth);
};


export default function AdminDashboard() {
  const { language } = useLanguage();
  const { logout } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
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
  const [discStartDateTime, setDiscStartDateTime] = useState(getDefaultStartDateTime);
  const [discHasEndDate, setDiscHasEndDate] = useState(true);
  const [discEndDateTime, setDiscEndDateTime] = useState(getDefaultEndDateTime);
  const [discIsActive, setDiscIsActive] = useState(true);
  const [savingDiscount, setSavingDiscount] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [showShippingModal, setShowShippingModal] = useState(false);
  const [editingShippingMethod, setEditingShippingMethod] = useState<ShippingMethod | null>(null);
  const [shippingKey, setShippingKey] = useState('');
  const [shippingLabel, setShippingLabel] = useState('');
  const [shippingPrice, setShippingPrice] = useState('');
  const [shippingDuration, setShippingDuration] = useState('');
  const [shippingSortOrder, setShippingSortOrder] = useState('0');
  const [shippingIsActive, setShippingIsActive] = useState(true);
  const [savingShippingMethod, setSavingShippingMethod] = useState(false);

  const [bankSettings, setBankSettings] = useState<BankSettingsData>({
    bankAccountName: '',
    bankAccountNumber: '',
    bankTransferNumber: '',
    bankPaymentInstructions: '',
  });
  const [savingBankSettings, setSavingBankSettings] = useState(false);

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

      const [prodRes, ordRes, discRes, shippingRes, bankRes] = await Promise.all([
        supabase.from('products').select('*').order('id', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('discount_codes').select('*').order('id', { ascending: false }),
        supabase.from('shipping_methods').select('*').order('sort_order', { ascending: true }),
        supabase
          .from('site_settings')
          .select('key, value')
          .in('key', [
            'bank_account_name',
            'bank_account_number',
            'bank_transfer_number',
            'bank_payment_instructions',
          ]),
      ]);

      if (prodRes.error) throw new Error(`خطأ في جلب المنتجات: ${prodRes.error.message}`);
      if (ordRes.error) throw new Error(`خطأ في جلب الطلبات: ${ordRes.error.message}`);
      if (discRes.error) throw new Error(`خطأ في جلب الخصومات: ${discRes.error.message}`);
      if (shippingRes.error) throw new Error(`خطأ في جلب طرق الشحن: ${shippingRes.error.message}`);
      if (bankRes.error) throw new Error(`خطأ في جلب إعدادات البنك: ${bankRes.error.message}`);

      setProducts((prodRes.data ?? []) as Product[]);
      setOrders((ordRes.data ?? []) as Order[]);
      setDiscounts((discRes.data ?? []) as Discount[]);
      setShippingMethods((shippingRes.data ?? []) as ShippingMethod[]);

      const bankMap: Record<string, string> = {};
      (bankRes.data ?? []).forEach((row: { key: string; value: string | null }) => {
        bankMap[row.key] = row.value ?? '';
      });

      setBankSettings({
        bankAccountName: bankMap.bank_account_name || '',
        bankAccountNumber: bankMap.bank_account_number || '',
        bankTransferNumber: bankMap.bank_transfer_number || '',
        bankPaymentInstructions: bankMap.bank_payment_instructions || '',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء الاتصال بقاعدة البيانات';
      console.error(err);
      setGlobalError(message);
    } finally {
      setLoading(false);
    }
  };

  const totalSalesValue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

  // الربح التقديري = (سعر القطاعي - سعر الجملة) × الكمية المباعة.
  // تتم مطابقة اسم المنتج المكتوب داخل الطلب مع المنتجات الموجودة في لوحة الأدمن.
  const normalizeProductName = (value: string) =>
    value
      .toLowerCase()
      .replace(/[×x*]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const estimatedProfit = orders.reduce((ordersProfit, order) => {
    const orderProducts = (order.product_name || '')
      .split(/[,،]/)
      .map((entry) => entry.trim())
      .filter(Boolean);

    const orderProfit = orderProducts.reduce((sum, entry) => {
      const quantityMatch = entry.match(/[×x*]\s*(\d+)/i);
      const quantity = quantityMatch ? Math.max(1, Number(quantityMatch[1])) : 1;
      const cleanEntryName = normalizeProductName(
        entry.replace(/[×x*]\s*\d+/i, '').trim(),
      );

      const matchedProduct = products.find((product) => {
        const names = [product.name, product.nameAr]
          .filter(Boolean)
          .map((name) => normalizeProductName(String(name)));

        return names.some(
          (name) =>
            name === cleanEntryName ||
            name.includes(cleanEntryName) ||
            cleanEntryName.includes(name),
        );
      });

      if (!matchedProduct) return sum;

      const retailPrice = Number(matchedProduct.retailPrice) || 0;
      const wholesalePrice = Number(matchedProduct.wholesalePrice) || 0;
      return sum + Math.max(0, retailPrice - wholesalePrice) * quantity;
    }, 0);

    return ordersProfit + orderProfit;
  }, 0);

  const lowStockCount = products.filter((product) => product.stock <= 5).length;

  const getShippingMethodLabel = (methodKey?: string | null) => {
    if (!methodKey) return '—';

    const savedMethod = shippingMethods.find((method) => method.key === methodKey);
    if (savedMethod?.label) return savedMethod.label;

    if (methodKey === 'office') return 'توصيل للمكتب';
    if (methodKey === 'home') return 'توصيل للمنزل';

    return methodKey;
  };

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
    setDiscStartDateTime(getDefaultStartDateTime());
    setDiscHasEndDate(true);
    setDiscEndDateTime(getDefaultEndDateTime());
    setDiscIsActive(true);
  };

  const resolveStartDate = () => {
    if (!discStartDateTime) return null;

    const startDate = new Date(discStartDateTime);
    return Number.isNaN(startDate.getTime()) ? null : startDate.toISOString();
  };

  const resolveEndDate = () => {
    if (!discHasEndDate) return null;
    if (!discEndDateTime) return null;

    const endDate = new Date(discEndDateTime);
    return Number.isNaN(endDate.getTime()) ? null : endDate.toISOString();
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

    const resolvedStartDate = resolveStartDate();
    const resolvedEndDate = resolveEndDate();

    if (!resolvedStartDate) {
      alert('اختر تاريخ ووقت بداية صحيحين');
      return;
    }

    if (discHasEndDate && !resolvedEndDate) {
      alert('اختر تاريخ ووقت انتهاء صحيحين');
      return;
    }

    if (
      resolvedEndDate &&
      new Date(resolvedEndDate).getTime() <= new Date(resolvedStartDate).getTime()
    ) {
      alert('وقت الانتهاء يجب أن يكون بعد وقت البداية');
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
          starts_at: resolvedStartDate,
          expires_at: resolvedEndDate,
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

  const handleDeleteOrder = async (orderId: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب نهائيًا؟')) return;

    try {
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) throw new Error(error.message);

      setOrders((current) => current.filter((order) => order.id !== orderId));
      setSelectedOrder(null);
    } catch (err) {
      alert(`فشل حذف الطلب: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
    }
  };

  const resetShippingForm = () => {
    setShowShippingModal(false);
    setEditingShippingMethod(null);
    setShippingKey('');
    setShippingLabel('');
    setShippingPrice('');
    setShippingDuration('');
    setShippingSortOrder('0');
    setShippingIsActive(true);
  };

  const openAddShippingModal = () => {
    resetShippingForm();
    setShowShippingModal(true);
  };

  const openEditShippingModal = (method: ShippingMethod) => {
    setEditingShippingMethod(method);
    setShippingKey(method.key || '');
    setShippingLabel(method.label || '');
    setShippingPrice(String(method.price ?? 0));
    setShippingDuration(method.duration || '');
    setShippingSortOrder(String(method.sort_order ?? 0));
    setShippingIsActive(method.is_active !== false);
    setShowShippingModal(true);
  };

  const handleSaveShippingMethod = async (event: React.FormEvent) => {
    event.preventDefault();

    const cleanKey = shippingKey.trim().toLowerCase().replace(/\s+/g, '_');
    const cleanLabel = shippingLabel.trim();
    const numericPrice = Number(shippingPrice);
    const numericSortOrder = Number.parseInt(shippingSortOrder, 10) || 0;

    if (!cleanKey) {
      alert('اكتب رمز طريقة الشحن، مثال: office');
      return;
    }

    if (!cleanLabel) {
      alert('اكتب اسم طريقة الشحن');
      return;
    }

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      alert('اكتب سعر شحن صحيح');
      return;
    }

    setSavingShippingMethod(true);

    try {
      const payload = {
        key: cleanKey,
        label: cleanLabel,
        price: numericPrice,
        duration: shippingDuration.trim(),
        is_active: shippingIsActive,
        sort_order: numericSortOrder,
      };

      const query = editingShippingMethod
        ? supabase.from('shipping_methods').update(payload).eq('id', editingShippingMethod.id)
        : supabase.from('shipping_methods').insert([payload]);

      const { error } = await query;
      if (error) throw new Error(error.message);

      resetShippingForm();
      await fetchSupabaseData();
    } catch (err) {
      alert(`فشل حفظ طريقة الشحن: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
    } finally {
      setSavingShippingMethod(false);
    }
  };

  const handleDeleteShippingMethod = async (method: ShippingMethod) => {
    if (!window.confirm(`هل أنت متأكد من حذف طريقة الشحن "${method.label}"؟`)) return;

    try {
      const { error } = await supabase.from('shipping_methods').delete().eq('id', method.id);
      if (error) throw new Error(error.message);
      setShippingMethods((current) => current.filter((item) => item.id !== method.id));
    } catch (err) {
      alert(`فشل حذف طريقة الشحن: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
    }
  };

  const handleSaveBankSettings = async () => {
    if (!bankSettings.bankAccountName.trim()) {
      alert('اكتب اسم الحساب');
      return;
    }

    if (!bankSettings.bankAccountNumber.trim()) {
      alert('اكتب رقم الحساب');
      return;
    }

    if (!bankSettings.bankTransferNumber.trim()) {
      alert('اكتب رقم التحويل');
      return;
    }

    setSavingBankSettings(true);

    try {
      const rows = [
        { key: 'bank_account_name', value: bankSettings.bankAccountName.trim() },
        { key: 'bank_account_number', value: bankSettings.bankAccountNumber.trim() },
        { key: 'bank_transfer_number', value: bankSettings.bankTransferNumber.trim() },
        { key: 'bank_payment_instructions', value: bankSettings.bankPaymentInstructions.trim() },
      ];

      const { error } = await supabase
        .from('site_settings')
        .upsert(rows, { onConflict: 'key' });

      if (error) throw new Error(error.message);

      alert('تم حفظ معلومات التحويل البنكي بنجاح');
    } catch (err) {
      alert(`خطأ في الحفظ: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
    } finally {
      setSavingBankSettings(false);
    }
  };

  const menuItems = [
    { id: 'dashboard' as const, labelAr: 'الرئيسية', labelEn: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as const, labelAr: 'المنتجات', labelEn: 'Products', icon: Package },
    { id: 'orders' as const, labelAr: 'الطلبات', labelEn: 'Orders', icon: ShoppingCart },
    { id: 'discounts' as const, labelAr: 'الخصومات', labelEn: 'Discounts', icon: Tag },
    { id: 'shipping' as const, labelAr: 'الشحن', labelEn: 'Shipping', icon: Truck },
    { id: 'settings' as const, labelAr: 'إعدادات البنك', labelEn: 'Bank Settings', icon: Settings },
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
                  <p className="text-sm text-[#6D8588]">إدارة منتجات وطلبات وشحن وخصومات متجر 3D TECH</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#17B8BE] hover:bg-[#0B8F96] text-white rounded-2xl font-bold shadow-lg shadow-[#17B8BE]/20 transition-colors"
                >
                  <Plus className="w-5 h-5" /> إضافة منتج جديد
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {[
                  { icon: Package, label: 'المنتجات', value: products.length, hint: 'إجمالي المنتجات' },
                  {
                    icon: DollarSign,
                    label: 'إجمالي المبيعات',
                    value: (
                      <Price
                        amount={totalSalesValue}
                        className="text-2xl font-black text-[#082E33]"
                      />
                    ),
                    hint: 'قيمة الطلبات المسجلة',
                  },
                  {
                    icon: TrendingUp,
                    label: 'الأرباح',
                    value: (
                      <Price
                        amount={estimatedProfit}
                        className="text-2xl font-black text-[#082E33]"
                      />
                    ),
                    hint: 'القطاعي ناقص الجملة',
                  },
                  { icon: ShoppingCart, label: 'الطلبات', value: orders.length, hint: 'إجمالي الطلبات' },
                  { icon: AlertCircle, label: 'مخزون منخفض', value: lowStockCount, hint: '5 قطع أو أقل' },
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
                      <div className="text-sm font-black text-[#082E33]">{stat.label}</div>
                      <div className="mt-1 text-[11px] font-semibold text-[#789093]">{stat.hint}</div>
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
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-black text-[#082E33]">إدارة الطلبات</h1>
                  <p className="mt-1 text-sm font-semibold leading-7 text-[#6D8588]">
                    جميع بيانات الطلب ظاهرة بالكامل بدون تمرير أفقي. اضغط عرض لفتح الإيصال والتفاصيل الكاملة.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void fetchSupabaseData()}
                  className="rounded-2xl bg-[#082E33] px-5 py-2.5 font-black text-white shadow-lg transition hover:bg-[#0B4A50]"
                >
                  تحديث الطلبات
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="rounded-3xl border border-[#CDEBEC] bg-white/90 p-12 text-center font-bold text-[#6D8588]">
                  لا توجد طلبات مسجلة.
                </div>
              ) : (
                <div className="space-y-5">
                  {orders.map((order, index) => (
                    <article
                      key={order.id}
                      className="overflow-hidden rounded-[28px] border border-[#BFE3E5] bg-white shadow-[0_18px_48px_rgba(8,46,51,0.10)]"
                    >
                      <div className="flex flex-col gap-4 border-b border-[#DCEEEF] bg-[#082E33] px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex min-w-12 items-center justify-center rounded-xl bg-[#17B8BE] px-3 py-2 text-sm font-black">
                            #{order.id}
                          </span>
                          <div>
                            <h3 className="text-base font-black">
                              {order.customer_name || 'عميل غير محدد'}
                            </h3>
                            <p className="mt-0.5 text-xs font-semibold text-white/55">
                              {order.created_at
                                ? new Date(order.created_at).toLocaleString('ar-OM', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : 'بدون تاريخ'}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <Price
                            amount={order.total}
                            className="text-xl font-black text-white"
                          />

                          <select
                            value={order.status || 'pending'}
                            onChange={(event) =>
                              void handleUpdateOrderStatus(
                                order.id,
                                event.target.value as Order['status'],
                              )
                            }
                            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-xs font-black text-white outline-none transition focus:border-[#17B8BE] [&>option]:text-[#082E33]"
                          >
                            <option value="pending">قيد المعالجة</option>
                            <option value="processing">جار التجهيز</option>
                            <option value="shipped">تم الشحن</option>
                            <option value="completed">مكتمل</option>
                            <option value="cancelled">ملغي</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-[#082E33] shadow-md transition hover:-translate-y-0.5 hover:bg-[#17B8BE] hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                            عرض التفاصيل
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 xl:grid-cols-4">
                        {[
                          {
                            label: 'الهاتف',
                            value: order.phone || '—',
                            dir: 'ltr',
                          },
                          {
                            label: 'المنتج',
                            value: order.product_name || '—',
                          },
                          {
                            label: 'المحافظة',
                            value: order.governorate || '—',
                          },
                          {
                            label: 'الولاية',
                            value: order.city || '—',
                          },
                          {
                            label: 'طريقة التوصيل',
                            value: getShippingMethodLabel(order.shipping_method),
                          },
                          {
                            label: 'طريقة الدفع',
                            value:
                              order.payment_method === 'cash_on_delivery'
                                ? 'الدفع عند الاستلام'
                                : 'تحويل بنكي',
                          },
                          {
                            label: 'البريد الإلكتروني',
                            value: order.customer_email || '—',
                            dir: 'ltr',
                          },
                          {
                            label: 'رقم الطلب',
                            value: `#${order.id}`,
                          },
                        ].map((detail, detailIndex) => (
                          <div
                            key={`${order.id}-${detail.label}`}
                            className={`min-w-0 border-[#DCEEEF] p-5 ${
                              detailIndex % 2 === 0 ? 'sm:border-l' : ''
                            } ${detailIndex < 4 ? 'xl:border-b' : ''}`}
                          >
                            <div className="mb-2 text-[11px] font-black tracking-wide text-[#7B9295]">
                              {detail.label}
                            </div>
                            <div
                              dir={detail.dir || 'rtl'}
                              className="break-words text-sm font-black leading-7 text-[#163F43]"
                            >
                              {detail.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              )}
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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-black text-[#082E33]">طرق الشحن</h1>
                  <p className="mt-1 text-sm text-[#6D8588]">أضف وعدّل واحذف طرق الشحن التي تظهر للعميل في صفحة إتمام الطلب.</p>
                </div>

                <button
                  type="button"
                  onClick={openAddShippingModal}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#17B8BE] px-6 py-3 font-black text-white shadow-lg shadow-[#17B8BE]/20 transition hover:bg-[#0B8F96]"
                >
                  <Plus className="h-5 w-5" />
                  إضافة طريقة شحن
                </button>
              </div>

              {shippingMethods.length === 0 ? (
                <div className="rounded-3xl border border-[#CDEBEC] bg-white/90 p-12 text-center text-[#6D8588]">
                  لا توجد طرق شحن. اضغط إضافة طريقة شحن لإنشاء أول طريقة.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {shippingMethods.map((method) => (
                    <div key={method.id} className="rounded-3xl border border-[#CDEBEC] bg-white/90 p-6 shadow-xl">
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#082E33] text-[#17B8BE]">
                            <Truck className="h-6 w-6" />
                          </span>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-black text-[#082E33]">{method.label}</h3>
                              <span className="rounded-full bg-[#082E33]/7 px-2 py-1 text-[10px] font-bold text-[#6D8588]">{method.key}</span>
                              <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${method.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                {method.is_active ? 'مفعل' : 'متوقف'}
                              </span>
                            </div>

                            <p className="mt-2 text-sm text-[#6D8588]">
                              المدة: {method.duration || 'غير محددة'}
                            </p>
                          </div>
                        </div>

                        <Price amount={method.price} className="text-xl font-black text-[#0B8F96]" />
                      </div>

                      <div className="flex items-center justify-between border-t border-[#E2F0F1] pt-4">
                        <span className="text-xs font-bold text-[#6D8588]">الترتيب: {method.sort_order ?? 0}</span>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEditShippingModal(method)}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#082E33]/10 px-4 py-2 text-xs font-black text-[#082E33] transition hover:bg-[#082E33]/20"
                          >
                            <Edit className="h-4 w-4" />
                            تعديل
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleDeleteShippingMethod(method)}
                            className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-600 transition hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {!loading && activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-black text-[#082E33] mb-1">إعدادات التحويل البنكي</h1>
                <p className="text-sm text-[#6D8588]">هذه المعلومات تظهر للعميل مباشرة في صفحة إتمام الطلب.</p>
              </div>

              <div className="rounded-3xl border border-[#CDEBEC] bg-white/90 p-6 shadow-xl backdrop-blur sm:p-8">
                <div className="mb-6 flex items-center gap-3 border-b border-[#CDEBEC] pb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#082E33]">
                    <DollarSign className="h-6 w-6 text-[#17B8BE]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#082E33]">معلومات التحويل البنكي</h2>
                    <p className="text-xs text-[#6D8588]">عدّل البيانات ثم اضغط حفظ الإعدادات.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="block text-sm font-bold text-[#082E33]">اسم الحساب</span>
                    <input
                      type="text"
                      value={bankSettings.bankAccountName}
                      onChange={(event) =>
                        setBankSettings((current) => ({
                          ...current,
                          bankAccountName: event.target.value,
                        }))
                      }
                      placeholder="مثال: 3D TECH"
                      className="w-full rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] px-4 py-3 text-[#082E33] outline-none transition focus:border-[#17B8BE] focus:ring-2 focus:ring-[#17B8BE]/20"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="block text-sm font-bold text-[#082E33]">رقم الحساب</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={bankSettings.bankAccountNumber}
                      onChange={(event) =>
                        setBankSettings((current) => ({
                          ...current,
                          bankAccountNumber: event.target.value,
                        }))
                      }
                      placeholder="اكتب رقم الحساب البنكي"
                      dir="ltr"
                      className="w-full rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] px-4 py-3 text-left text-[#082E33] outline-none transition focus:border-[#17B8BE] focus:ring-2 focus:ring-[#17B8BE]/20"
                    />
                  </label>

                  <label className="space-y-2 md:col-span-2">
                    <span className="block text-sm font-bold text-[#082E33]">رقم التحويل</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={bankSettings.bankTransferNumber}
                      onChange={(event) =>
                        setBankSettings((current) => ({
                          ...current,
                          bankTransferNumber: event.target.value,
                        }))
                      }
                      placeholder="مثال: رقم الهاتف المرتبط بالحساب"
                      dir="ltr"
                      className="w-full rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] px-4 py-3 text-left text-[#082E33] outline-none transition focus:border-[#17B8BE] focus:ring-2 focus:ring-[#17B8BE]/20"
                    />
                  </label>

                  <label className="space-y-2 md:col-span-2">
                    <span className="block text-sm font-bold text-[#082E33]">تعليمات الدفع</span>
                    <textarea
                      value={bankSettings.bankPaymentInstructions}
                      onChange={(event) =>
                        setBankSettings((current) => ({
                          ...current,
                          bankPaymentInstructions: event.target.value,
                        }))
                      }
                      rows={5}
                      placeholder="مثال: يرجى التحويل على الحساب أعلاه ورفع صورة الإيصال لإتمام الطلب."
                      className="w-full resize-y rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] px-4 py-3 leading-7 text-[#082E33] outline-none transition focus:border-[#17B8BE] focus:ring-2 focus:ring-[#17B8BE]/20"
                    />
                  </label>
                </div>

                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-6 text-[#6D8588]">بعد الحفظ ستظهر التغييرات للعميل عند فتح صفحة الدفع أو تحديثها.</p>
                  <button
                    type="button"
                    onClick={() => void handleSaveBankSettings()}
                    disabled={savingBankSettings}
                    className="rounded-2xl bg-[#17B8BE] px-7 py-3 font-bold text-white shadow-lg shadow-[#17B8BE]/20 transition hover:bg-[#0B8F96] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {savingBankSettings ? 'جاري حفظ الإعدادات...' : 'حفظ إعدادات البنك'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {selectedOrder && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#082E33]/75 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[30px] bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between border-b border-[#E2F0F1] pb-5">
              <h2 className="text-2xl font-black text-[#082E33]">تفاصيل الطلب #{selectedOrder.id}</h2>
              <button type="button" onClick={() => setSelectedOrder(null)} className="rounded-xl p-2 text-[#082E33] hover:bg-[#F2FBFB]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-4 text-sm md:grid-cols-2">
              {[
                ['الاسم', selectedOrder.customer_name || '—'],
                ['الهاتف', selectedOrder.phone || '—'],
                ['البريد الإلكتروني', selectedOrder.customer_email || '—'],
                ['المنتج', selectedOrder.product_name || '—'],
                ['المحافظة', selectedOrder.governorate || '—'],
                ['الولاية / المدينة', selectedOrder.city || '—'],
                ['طريقة التوصيل', selectedOrder.shipping_method || '—'],
                ['طريقة الدفع', selectedOrder.payment_method === 'cash_on_delivery' ? 'الدفع عند الاستلام' : 'تحويل بنكي'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 border-b border-[#EDF5F5] pb-3">
                  <span className="font-black text-[#082E33]">{label}:</span>
                  <span className="text-left text-[#4E686B]">{value}</span>
                </div>
              ))}

              <div className="flex items-center justify-between gap-4 border-b border-[#EDF5F5] pb-3">
                <span className="font-black text-[#082E33]">الإجمالي:</span>
                <Price amount={selectedOrder.total} className="text-lg font-black text-[#0B8F96]" />
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-[#EDF5F5] pb-3">
                <span className="font-black text-[#082E33]">التاريخ:</span>
                <span className="text-[#4E686B]">
                  {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString('ar-OM') : '—'}
                </span>
              </div>
            </div>

            {(selectedOrder.address_details || selectedOrder.notes) && (
              <div className="mt-6 space-y-4 rounded-2xl bg-[#F2FBFB] p-5">
                {selectedOrder.address_details && (
                  <div>
                    <h3 className="mb-2 font-black text-[#082E33]">تفاصيل العنوان</h3>
                    <p className="leading-7 text-[#526D70]">{selectedOrder.address_details}</p>
                  </div>
                )}

                {selectedOrder.notes && (
                  <div>
                    <h3 className="mb-2 font-black text-[#082E33]">ملاحظات العميل</h3>
                    <p className="leading-7 text-[#526D70]">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 border-t border-[#E2F0F1] pt-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-black text-[#082E33]">صورة الإيصال</h3>

                {selectedOrder.receipt_url && (
                  <a
                    href={selectedOrder.receipt_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#082E33] px-4 py-2 text-xs font-black text-white hover:bg-[#17B8BE]"
                  >
                    <ImageIcon className="h-4 w-4" />
                    فتح الصورة
                  </a>
                )}
              </div>

              {selectedOrder.receipt_url ? (
                <div className="flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl border border-[#D7EAEA] bg-[#FAFCFC] p-4">
                  <img src={selectedOrder.receipt_url} alt="صورة إيصال الطلب" className="max-h-[460px] w-auto max-w-full object-contain" />
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#CDEBEC] bg-[#F8FCFC] p-10 text-center text-[#7B9092]">
                  لا توجد صورة إيصال لهذا الطلب.
                </div>
              )}
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => void handleDeleteOrder(selectedOrder.id)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-black text-white transition hover:bg-red-700"
              >
                <Trash2 className="h-5 w-5" />
                حذف الطلب
              </button>

              <select
                value={selectedOrder.status || 'pending'}
                onChange={(event) => {
                  const nextStatus = event.target.value as Order['status'];
                  void handleUpdateOrderStatus(selectedOrder.id, nextStatus);
                  setSelectedOrder((current) => current ? { ...current, status: nextStatus } : current);
                }}
                className="rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] px-4 py-3 font-black text-[#082E33] outline-none"
              >
                <option value="pending">قيد المعالجة</option>
                <option value="processing">جار التجهيز</option>
                <option value="shipped">تم الشحن</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>
          </motion.div>
        </div>
      )}

      {showShippingModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#082E33]/75 p-4 backdrop-blur-sm">
          <motion.form
            onSubmit={handleSaveShippingMethod}
            initial={{ opacity: 0, scale: 0.97, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-xl rounded-[30px] bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#082E33]">
                {editingShippingMethod ? 'تعديل طريقة الشحن' : 'إضافة طريقة شحن'}
              </h2>
              <button type="button" onClick={resetShippingForm} className="rounded-xl p-2 text-[#082E33] hover:bg-[#F2FBFB]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-black text-[#082E33]">رمز الطريقة</span>
                <input
                  type="text"
                  value={shippingKey}
                  onChange={(event) => setShippingKey(event.target.value)}
                  placeholder="مثال: office أو home"
                  required
                  className="w-full rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] px-4 py-3 text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/25"
                />
                <p className="text-xs text-[#7B9092]">استخدم حروفًا إنجليزية بدون مسافات. يتم تحويل المسافات تلقائيًا إلى _</p>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-black text-[#082E33]">اسم طريقة الشحن</span>
                <input
                  type="text"
                  value={shippingLabel}
                  onChange={(event) => setShippingLabel(event.target.value)}
                  placeholder="مثال: توصيل للمكتب"
                  required
                  className="w-full rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] px-4 py-3 text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/25"
                />
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-black text-[#082E33]">السعر</span>
                  <input
                    type="number"
                    min="0"
                    step="0.001"
                    value={shippingPrice}
                    onChange={(event) => setShippingPrice(event.target.value)}
                    placeholder="1.000"
                    required
                    className="w-full rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] px-4 py-3 text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/25"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-black text-[#082E33]">الترتيب</span>
                  <input
                    type="number"
                    min="0"
                    value={shippingSortOrder}
                    onChange={(event) => setShippingSortOrder(event.target.value)}
                    className="w-full rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] px-4 py-3 text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/25"
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-black text-[#082E33]">مدة التوصيل</span>
                <input
                  type="text"
                  value={shippingDuration}
                  onChange={(event) => setShippingDuration(event.target.value)}
                  placeholder="مثال: 2-4 أيام عمل"
                  className="w-full rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] px-4 py-3 text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/25"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] p-4">
                <div>
                  <span className="block font-black text-[#082E33]">تفعيل طريقة الشحن</span>
                  <span className="mt-1 block text-xs text-[#7B9092]">الطرق المتوقفة لا تظهر للعميل.</span>
                </div>

                <input
                  type="checkbox"
                  checked={shippingIsActive}
                  onChange={(event) => setShippingIsActive(event.target.checked)}
                  className="h-5 w-5 accent-[#17B8BE]"
                />
              </label>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button type="button" onClick={resetShippingForm} className="rounded-2xl bg-gray-100 px-6 py-3 font-black text-gray-700">
                إلغاء
              </button>
              <button
                type="submit"
                disabled={savingShippingMethod}
                className="rounded-2xl bg-[#17B8BE] px-6 py-3 font-black text-white transition hover:bg-[#0B8F96] disabled:opacity-50"
              >
                {savingShippingMethod ? 'جاري الحفظ...' : 'حفظ طريقة الشحن'}
              </button>
            </div>
          </motion.form>
        </div>
      )}

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
                <input
                  type="datetime-local"
                  step="60"
                  value={discStartDateTime}
                  onChange={(e) => setDiscStartDateTime(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] px-4 py-3 text-[#082E33] outline-none focus:ring-2 focus:ring-[#17B8BE]/30"
                />
                <p className="text-xs leading-5 text-[#6D8588]">
                  اختر اليوم والساعة والدقيقة التي يبدأ فيها الكوبون بالضبط.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <label className="block text-sm font-black text-[#082E33]">
                    انتهاء الكوبون
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-[#55777A]">
                    <input
                      type="checkbox"
                      checked={!discHasEndDate}
                      onChange={(e) => setDiscHasEndDate(!e.target.checked)}
                      className="h-4 w-4 accent-[#17B8BE]"
                    />
                    بدون انتهاء
                  </label>
                </div>

                <input
                  type="datetime-local"
                  step="60"
                  value={discEndDateTime}
                  min={discStartDateTime || undefined}
                  onChange={(e) => setDiscEndDateTime(e.target.value)}
                  required={discHasEndDate}
                  disabled={!discHasEndDate}
                  className="w-full rounded-2xl border border-[#CDEBEC] bg-[#F2FBFB] px-4 py-3 text-[#082E33] outline-none transition focus:ring-2 focus:ring-[#17B8BE]/30 disabled:cursor-not-allowed disabled:opacity-45"
                />
                <p className="text-xs leading-5 text-[#6D8588]">
                  اختر اليوم والساعة والدقيقة التي يتوقف فيها الكوبون، أو فعّل «بدون انتهاء».
                </p>
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
