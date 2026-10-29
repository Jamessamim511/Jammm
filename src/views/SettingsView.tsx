import React, { useState, useEffect } from 'react';
import {
  Settings,
  Store,
  Camera,
  DollarSign,
  Palette,
  Receipt,
  Users,
  Languages,
  QrCode,
  Cloud,
  Code,
  Save,
  Check,
  RotateCcw,
  Upload,
  Trash2,
  Eye,
  Sparkles,
  ShieldAlert,
  AlertCircle,
  Clock,
  Phone,
  MapPin,
  Sliders,
  Sun,
  Moon,
  Monitor,
  CheckCircle2,
  Info,
  Download,
  Plus,
  X,
  History,
  FileText,
} from 'lucide-react';
import {
  AppThemeConfig,
  BusinessInfo,
  Language,
  PriceHistoryEntry,
  Service,
  ServicePricingType,
  SyncQueueItem,
  ThemePreset,
  User,
} from '../types';
import { db, formatINR, defaultBusinessInfo } from '../db/storage';
import { isValidUpiId } from '../utils/upi';
import { translations } from '../utils/i18n';
import { DEFAULT_SHIZA_LOGO } from '../utils/imageUtils';
import { THEME_PRESETS, applyThemeToDocument } from '../utils/themeUtils';
import { ImageCropModal } from '../components/ImageCropModal';
import { ServiceThumbnail } from '../components/ServiceThumbnail';

interface SettingsViewProps {
  currentUser: User;
  business: BusinessInfo;
  users: User[];
  services: Service[];
  syncQueue: SyncQueueItem[];
  lastSyncTime: string;
  lang: Language;
  onBusinessUpdated: (info: BusinessInfo) => void;
  onUsersUpdated: () => void;
  onServicesUpdated: () => void;
  onThemeUpdated?: (theme: AppThemeConfig) => void;
  onLanguageChanged?: (lang: Language) => void;
  onSwitchUser: (userId: string) => void;
  onTriggerSync: () => Promise<void>;
  onShowStaticQr: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  business,
  users,
  services,
  syncQueue,
  lastSyncTime,
  lang,
  onBusinessUpdated,
  onUsersUpdated,
  onServicesUpdated,
  onThemeUpdated,
  onLanguageChanged,
  onSwitchUser,
  onTriggerSync,
  onShowStaticQr,
}) => {
  const t = translations[lang];

  type TabType =
    | 'profile'
    | 'branding'
    | 'pricing'
    | 'theme'
    | 'invoice'
    | 'staff'
    | 'language'
    | 'upi'
    | 'sync'
    | 'android';

  const [activeTab, setActiveTab] = useState<TabType>('profile');

  // 1. Shop Profile State
  const [bName, setBName] = useState<string>(business.name || 'Shiza Online');
  const [bBnName, setBBnName] = useState<string>(business.bengaliName || 'সিজা অনলাইন');
  const [bOwnerName, setBOwnerName] = useState<string>(business.ownerName || 'মমিনুর ইসলাম (Mominur Islam)');
  const [bType, setBType] = useState<string>(business.type || 'CSC | Digital Service Centre');
  const [bAddress, setBAddress] = useState<string>(business.address || 'বেলকুড়িয়া, জোড়দিঘী, দক্ষিণ দিনাজপুর, ৭৩৩১২১');
  const [bContact, setBContact] = useState<string>(business.contact || '6294363894');
  const [bWhatsapp, setBWhatsapp] = useState<string>(business.whatsapp || '6294363894');
  const [bCscId, setBCscId] = useState<string>(business.cscId || 'CSC-WB-733121');
  const [bTagline, setBTagline] = useState<string>(business.tagline || 'আপনার অনলাইন কাজের সহজ সমাধান।');
  const [bOpeningHours, setBOpeningHours] = useState<string>(business.openingHours || 'সকাল ৮:০০ - রাত ৯:০০ (প্রতিদিন খোলা)');
  const [profileSaved, setProfileSaved] = useState<boolean>(false);

  // 2. Shop Logo Branding State
  const [logoCropOpen, setLogoCropOpen] = useState<boolean>(false);
  const [brandingSaved, setBrandingSaved] = useState<boolean>(false);

  // 3. Pricing Management State
  const [priceHistory, setPriceHistory] = useState<PriceHistoryEntry[]>([]);
  const [priceEditingService, setPriceEditingService] = useState<Service | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newExtraCharges, setNewExtraCharges] = useState<number>(0);
  const [newPricingType, setNewPricingType] = useState<ServicePricingType>('fixed');
  const [newIsFree, setNewIsFree] = useState<boolean>(false);
  const [priceChangeReason, setPriceChangeReason] = useState<string>('');
  const [pricingSavedMsg, setPricingSavedMsg] = useState<string>('');

  useEffect(() => {
    setPriceHistory(db.getPriceHistory());
  }, []);

  // 4. Theme Customization State
  const [themeConfig, setThemeConfig] = useState<AppThemeConfig>(db.getThemeConfig());
  const [themeSaved, setThemeSaved] = useState<boolean>(false);

  // 5. Invoice Branding State
  const [showLogoOnReceipt, setShowLogoOnReceipt] = useState<boolean>(business.showLogoOnReceipt ?? true);
  const [showAddressOnReceipt, setShowAddressOnReceipt] = useState<boolean>(business.showAddressOnReceipt ?? true);
  const [showPhoneOnReceipt, setShowPhoneOnReceipt] = useState<boolean>(business.showPhoneOnReceipt ?? true);
  const [showOwnerOnReceipt, setShowOwnerOnReceipt] = useState<boolean>(business.showOwnerOnReceipt ?? true);
  const [showCscIdOnReceipt, setShowCscIdOnReceipt] = useState<boolean>(business.showCscIdOnReceipt ?? true);
  const [showQrOnReceipt, setShowQrOnReceipt] = useState<boolean>(business.showQrOnReceipt ?? true);
  const [invoiceHeaderText, setInvoiceHeaderText] = useState<string>(business.invoiceHeaderText || 'সিজা অনলাইন — ডিজিটাল সেবা ও ক্যাশ মেমো');
  const [invoiceFooterText, setInvoiceFooterText] = useState<string>(business.invoiceFooterText || 'ধন্যবাদ! আবার আসবেন। যেকোনো ডিজিটাল সহায়তায় আমরা আপনার পাশে।');
  const [invoiceSaved, setInvoiceSaved] = useState<boolean>(false);

  // 6. UPI Config State
  const [upiId, setUpiId] = useState<string>(business.upiId || '6294363894@upi');
  const [merchantName, setMerchantName] = useState<string>(business.upiMerchantName || 'Shiza Online');
  const [upiNote, setUpiNote] = useState<string>(business.upiNote || 'Shiza Online Belkuria');
  const [upiSaved, setUpiSaved] = useState<boolean>(false);
  const [upiError, setUpiError] = useState<string>('');

  // 7. Staff State
  const [staffName, setStaffName] = useState<string>('');
  const [staffUsername, setStaffUsername] = useState<string>('');
  const [staffPin, setStaffPin] = useState<string>('1234');
  const [showAddStaff, setShowAddStaff] = useState<boolean>(false);

  // 8. Sync & Backup State
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [importStatus, setImportStatus] = useState<string>('');

  // 9. Android Code Viewer
  const [androidFile, setAndroidFile] = useState<string>('AppDatabase');

  // Handlers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser.permissions.canManageShopProfile && currentUser.role !== 'owner') return;

    const updated: BusinessInfo = {
      ...business,
      name: bName.trim(),
      bengaliName: bBnName.trim(),
      ownerName: bOwnerName.trim(),
      type: bType.trim(),
      address: bAddress.trim(),
      contact: bContact.trim(),
      whatsapp: bWhatsapp.trim(),
      cscId: bCscId.trim(),
      tagline: bTagline.trim(),
      openingHours: bOpeningHours.trim(),
    };
    db.updateBusinessInfo(updated);
    onBusinessUpdated(updated);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleLogoCropped = (croppedDataUrl: string) => {
    const updated = {
      ...business,
      logoUrl: croppedDataUrl,
    };
    db.updateBusinessInfo(updated);
    onBusinessUpdated(updated);
    setBrandingSaved(true);
    setTimeout(() => setBrandingSaved(false), 2500);
  };

  const handleRestoreDefaultLogo = () => {
    const updated = {
      ...business,
      logoUrl: DEFAULT_SHIZA_LOGO,
    };
    db.updateBusinessInfo(updated);
    onBusinessUpdated(updated);
    setBrandingSaved(true);
    setTimeout(() => setBrandingSaved(false), 2500);
  };

  const handleRemoveLogo = () => {
    const updated = {
      ...business,
      logoUrl: undefined,
    };
    db.updateBusinessInfo(updated);
    onBusinessUpdated(updated);
    setBrandingSaved(true);
    setTimeout(() => setBrandingSaved(false), 2500);
  };

  const handleSaveInvoicePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BusinessInfo = {
      ...business,
      showLogoOnReceipt,
      showAddressOnReceipt,
      showPhoneOnReceipt,
      showOwnerOnReceipt,
      showCscIdOnReceipt,
      showQrOnReceipt,
      invoiceHeaderText: invoiceHeaderText.trim(),
      invoiceFooterText: invoiceFooterText.trim(),
    };
    db.updateBusinessInfo(updated);
    onBusinessUpdated(updated);
    setInvoiceSaved(true);
    setTimeout(() => setInvoiceSaved(false), 2500);
  };

  // Price Manager Handlers
  const handleOpenPriceModal = (service: Service) => {
    setPriceEditingService(service);
    setNewPrice(service.defaultPrice);
    setNewExtraCharges(service.extraCharges || 0);
    setNewPricingType(service.pricingType || 'fixed');
    setNewIsFree(service.isFree || false);
    setPriceChangeReason('');
  };

  const handleConfirmPriceChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!priceEditingService) return;
    if (!currentUser.permissions.canManagePricing && currentUser.role !== 'owner') return;

    const oldPrice = priceEditingService.defaultPrice;
    const oldExtra = priceEditingService.extraCharges || 0;
    const targetPrice = newIsFree ? 0 : Math.max(0, newPrice);
    const targetExtra = Math.max(0, newExtraCharges);

    // Save updated service
    const updatedService: Service = {
      ...priceEditingService,
      defaultPrice: targetPrice,
      extraCharges: targetExtra,
      pricingType: newPricingType,
      isFree: newIsFree,
      lastPriceChangeBy: currentUser.name,
      lastPriceChangeAt: new Date().toISOString(),
    };

    db.saveService(updatedService);

    // Record audit trail entry
    db.recordPriceChange({
      serviceId: priceEditingService.id,
      serviceNameBn: priceEditingService.nameBn,
      oldPrice,
      newPrice: targetPrice,
      oldExtraCharges: oldExtra,
      newExtraCharges: targetExtra,
      changedByUserId: currentUser.id,
      changedByUserName: currentUser.name,
      reason: priceChangeReason.trim() || 'নিয়মিত দর সংশোধন ও আপডেট',
    });

    setPriceHistory(db.getPriceHistory());
    setPriceEditingService(null);
    onServicesUpdated();
    setPricingSavedMsg(`"${updatedService.nameBn}" এর মূল্য সফলভাবে আপডেট করা হয়েছে!`);
    setTimeout(() => setPricingSavedMsg(''), 3000);
  };

  // Theme Handlers
  const handleSelectPreset = (presetKey: ThemePreset) => {
    const preset = THEME_PRESETS[presetKey];
    if (preset) {
      const newConfig = { ...preset.config, preset: presetKey };
      setThemeConfig(newConfig);
      db.saveThemeConfig(newConfig);
      applyThemeToDocument(newConfig);
      onThemeUpdated?.(newConfig);
      setThemeSaved(true);
      setTimeout(() => setThemeSaved(false), 2000);
    }
  };

  const handleUpdateCustomTheme = (partial: Partial<AppThemeConfig>) => {
    const updated: AppThemeConfig = {
      ...themeConfig,
      ...partial,
      preset: 'custom',
    };
    setThemeConfig(updated);
    db.saveThemeConfig(updated);
    applyThemeToDocument(updated);
    onThemeUpdated?.(updated);
    setThemeSaved(true);
    setTimeout(() => setThemeSaved(false), 2000);
  };

  const handleRestoreDefaultTheme = () => {
    const defaultConfig = THEME_PRESETS.professional_blue.config;
    setThemeConfig(defaultConfig);
    db.saveThemeConfig(defaultConfig);
    applyThemeToDocument(defaultConfig);
    onThemeUpdated?.(defaultConfig);
    setThemeSaved(true);
    setTimeout(() => setThemeSaved(false), 2000);
  };

  // UPI Save
  const handleSaveUpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidUpiId(upiId)) {
      setUpiError('অনুগ্রহ করে সঠিক UPI ID দিন (যেমন: 6294363894@upi)');
      return;
    }
    setUpiError('');

    const updated = {
      ...business,
      upiId: upiId.trim(),
      upiMerchantName: merchantName.trim(),
      upiNote: upiNote.trim(),
    };
    db.updateBusinessInfo(updated);
    onBusinessUpdated(updated);
    setUpiSaved(true);
    setTimeout(() => setUpiSaved(false), 2500);
  };

  // Staff Handlers
  const handleAddStaffMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffUsername.trim()) return;

    const newStaff: User = {
      id: 'user-' + Date.now(),
      name: staffName.trim(),
      username: staffUsername.trim().toLowerCase(),
      pin: staffPin.trim() || '1234',
      role: 'staff',
      permissions: {
        canManageServices: false,
        canManageStaff: false,
        canViewFinancialReports: false,
        canCancelInvoices: false,
        canExportData: false,
        canVerifyPayments: false,
        canManageBranding: false,
        canManageShopProfile: false,
        canManagePricing: false,
        canOverridePrice: false,
        canManageThemes: false,
      },
      active: true,
      createdAt: new Date().toISOString(),
    };

    db.saveUser(newStaff);
    setStaffName('');
    setStaffUsername('');
    setShowAddStaff(false);
    onUsersUpdated();
  };

  const handleTogglePermission = (userId: string, key: keyof User['permissions']) => {
    const userToEdit = users.find((u) => u.id === userId);
    if (!userToEdit || userToEdit.role === 'owner') return;

    const updatedUser: User = {
      ...userToEdit,
      permissions: {
        ...userToEdit.permissions,
        [key]: !userToEdit.permissions[key],
      },
    };
    db.saveUser(updatedUser);
    onUsersUpdated();
  };

  // Backup & Restore
  const handleExportBackup = () => {
    const jsonStr = db.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Shiza_Online_Complete_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = db.importData(content);
      if (res.success) {
        setImportStatus('ডাটাবেস ও সেটিংস সফলভাবে রিস্টোর হয়েছে!');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setImportStatus(`রিস্টোর ব্যর্থ: ${res.error}`);
      }
    };
    reader.readAsText(file);
  };

  const handleManualSync = async () => {
    setSyncing(true);
    setSyncMessage('');
    try {
      await onTriggerSync();
      setSyncMessage('ক্লাউড সিঙ্ক সফলভাবে সম্পন্ন হয়েছে!');
    } catch {
      setSyncMessage('সিঙ্ক ত্রুটি ঘটেছে, পুনরায় চেষ্টা করুন।');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-900" />
            <span>{t.appSettings}</span>
          </h1>
          <p className="text-xs text-slate-500 font-bengali">
            দোকানের সম্পূর্ণ প্রোফাইল, লোগো, মূল্য নির্ধারণ, থিম কাস্টমাইজেশন, রসিদ ডিজাইন ও পারমিশন
          </p>
        </div>

        {/* Current User Role Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-xl text-xs">
          <span className="text-amber-800 font-semibold">{t.currentLoggedIn}:</span>
          <span className="font-bold text-slate-900">
            {currentUser.name} ({currentUser.role === 'owner' ? t.ownerRole : t.staffRole})
          </span>
        </div>
      </div>

      {/* Primary Navigation Tabs Strip (10 Dedicated Screens) */}
      <div className="flex gap-1.5 border-b border-slate-200 overflow-x-auto pb-2 text-xs no-scrollbar">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'profile' ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4 text-amber-400" />
          <span>দোকানের প্রোফাইল</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'branding' ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Camera className="w-4 h-4 text-amber-400" />
          <span>লোগো ও ছবি</span>
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'pricing' ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>মূল্য ও রেট চার্ট</span>
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'theme' ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Palette className="w-4 h-4 text-purple-400" />
          <span>থিম ও রূপান্তর</span>
        </button>

        <button
          onClick={() => setActiveTab('invoice')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'invoice' ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-4 h-4 text-amber-400" />
          <span>রশিদ কাস্টমাইজ</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'staff' ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t.staffManagement}</span>
        </button>

        <button
          onClick={() => setActiveTab('language')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'language' ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Languages className="w-4 h-4" />
          <span>ভাষা (Language)</span>
        </button>

        <button
          onClick={() => setActiveTab('upi')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'upi' ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <QrCode className="w-4 h-4 text-amber-400" />
          <span>{t.upiConfig}</span>
        </button>

        <button
          onClick={() => setActiveTab('sync')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'sync' ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Cloud className="w-4 h-4" />
          <span>{t.offlineStatus}</span>
        </button>

        <button
          onClick={() => setActiveTab('android')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'android' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Code className="w-4 h-4 text-emerald-300" />
          <span>{t.androidStudioExport}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. SHOP PROFILE CUSTOMIZATION TAB */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm max-w-3xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-blue-900" />
                <span>দোকানের অফিসিয়াল প্রোফাইল (Shop Profile Customization)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-bengali">
                দোকানের নাম, স্বত্বাধিকারী, ঠিকানা, মোবাইল, সিএসসি আইডি ও সময়সূচি পরিবর্তন করুন
              </p>
            </div>

            {!currentUser.permissions.canManageShopProfile && currentUser.role !== 'owner' && (
              <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> শুধুমাত্র পাঠযোগ্য (Read-only)
              </span>
            )}
          </div>

          {profileSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>দোকানের প্রোফাইল তথ্য সফলভাবে সেভ করা হয়েছে!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  দোকানের নাম (English) *
                </label>
                <input
                  type="text"
                  required
                  value={bName}
                  disabled={!currentUser.permissions.canManageShopProfile && currentUser.role !== 'owner'}
                  onChange={(e) => setBName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  দোকানের নাম (বাংলায়) *
                </label>
                <input
                  type="text"
                  required
                  value={bBnName}
                  disabled={!currentUser.permissions.canManageShopProfile && currentUser.role !== 'owner'}
                  onChange={(e) => setBBnName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  মালিক / স্বত্বাধিকারীর পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মমিনুর ইসলাম"
                  value={bOwnerName}
                  disabled={!currentUser.permissions.canManageShopProfile && currentUser.role !== 'owner'}
                  onChange={(e) => setBOwnerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  প্রতিষ্ঠানের ধরন / ক্যাটাগরি
                </label>
                <input
                  type="text"
                  value={bType}
                  disabled={!currentUser.permissions.canManageShopProfile && currentUser.role !== 'owner'}
                  onChange={(e) => setBType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                সম্পূর্ণ ঠিকানা (Address) *
              </label>
              <textarea
                rows={2}
                required
                value={bAddress}
                disabled={!currentUser.permissions.canManageShopProfile && currentUser.role !== 'owner'}
                onChange={(e) => setBAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  হেল্পলাইন / মোবাইল নম্বর *
                </label>
                <input
                  type="tel"
                  required
                  value={bContact}
                  disabled={!currentUser.permissions.canManageShopProfile && currentUser.role !== 'owner'}
                  onChange={(e) => setBContact(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  হোয়াটসঅ্যাপ নম্বর
                </label>
                <input
                  type="tel"
                  placeholder="যেমন: 6294363894"
                  value={bWhatsapp}
                  disabled={!currentUser.permissions.canManageShopProfile && currentUser.role !== 'owner'}
                  onChange={(e) => setBWhatsapp(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  সিএসসি আইডি (CSC ID - ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: CSC-WB-733121"
                  value={bCscId}
                  disabled={!currentUser.permissions.canManageShopProfile && currentUser.role !== 'owner'}
                  onChange={(e) => setBCscId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  দোকানের ট্যাগলাইন / স্লোগান
                </label>
                <input
                  type="text"
                  value={bTagline}
                  disabled={!currentUser.permissions.canManageShopProfile && currentUser.role !== 'owner'}
                  onChange={(e) => setBTagline(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  কাজের সময়সূচি (Opening Hours)
                </label>
                <input
                  type="text"
                  value={bOpeningHours}
                  disabled={!currentUser.permissions.canManageShopProfile && currentUser.role !== 'owner'}
                  onChange={(e) => setBOpeningHours(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            {(currentUser.permissions.canManageShopProfile || currentUser.role === 'owner') && (
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>প্রোফাইল তথ্য সংরক্ষণ করুন</span>
              </button>
            )}
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SHOP LOGO & BRANDING TAB */}
      {/* ========================================================================= */}
      {activeTab === 'branding' && (
        <div className="space-y-6 max-w-3xl">
          {!currentUser.permissions.canManageBranding && currentUser.role !== 'owner' && (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 text-amber-900 text-xs">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">লোগো পরিবর্তনের অধিকার নেই (Read-only)</strong>
                দোকানের অফিসিয়াল লোগো পরিবর্তনের অধিকার কেবল প্রতিষ্ঠানের মালিকের অথবা অনুমতিপ্রাপ্ত স্টাফের রয়েছে।
              </div>
            </div>
          )}

          {brandingSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>দোকানের ব্র্যান্ডিং লোগো সফলভাবে সংরক্ষিত হয়েছে!</span>
            </div>
          )}

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-900" />
                  <span>দোকানের অফিসিয়াল লোগো (Shop Logo Management)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-bengali">
                  PNG, JPG বা WebP ছবি নির্বাচন ও ক্রপ করুন। এটি হোম স্ক্রিন, বিল রসিদ, চালান ও ক্যাশ মেমোতে অফলাইনে কাজ করবে।
                </p>
              </div>

              <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 self-start sm:self-auto ${
                business.logoUrl && business.logoUrl !== DEFAULT_SHIZA_LOGO
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}>
                <Sparkles className="w-3 h-3 text-amber-500" />
                {business.logoUrl && business.logoUrl !== DEFAULT_SHIZA_LOGO
                  ? 'কাস্টম লোগো সক্রিয়'
                  : 'ডিফল্ট সিজা প্রতীক'}
              </span>
            </div>

            {/* Logo Preview & Action Controls */}
            <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <div className="relative group shrink-0">
                <div className="w-32 h-32 rounded-full bg-white shadow-md border-4 border-white flex items-center justify-center overflow-hidden ring-4 ring-blue-900/10">
                  {business.logoUrl ? (
                    <img
                      src={business.logoUrl}
                      alt="Shop Logo"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-900 text-amber-400 flex items-center justify-center font-black text-3xl">
                      SO
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-3 text-center md:text-left">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">লোগো ছবি নির্বাচন, ক্রপ বা প্রতিস্থাপন করুন</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ছবি আপলোড করার পর নিখুঁত গোল আকারে রিসাইজ করতে পারবেন।
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setLogoCropOpen(true)}
                    disabled={!currentUser.permissions.canManageBranding && currentUser.role !== 'owner'}
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-950 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95"
                  >
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>লোগো আপলোড ও ক্রপ করুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRestoreDefaultLogo}
                    disabled={!currentUser.permissions.canManageBranding && currentUser.role !== 'owner'}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-blue-800" />
                    <span>ডিফল্ট প্রতীক ফিরিয়ে আনুন</span>
                  </button>

                  {business.logoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      disabled={!currentUser.permissions.canManageBranding && currentUser.role !== 'owner'}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 disabled:opacity-50 font-semibold text-xs rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>মুছুন</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Live Placement Previews */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-blue-900" />
                <span>লাইভ প্রিভিউ (বিভিন্ন স্থানে লোগোর রূপ)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* 1. App Top Bar Preview */}
                <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 text-white">
                  <div className="text-[10px] text-slate-400 font-mono mb-2 uppercase tracking-wider">
                    ১. অ্যাপ হেডার (Top Navbar)
                  </div>
                  <div className="flex items-center gap-2.5 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                    {business.logoUrl ? (
                      <img
                        src={business.logoUrl}
                        alt="Logo"
                        className="w-7 h-7 rounded-lg object-contain bg-white p-0.5 shadow border border-amber-400/40"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                        SO
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-black text-white">{business.bengaliName}</div>
                      <div className="text-[9px] text-slate-400">{business.type}</div>
                    </div>
                  </div>
                </div>

                {/* 2. Printed Receipt / Cash Memo Preview */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-slate-900">
                  <div className="text-[10px] text-slate-500 font-mono mb-2 uppercase tracking-wider">
                    ২. ক্যাশ মেমো / রশিদ প্রিন্ট (Receipt)
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-dashed border-slate-300 text-center shadow-xs">
                    {business.logoUrl ? (
                      <img
                        src={business.logoUrl}
                        alt="Logo"
                        className="w-9 h-9 mx-auto mb-1 object-contain"
                      />
                    ) : (
                      <div className="w-9 h-9 mx-auto mb-1 bg-amber-400 text-slate-950 font-black rounded-full flex items-center justify-center text-xs">
                        SO
                      </div>
                    )}
                    <div className="font-black text-xs text-slate-900 leading-tight">SHIZA ONLINE</div>
                    <div className="font-bold text-[11px] text-blue-900">{business.bengaliName}</div>
                    <div className="text-[9px] text-slate-500 leading-tight mt-0.5">{business.address}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SERVICE PRICE MANAGER & AUDIT HISTORY TAB */}
      {/* ========================================================================= */}
      {activeTab === 'pricing' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span>সার্ভিস রেট ও মূল্য তালিকা ম্যানেজার (Service Price Manager)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-bengali">
                  পরিষেবার ডিফল্ট মূল্য, অতিরিক্ত ফি ও বিনামূল্যে সেবা নির্ধারণ করুন। পূর্বের কোনো বিলের মূল্য পরিবর্তিত হবে না।
                </p>
              </div>

              {!currentUser.permissions.canManagePricing && currentUser.role !== 'owner' && (
                <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1 self-start sm:self-auto">
                  <ShieldAlert className="w-3.5 h-3.5" /> মূল্য পরিবর্তনের অনুমতি নেই
                </span>
              )}
            </div>

            {pricingSavedMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{pricingSavedMsg}</span>
              </div>
            )}

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">মোট পরিষেবা</span>
                <span className="text-lg font-black text-slate-900 font-mono">{services.length}</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-blue-700 block">নির্দিষ্ট দর (Fixed)</span>
                <span className="text-lg font-black text-blue-900 font-mono">
                  {services.filter((s) => s.pricingType === 'fixed').length}
                </span>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <span className="text-purple-700 block">ইউনিট ভিত্তিক (Unit)</span>
                <span className="text-lg font-black text-purple-900 font-mono">
                  {services.filter((s) => s.pricingType === 'unit_based').length}
                </span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-emerald-700 block">বিনামূল্যে সেবা (Free)</span>
                <span className="text-lg font-black text-emerald-900 font-mono">
                  {services.filter((s) => s.isFree).length}
                </span>
              </div>
            </div>

            {/* Interactive Services Pricing Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-2.5 px-3">পরিষেবার নাম ও ছবি</th>
                    <th className="py-2.5 px-3">মূল্য নির্ধারণ ধরন</th>
                    <th className="py-2.5 px-3 text-right">ডিফল্ট মূল্য (₹)</th>
                    <th className="py-2.5 px-3 text-right">অতিরিক্ত চার্জ</th>
                    <th className="py-2.5 px-3 text-center">ফ্রি সার্ভিস?</th>
                    <th className="py-2.5 px-3 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {services.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <ServiceThumbnail service={s} size="sm" />
                          <div>
                            <div className="font-bold text-slate-900">{s.nameBn}</div>
                            <div className="text-[10px] text-slate-500">{s.nameEn} · ({s.unitBn})</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-700">
                          {s.pricingType === 'fixed'
                            ? 'ফিক্সড রেট'
                            : s.pricingType === 'unit_based'
                            ? 'ইউনিট ভিত্তিক'
                            : 'পরিবর্তনযোগ্য'}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        {s.isFree ? (
                          <span className="text-emerald-700 font-bold">বিনামূল্যে</span>
                        ) : (
                          formatINR(s.defaultPrice)
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                        {s.extraCharges ? `+₹${s.extraCharges}` : '—'}
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        {s.isFree ? (
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                            হ্যাঁ (Free)
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500">না</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          disabled={!currentUser.permissions.canManagePricing && currentUser.role !== 'owner'}
                          onClick={() => handleOpenPriceModal(s)}
                          className="px-2.5 py-1 bg-blue-900 hover:bg-blue-950 disabled:opacity-50 text-white font-bold rounded-lg text-[11px] shadow-xs"
                        >
                          দর সংশোধন
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Price Change Audit History */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-blue-900" />
              <span>মূল্য পরিবর্তনের অডিট ট্রেইল (Price Revision History)</span>
            </h3>

            {priceHistory.length === 0 ? (
              <p className="text-xs text-slate-500">এখনো কোনো মূল্য পরিবর্তন রেকর্ড করা হয়নি।</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
                {priceHistory.map((h) => (
                  <div key={h.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900">{h.serviceNameBn}</span>
                      <div className="text-[11px] text-slate-500">
                        পরিবর্তন করেছেন: <strong>{h.changedByUserName}</strong> ·{' '}
                        {new Date(h.changedAt).toLocaleString('bn-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      {h.reason && <div className="text-[10px] text-amber-800 mt-0.5">কারণ: {h.reason}</div>}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="line-through text-slate-400 font-mono text-[11px] mr-1.5">
                        ₹{h.oldPrice}
                      </span>
                      <span className="font-mono font-black text-blue-900 text-sm">
                        ₹{h.newPrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Price Edit Modal Confirmation */}
      {priceEditingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto p-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>পরিষেবার মূল্য ও রেট সংশোধন</span>
              </h3>
              <button
                onClick={() => setPriceEditingService(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmPriceChange} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900">{priceEditingService.nameBn}</div>
                <div className="text-[11px] text-slate-500">{priceEditingService.nameEn} · একক: {priceEditingService.unitBn}</div>
                <div className="text-[11px] text-blue-900 font-mono mt-1">
                  বর্তমান মূল্য: ₹{priceEditingService.defaultPrice} {priceEditingService.extraCharges ? `(+চার্জ ₹${priceEditingService.extraCharges})` : ''}
                </div>
              </div>

              {/* Free service toggle */}
              <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-xl border border-emerald-200">
                <input
                  type="checkbox"
                  id="modalIsFree"
                  checked={newIsFree}
                  onChange={(e) => setNewIsFree(e.target.checked)}
                  className="rounded text-emerald-600 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="modalIsFree" className="text-emerald-950 font-bold cursor-pointer">
                  এটি একটি সম্পূর্ণ বিনামূল্যের পরিষেবা (Free Service)
                </label>
              </div>

              {!newIsFree && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      নতুন ডিফল্ট মূল্য (₹) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      অতিরিক্ত চার্জ (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={newExtraCharges}
                      onChange={(e) => setNewExtraCharges(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  মূল্য নির্ধারণের ধরন
                </label>
                <select
                  value={newPricingType}
                  onChange={(e) => setNewPricingType(e.target.value as ServicePricingType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold"
                >
                  <option value="fixed">নির্দিষ্ট রেট (Fixed Price)</option>
                  <option value="unit_based">ইউনিট বা পাতা ভিত্তিক (Unit-based)</option>
                  <option value="variable">ম্যানুয়াল এন্ট্রি / পরিবর্তনযোগ্য (Variable)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  দর পরিবর্তনের কারণ / অডিট নোট *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: পোর্টাল ফি বৃদ্ধি / বাজার দর পরিবর্তন..."
                  value={priceChangeReason}
                  onChange={(e) => setPriceChangeReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                <strong>মনে রাখবেন:</strong> এই পরিবর্তন শুধুমাত্র নতুন বিল তৈরিতে কার্যকর হবে। পূর্বে ইস্যু করা রসিদের দাম অপরিবর্তিত থাকবে।
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setPriceEditingService(null)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>দর পরিবর্তন নিশ্চিত করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. THEME CUSTOMIZATION TAB WITH LIVE PREVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'theme' && (
        <div className="space-y-6 max-w-3xl">
          {!currentUser.permissions.canManageThemes && currentUser.role !== 'owner' && (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 text-amber-900 text-xs">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">থিম পরিবর্তনের অনুমতি নেই (Read-only)</strong>
                অ্যাপের গ্লোবাল থিম কেবল প্রতিষ্ঠানের মালিক পরিবর্তন করতে পারেন।
              </div>
            </div>
          )}

          {themeSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>থিম কনফিগারেশন সম্পূর্ণ অ্যাপ্লিকেশনে প্রয়োগ করা হয়েছে!</span>
            </div>
          )}

          {/* Theme Presets */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  <span>রেডিমেড থিম প্রিসেট (Theme Presets)</span>
                </h2>
                <p className="text-xs text-slate-500 font-bengali">
                  পছন্দমতো একটি প্রস্তুত থিম নির্বাচন করুন অথবা নিজস্ব রঙ কাস্টমাইজ করুন
                </p>
              </div>

              <button
                type="button"
                onClick={handleRestoreDefaultTheme}
                disabled={!currentUser.permissions.canManageThemes && currentUser.role !== 'owner'}
                className="text-xs text-blue-900 hover:text-blue-950 font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ডিফল্ট থিম</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.keys(THEME_PRESETS) as ThemePreset[]).map((key) => {
                const p = THEME_PRESETS[key];
                const isSelected = themeConfig.preset === key;
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!currentUser.permissions.canManageThemes && currentUser.role !== 'owner'}
                    onClick={() => handleSelectPreset(key)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-900 ring-2 ring-blue-900/20 bg-blue-50/30 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 inline-block"
                        style={{ backgroundColor: p.config.primaryColor }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 inline-block"
                        style={{ backgroundColor: p.config.accentColor }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 inline-block"
                        style={{ backgroundColor: p.config.appBgColor }}
                      />
                    </div>
                    <div className="font-bold text-xs text-slate-900">{p.nameBn}</div>
                    <div className="text-[10px] text-slate-500 truncate">{p.nameEn}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color & Shape Controls */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-900" />
              <span>রঙ প্যালেট ও ইউআই কম্পোনেন্ট কাস্টমাইজেশন</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">প্রাইমারি রঙ (Primary)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={themeConfig.primaryColor}
                    disabled={!currentUser.permissions.canManageThemes && currentUser.role !== 'owner'}
                    onChange={(e) => handleUpdateCustomTheme({ primaryColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                  />
                  <span className="font-mono text-slate-800">{themeConfig.primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">অ্যাকসেন্ট গোল্ড (Accent)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={themeConfig.accentColor}
                    disabled={!currentUser.permissions.canManageThemes && currentUser.role !== 'owner'}
                    onChange={(e) => handleUpdateCustomTheme({ accentColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                  />
                  <span className="font-mono text-slate-800">{themeConfig.accentColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">ব্যাকগ্রাউন্ড রঙ (App Bg)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={themeConfig.appBgColor}
                    disabled={!currentUser.permissions.canManageThemes && currentUser.role !== 'owner'}
                    onChange={(e) => handleUpdateCustomTheme({ appBgColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                  />
                  <span className="font-mono text-slate-800">{themeConfig.appBgColor}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-100">
              <div>
                <label className="block text-slate-700 font-bold mb-1">বাটনের আকার (Button Shape)</label>
                <select
                  value={themeConfig.buttonShape}
                  disabled={!currentUser.permissions.canManageThemes && currentUser.role !== 'owner'}
                  onChange={(e) => handleUpdateCustomTheme({ buttonShape: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                >
                  <option value="rounded-xl">স্মার্ট কার্ভ (Rounded-XL)</option>
                  <option value="rounded-full">সম্পূর্ণ গোল ক্যাপসুল (Pill / Full)</option>
                  <option value="rounded-md">ক্লাসিক শার্প (Rounded-MD)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">কার্ড কর্নার রেডিয়াস (Card Radius)</label>
                <select
                  value={themeConfig.cardRadius}
                  disabled={!currentUser.permissions.canManageThemes && currentUser.role !== 'owner'}
                  onChange={(e) => handleUpdateCustomTheme({ cardRadius: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                >
                  <option value="rounded-2xl">স্ট্যান্ডার্ড (Rounded-2XL)</option>
                  <option value="rounded-3xl">সফট লার্জ (Rounded-3XL)</option>
                  <option value="rounded-xl">কমপ্যাক্ট (Rounded-XL)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">ফন্ট সাইজ স্কেল (Font Size)</label>
                <select
                  value={themeConfig.fontSize}
                  disabled={!currentUser.permissions.canManageThemes && currentUser.role !== 'owner'}
                  onChange={(e) => handleUpdateCustomTheme({ fontSize: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                >
                  <option value="base">স্ট্যান্ডার্ড (15px)</option>
                  <option value="lg">বড় ও স্পষ্ট (16.5px)</option>
                  <option value="sm">কমপ্যাক্ট (14px)</option>
                </select>
              </div>
            </div>

            {/* Light / Dark Mode selector */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-slate-700 font-bold text-xs mb-1.5">ডিসপ্লে মোড (Display Mode)</label>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  disabled={!currentUser.permissions.canManageThemes && currentUser.role !== 'owner'}
                  onClick={() => handleUpdateCustomTheme({ colorMode: 'light' })}
                  className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 border ${
                    themeConfig.colorMode === 'light'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>লাইট মোড (Light)</span>
                </button>

                <button
                  type="button"
                  disabled={!currentUser.permissions.canManageThemes && currentUser.role !== 'owner'}
                  onClick={() => handleUpdateCustomTheme({ colorMode: 'dark' })}
                  className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 border ${
                    themeConfig.colorMode === 'dark'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  <Moon className="w-4 h-4 text-amber-300" />
                  <span>ডার্ক মোড (Dark)</span>
                </button>

                <button
                  type="button"
                  disabled={!currentUser.permissions.canManageThemes && currentUser.role !== 'owner'}
                  onClick={() => handleUpdateCustomTheme({ colorMode: 'system' })}
                  className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 border ${
                    themeConfig.colorMode === 'system'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span>সিস্টেম অটো (Auto)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Live Theme Preview Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-purple-600" />
              <span>লাইভ প্রিভিউ (বর্তমান থিমের বাস্তব প্রতিফলন)</span>
            </h3>

            <div
              className={`p-4 border transition-all ${themeConfig.cardRadius}`}
              style={{
                backgroundColor: themeConfig.cardBgColor,
                borderColor: themeConfig.secondaryColor + '30',
                color: themeConfig.textColor,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs"
                    style={{ backgroundColor: themeConfig.accentColor, color: themeConfig.primaryColor }}
                  >
                    SO
                  </div>
                  <div>
                    <div className="font-bold text-xs" style={{ color: themeConfig.textColor }}>সিজা অনলাইন বিলিং কার্ড</div>
                    <div className="text-[10px] opacity-70">কাস্টমাইজড প্রিভিউ</div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`px-3 py-1.5 text-xs font-bold shadow-xs ${themeConfig.buttonShape}`}
                  style={{ backgroundColor: themeConfig.primaryColor, color: '#ffffff' }}
                >
                  নতুন বিল
                </button>
              </div>

              <div className="p-3 bg-black/5 rounded-xl flex items-center justify-between text-xs">
                <span>আজকের মোট সংগ্রহ:</span>
                <span className="font-mono font-black" style={{ color: themeConfig.accentColor }}>
                  ₹৪,৫০০.০০
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. INVOICE & RECEIPT BRANDING TAB */}
      {/* ========================================================================= */}
      {activeTab === 'invoice' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm max-w-3xl space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-blue-900" />
              <span>রশিদ ও ক্যাশ মেমো ব্র্যান্ডিং (Invoice & PDF Customization)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-bengali">
              গ্রাহকের রসিদ ও হোয়াটসঅ্যাপ বিলে কোন কোন তথ্য দৃশ্যমান হবে তা নিয়ন্ত্রণ করুন
            </p>
          </div>

          {invoiceSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>রশিদ ও ক্যাশ মেমো সেটিংস সংরক্ষিত হয়েছে!</span>
            </div>
          )}

          <form onSubmit={handleSaveInvoicePreferences} className="space-y-4 text-xs">
            {/* Toggles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLogoOnReceipt}
                  onChange={(e) => setShowLogoOnReceipt(e.target.checked)}
                  className="rounded text-blue-900 w-4 h-4"
                />
                <span className="font-semibold text-slate-800">রশিদে দোকানের লোগো প্রদর্শন করুন</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOwnerOnReceipt}
                  onChange={(e) => setShowOwnerOnReceipt(e.target.checked)}
                  className="rounded text-blue-900 w-4 h-4"
                />
                <span className="font-semibold text-slate-800">মালিক / স্বত্বাধিকারীর নাম প্রদর্শন</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAddressOnReceipt}
                  onChange={(e) => setShowAddressOnReceipt(e.target.checked)}
                  className="rounded text-blue-900 w-4 h-4"
                />
                <span className="font-semibold text-slate-800">দোকানের সম্পূর্ণ ঠিকানা প্রদর্শন</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPhoneOnReceipt}
                  onChange={(e) => setShowPhoneOnReceipt(e.target.checked)}
                  className="rounded text-blue-900 w-4 h-4"
                />
                <span className="font-semibold text-slate-800">হেল্পলাইন ও হোয়াটসঅ্যাপ নম্বর প্রদর্শন</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCscIdOnReceipt}
                  onChange={(e) => setShowCscIdOnReceipt(e.target.checked)}
                  className="rounded text-blue-900 w-4 h-4"
                />
                <span className="font-semibold text-slate-800">সিএসসি আইডি (CSC ID) প্রদর্শন</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showQrOnReceipt}
                  onChange={(e) => setShowQrOnReceipt(e.target.checked)}
                  className="rounded text-blue-900 w-4 h-4"
                />
                <span className="font-semibold text-slate-800">পেমেন্ট UPI QR কোড প্রদর্শন</span>
              </label>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                রসিদের হেডার টেক্সট (Invoice Header Title)
              </label>
              <input
                type="text"
                value={invoiceHeaderText}
                onChange={(e) => setInvoiceHeaderText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                ধন্যবাদ বার্তা ও ফুটার টেক্সট (Invoice Footer Message)
              </label>
              <textarea
                rows={2}
                value={invoiceFooterText}
                onChange={(e) => setInvoiceFooterText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>রসিদ ফরম্যাট সংরক্ষণ করুন</span>
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. STAFF RBAC MANAGEMENT TAB */}
      {/* ========================================================================= */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">{t.staffManagement}</h2>
              <p className="text-xs text-slate-500 font-bengali">
                মালিক ও কর্মচারীদের অধিকার নিয়ন্ত্রণ (RBAC Access Control)
              </p>
            </div>

            {currentUser.permissions.canManageStaff && (
              <button
                onClick={() => setShowAddStaff(true)}
                className="px-3.5 py-2 bg-blue-900 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>+ নতুন স্টাফ অ্যাকাউন্ট</span>
              </button>
            )}
          </div>

          {/* Quick Active User Switcher */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-amber-800 font-bold block">{t.currentLoggedIn}:</span>
              <span className="text-slate-900 font-bold text-sm">
                {currentUser.name} ({currentUser.role === 'owner' ? t.ownerRole : t.staffRole})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">ইউজার পরিবর্তন:</span>
              <select
                value={currentUser.id}
                onChange={(e) => onSwitchUser(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-xs"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} [{u.role === 'owner' ? 'Owner' : 'Staff'}]
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Users List Table with all granular permissions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-3">নাম ও ইউজারনেম</th>
                    <th className="py-3 px-2">ভূমিকা</th>
                    <th className="py-3 px-2 text-center">দোকান প্রোফাইল</th>
                    <th className="py-3 px-2 text-center">লোগো/ব্র্যান্ডিং</th>
                    <th className="py-3 px-2 text-center">সার্ভিস তৈরি</th>
                    <th className="py-3 px-2 text-center">রেট চার্ট</th>
                    <th className="py-3 px-2 text-center">বিলে দর বদল</th>
                    <th className="py-3 px-2 text-center">থিম নিয়ন্ত্রণ</th>
                    <th className="py-3 px-2 text-center">রিপোর্ট দেখা</th>
                    <th className="py-3 px-2 text-center">বিল বাতিল</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">@{u.username}</div>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            u.role === 'owner'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.role === 'owner' ? 'Owner (মালিক)' : 'Staff (স্টাফ)'}
                        </span>
                      </td>

                      <td className="py-3 px-2 text-center">
                        <input
                          type="checkbox"
                          disabled={u.role === 'owner' || !currentUser.permissions.canManageStaff}
                          checked={u.permissions.canManageShopProfile ?? false}
                          onChange={() => handleTogglePermission(u.id, 'canManageShopProfile')}
                          className="rounded text-blue-900 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      <td className="py-3 px-2 text-center">
                        <input
                          type="checkbox"
                          disabled={u.role === 'owner' || !currentUser.permissions.canManageStaff}
                          checked={u.permissions.canManageBranding ?? false}
                          onChange={() => handleTogglePermission(u.id, 'canManageBranding')}
                          className="rounded text-blue-900 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      <td className="py-3 px-2 text-center">
                        <input
                          type="checkbox"
                          disabled={u.role === 'owner' || !currentUser.permissions.canManageStaff}
                          checked={u.permissions.canManageServices}
                          onChange={() => handleTogglePermission(u.id, 'canManageServices')}
                          className="rounded text-blue-900 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      <td className="py-3 px-2 text-center">
                        <input
                          type="checkbox"
                          disabled={u.role === 'owner' || !currentUser.permissions.canManageStaff}
                          checked={u.permissions.canManagePricing ?? false}
                          onChange={() => handleTogglePermission(u.id, 'canManagePricing')}
                          className="rounded text-blue-900 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      <td className="py-3 px-2 text-center">
                        <input
                          type="checkbox"
                          disabled={u.role === 'owner' || !currentUser.permissions.canManageStaff}
                          checked={u.permissions.canOverridePrice ?? false}
                          onChange={() => handleTogglePermission(u.id, 'canOverridePrice')}
                          className="rounded text-blue-900 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      <td className="py-3 px-2 text-center">
                        <input
                          type="checkbox"
                          disabled={u.role === 'owner' || !currentUser.permissions.canManageStaff}
                          checked={u.permissions.canManageThemes ?? false}
                          onChange={() => handleTogglePermission(u.id, 'canManageThemes')}
                          className="rounded text-blue-900 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      <td className="py-3 px-2 text-center">
                        <input
                          type="checkbox"
                          disabled={u.role === 'owner' || !currentUser.permissions.canManageStaff}
                          checked={u.permissions.canViewFinancialReports}
                          onChange={() => handleTogglePermission(u.id, 'canViewFinancialReports')}
                          className="rounded text-blue-900 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      <td className="py-3 px-2 text-center">
                        <input
                          type="checkbox"
                          disabled={u.role === 'owner' || !currentUser.permissions.canManageStaff}
                          checked={u.permissions.canCancelInvoices}
                          onChange={() => handleTogglePermission(u.id, 'canCancelInvoices')}
                          className="rounded text-blue-900 w-4 h-4 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Staff Modal */}
          {showAddStaff && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
              <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5">
                <h3 className="font-bold text-sm text-slate-900 mb-3">নতুন স্টাফ অ্যাকাউন্ট তৈরি</h3>

                <form onSubmit={handleAddStaffMember} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">স্টাফের নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: অনিক মণ্ডল"
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">ইউজারনেম (লগইন) *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: anik"
                      value={staffUsername}
                      onChange={(e) => setStaffUsername(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">লগইন পিন / পাসওয়ার্ড</label>
                    <input
                      type="password"
                      value={staffPin}
                      onChange={(e) => setStaffPin(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddStaff(false)}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                    >
                      {t.cancel}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl"
                    >
                      {t.save}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. LANGUAGE SETTINGS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'language' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm max-w-lg space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Languages className="w-5 h-5 text-blue-900" />
              <span>ইন্টারফেস ভাষা নির্বাচন (Interface Language)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-bengali">
              সিজা অনলাইন অ্যাপ্লিকেশনের ডিফল্ট ভাষা বাংলা এবং ঐচ্ছিক ভাষা ইংরেজি
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => onLanguageChanged?.('bn')}
              className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                lang === 'bn'
                  ? 'border-blue-900 bg-blue-50/40 ring-2 ring-blue-900/10'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <div className="font-bold text-sm text-slate-900">বাংলা (Default - পশ্চিমবঙ্গ)</div>
                <div className="text-xs text-slate-500 mt-0.5">সহজ ও পঠনযোগ্য বাংলা ইউনিকোড লিপি</div>
              </div>
              {lang === 'bn' && <CheckCircle2 className="w-5 h-5 text-blue-900" />}
            </button>

            <button
              type="button"
              onClick={() => onLanguageChanged?.('en')}
              className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                lang === 'en'
                  ? 'border-blue-900 bg-blue-50/40 ring-2 ring-blue-900/10'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <div className="font-bold text-sm text-slate-900">English (Secondary)</div>
                <div className="text-xs text-slate-500 mt-0.5">Universal business and invoicing interface</div>
              </div>
              {lang === 'en' && <CheckCircle2 className="w-5 h-5 text-blue-900" />}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. STATIC UPI QR CONFIG TAB */}
      {/* ========================================================================= */}
      {activeTab === 'upi' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm max-w-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">কাউন্টার স্থায়ী ইউপিআই QR কনফিগারেশন</h2>
            <button
              onClick={onShowStaticQr}
              className="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-500" />
              <span>QR প্রিভিউ দেখুন</span>
            </button>
          </div>

          <form onSubmit={handleSaveUpi} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                ভেরিফায়েড ইউপিআই আইডি (UPI ID) *
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: 6294363894@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
              {upiError && <p className="text-red-600 text-[11px] mt-1">{upiError}</p>}
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                মার্চেন্ট / দোকানের নাম (Payee Name) *
              </label>
              <input
                type="text"
                required
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                পেমেন্ট নোট বা বর্ণনা (Payment Note)
              </label>
              <input
                type="text"
                value={upiNote}
                onChange={(e) => setUpiNote(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
              <strong className="block font-bold mb-0.5">মনে রাখুন:</strong>
              এই UPI ID-টি গ্রাহকের বিলের ডায়নামিক QR কোড এবং দোকানের কাউন্টার QR কোডে স্বয়ংক্রিয়ভাবে ব্যবহৃত হবে।
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              {upiSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
              <span>{upiSaved ? 'সংরক্ষিত হয়েছে!' : 'UPI সেটিংস সেভ করুন'}</span>
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. BACKUP & OFFLINE CLOUD SYNC TAB */}
      {/* ========================================================================= */}
      {activeTab === 'sync' && (
        <div className="space-y-5 max-w-xl">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Cloud className="w-4 h-4 text-blue-900" />
              <span>অফলাইন মেমোরি ও ক্লাউড সিঙ্ক স্ট্যাটাস</span>
            </h2>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">লোকাল ডাটাবেস:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ১০০% অফলাইন কার্যকর
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">অপেক্ষমান সিঙ্ক আইটেম:</span>
                <span className="font-mono font-bold text-amber-700">{syncQueue.length} টি</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">সর্বশেষ সফল সিঙ্ক:</span>
                <span className="font-mono text-slate-800">
                  {new Date(lastSyncTime).toLocaleTimeString()}
                </span>
              </div>
            </div>

            {syncMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{syncMessage}</span>
              </div>
            )}

            <button
              onClick={handleManualSync}
              disabled={syncing}
              className="w-full py-2.5 bg-blue-900 hover:bg-blue-950 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <Cloud className="w-4 h-4 text-amber-400" />
              <span>{syncing ? 'সিঙ্ক হচ্ছে...' : 'এখনই ক্লাউড সিঙ্ক চালান'}</span>
            </button>
          </div>

          {/* Backup Export and Import */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-900" />
              <span>সম্পূর্ণ ডাটাবেস ব্যাকআপ ও রিস্টোর</span>
            </h2>

            <p className="text-xs text-slate-500">
              দোকানের সকল বিল, গ্রাহক খাতা, ক্যাশ মেমো, সেবা তালিকা ও থিম সেটিংস একটি সিঙ্গেল ফাইলে ডাউনলোড বা রিস্টোর করুন।
            </p>

            {importStatus && (
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded-xl">
                {importStatus}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleExportBackup}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>ব্যাকআপ ডাউনলোড (JSON)</span>
              </button>

              <label className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-300 text-center">
                <Upload className="w-4 h-4 text-blue-900" />
                <span>ব্যাকআপ রিস্টোর</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. ANDROID STUDIO KOTLIN CODE EXPORT TAB */}
      {/* ========================================================================= */}
      {activeTab === 'android' && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                <Code className="w-5 h-5" />
                <span>নেটিভ অ্যান্ড্রয়েড স্টুডিও সোর্স কোড (Kotlin & Room DB)</span>
              </h2>
              <p className="text-xs text-slate-400">
                প্যাকেজ: <span className="font-mono text-amber-300">com.shizaonline.billing</span> · Jetpack Compose, Material 3, Room v2
              </p>
            </div>

            <div className="flex gap-1.5 text-xs overflow-x-auto">
              {['AppDatabase', 'RoomEntities', 'MainActivity', 'BuildGradle'].map((f) => (
                <button
                  key={f}
                  onClick={() => setAndroidFile(f)}
                  className={`px-3 py-1 rounded-lg font-mono text-[11px] transition-colors ${
                    androidFile === f
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono overflow-x-auto max-h-96">
            {androidFile === 'AppDatabase' && (
              <pre className="text-emerald-300">
{`package com.shizaonline.billing.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.shizaonline.billing.data.local.entities.*

@Database(
    entities = [
        InvoiceEntity::class,
        CustomerEntity::class,
        ServiceEntity::class,
        PaymentEntity::class,
        ExpenseEntity::class,
        BusinessProfileEntity::class
    ],
    version = 2,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun invoiceDao(): InvoiceDao
    abstract fun customerDao(): CustomerDao
    abstract fun serviceDao(): ServiceDao
    abstract fun paymentDao(): PaymentDao
    abstract fun expenseDao(): ExpenseDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "shiza_online_database"
                )
                .fallbackToDestructiveMigration()
                .build().also { INSTANCE = it }
            }
        }
    }
}`}
              </pre>
            )}

            {androidFile === 'RoomEntities' && (
              <pre className="text-emerald-300">
{`package com.shizaonline.billing.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.UUID

@Entity(tableName = "services")
data class ServiceEntity(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val category: String, // "online", "government", "printing", "pvc_card", "recharge_bill", "tickets", "farmer", "other"
    val nameBn: String,
    val nameEn: String,
    val pricePaise: Long,
    val extraChargesPaise: Long = 0,
    val pricingType: String = "fixed", // "fixed", "variable", "unit_based"
    val isFree: Boolean = false,
    val unitBn: String,
    val unitEn: String,
    val active: Boolean = true,
    val imageUrl: String? = null,
    val iconKey: String? = null,
    val descriptionBn: String? = null,
    val descriptionEn: String? = null,
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "business_profile")
data class BusinessProfileEntity(
    @PrimaryKey
    val id: String = "primary_business",
    val name: String = "Shiza Online",
    val bengaliName: String = "সিজা অনলাইন",
    val type: String = "CSC | Digital Service Centre",
    val ownerName: String = "Mominur Islam",
    val address: String = "বেলকুড়িয়া, জোড়দিঘী, দক্ষিণ দিনাজপুর, ৭৩৩১২১",
    val contact: String = "6294363894",
    val whatsapp: String = "6294363894",
    val cscId: String? = "CSC-WB-733121",
    val tagline: String = "আপনার অনলাইন কাজের সহজ সমাধান।",
    val openingHours: String = "সকাল ৮:০০ - রাত ৯:০০",
    val upiId: String = "6294363894@upi",
    val logoPath: String? = null
)`}
              </pre>
            )}

            {androidFile === 'MainActivity' && (
              <pre className="text-cyan-300">
{`package com.shizaonline.billing

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.*
import com.shizaonline.billing.ui.theme.ShizaOnlineTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ShizaOnlineTheme {
                Surface(color = MaterialTheme.colorScheme.background) {
                    ShizaOnlineApp()
                }
            }
        }
    }
}`}
              </pre>
            )}

            {androidFile === 'BuildGradle' && (
              <pre className="text-amber-200">
{`plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.ksp)
}

android {
    namespace = "com.shizaonline.billing"
    compileSdk = 35
    defaultConfig {
        applicationId = "com.shizaonline.billing"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }
}`}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Shop Logo Crop Modal */}
      <ImageCropModal
        isOpen={logoCropOpen}
        onClose={() => setLogoCropOpen(false)}
        onImageCropped={handleLogoCropped}
        title="দোকানের অফিসিয়াল লোগো আপলোড ও ক্রপ করুন"
        aspectRatio="circle"
        initialImage={business.logoUrl || DEFAULT_SHIZA_LOGO}
      />
    </div>
  );
};
