import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Check,
  X,
  Power,
  Trash2,
  Camera,
  RotateCcw,
  Upload,
  AlertCircle,
  ShieldAlert,
  Image as ImageIcon,
} from 'lucide-react';
import { Language, Service, ServiceCategory, User } from '../types';
import { db, formatINR } from '../db/storage';
import { translations } from '../utils/i18n';
import { ServiceThumbnail } from '../components/ServiceThumbnail';
import { ImageCropModal } from '../components/ImageCropModal';
import { BUILT_IN_SERVICE_ICONS } from '../utils/imageUtils';

interface ServicesViewProps {
  currentUser: User;
  services: Service[];
  lang: Language;
  onServicesUpdated: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  currentUser,
  services,
  lang,
  onServicesUpdated,
}) => {
  const t = translations[lang];

  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Image Crop Modal state
  const [cropModalOpen, setCropModalOpen] = useState<boolean>(false);
  const [cropTarget, setCropTarget] = useState<'add' | 'edit'>('edit');

  // New service form state
  const [category, setCategory] = useState<ServiceCategory>('online');
  const [nameBn, setNameBn] = useState<string>('');
  const [nameEn, setNameEn] = useState<string>('');
  const [descBn, setDescBn] = useState<string>('');
  const [descEn, setDescEn] = useState<string>('');
  const [price, setPrice] = useState<number>(50);
  const [unitBn, setUnitBn] = useState<string>('প্রতি আবেদন');
  const [unitEn, setUnitEn] = useState<string>('per application');
  const [newServiceImageUrl, setNewServiceImageUrl] = useState<string>('');
  const [newServiceIconKey, setNewServiceIconKey] = useState<string>('form');

  const filtered = services.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const q = search.toLowerCase().trim();
    const matchesQuery =
      !q ||
      s.nameBn.toLowerCase().includes(q) ||
      s.nameEn.toLowerCase().includes(q) ||
      (s.descriptionBn && s.descriptionBn.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  const handleSaveNewService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameBn.trim()) return;

    const newService: Service = {
      id: 'srv-' + Date.now(),
      category,
      nameBn: nameBn.trim(),
      nameEn: nameEn.trim() || nameBn.trim(),
      descriptionBn: descBn.trim() || undefined,
      descriptionEn: descEn.trim() || undefined,
      defaultPrice: Math.max(0, price),
      pricingType: 'fixed',
      extraCharges: 0,
      isFree: false,
      unitBn: unitBn.trim() || 'প্রতি ইউনিট',
      unitEn: unitEn.trim() || 'per unit',
      imageUrl: newServiceImageUrl || undefined,
      iconKey: newServiceIconKey || 'form',
      active: true,
      createdAt: new Date().toISOString(),
    };

    db.saveService(newService);
    setNameBn('');
    setNameEn('');
    setDescBn('');
    setDescEn('');
    setNewServiceImageUrl('');
    setShowAddModal(false);
    onServicesUpdated();
  };

  const handleUpdateExistingService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    db.saveService(editingService);
    setEditingService(null);
    onServicesUpdated();
  };

  const handleToggleActive = (service: Service) => {
    if (!currentUser.permissions.canManageServices) return;
    const updated = { ...service, active: !service.active };
    db.saveService(updated);
    onServicesUpdated();
  };

  const handleDeleteService = (serviceId: string) => {
    if (!currentUser.permissions.canManageServices) return;
    db.deleteService(serviceId);
    setDeleteConfirmId(null);
    if (editingService?.id === serviceId) {
      setEditingService(null);
    }
    onServicesUpdated();
  };

  const handleImageCropped = (dataUrl: string) => {
    if (cropTarget === 'add') {
      setNewServiceImageUrl(dataUrl);
    } else if (editingService) {
      setEditingService({
        ...editingService,
        imageUrl: dataUrl,
      });
    }
  };

  const categoryNames: Record<ServiceCategory, string> = {
    online: 'অনলাইন আবেদন',
    government: 'সরকারি সেবা',
    printing: 'প্রিন্টিং ও জেরক্স',
    pvc_card: 'পিভিসি স্মার্ট কার্ড',
    recharge_bill: 'রিচার্জ ও বিল',
    tickets: 'বাস ও ট্রেন টিকিট',
    farmer: 'কৃষক সেবা',
    other: 'অন্যান্য সেবা',
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-900" />
            <span>{t.serviceCatalogue}</span>
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-900 font-bold rounded-full">
              {services.length} টি পরিষেবা
            </span>
          </h1>
          <p className="text-xs text-slate-500 font-bengali">
            কাস্টম ছবি ও আইকন, রেট চার্ট এবং নতুন সেবা সংযোগ বা নিষ্ক্রিয়করণ
          </p>
        </div>

        {currentUser.permissions.canManageServices ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addNewService}</span>
          </button>
        ) : (
          <div className="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>পরিষেবা ও ছবি পরিবর্তন শুধুমাত্র মালিক করতে পারবেন</span>
          </div>
        )}
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="পরিষেবার নাম বা বিবরণ দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            সব বিভাগ
          </button>
          {(['online', 'government', 'printing', 'pvc_card', 'recharge_bill', 'tickets', 'farmer', 'other'] as ServiceCategory[]).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {categoryNames[cat]}
              </button>
            )
          )}
        </div>
      </div>

      {/* Services Table with Photos & Icons */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4 w-12 text-center">ছবি / আইকন</th>
                <th className="py-3 px-4">পরিষেবার নাম ও বিবরণ</th>
                <th className="py-3 px-4">বিভাগ</th>
                <th className="py-3 px-4 text-right">ইউনিট দর (₹)</th>
                <th className="py-3 px-4">ইউনিটের ধরন</th>
                <th className="py-3 px-4 text-center">অবস্থা</th>
                {currentUser.permissions.canManageServices && (
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((service) => (
                <tr
                  key={service.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    !service.active ? 'opacity-60 bg-slate-50/50' : ''
                  }`}
                >
                  {/* Photo / Icon Thumbnail */}
                  <td className="py-3 px-4 text-center">
                    <ServiceThumbnail
                      service={service}
                      size="md"
                      className="mx-auto"
                    />
                  </td>

                  {/* Service Name & Description */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      {service.nameBn}
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans">
                      {service.nameEn}
                    </div>
                    {service.descriptionBn && (
                      <div className="text-[10px] text-slate-600 mt-0.5 line-clamp-1">
                        {service.descriptionBn}
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {categoryNames[service.category] || service.category}
                    </span>
                  </td>

                  {/* Rate */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-base text-blue-900 whitespace-nowrap">
                    {formatINR(service.defaultPrice)}
                  </td>

                  {/* Unit */}
                  <td className="py-3.5 px-4 text-slate-600 font-bengali whitespace-nowrap">
                    {service.unitBn}
                    <span className="text-[10px] text-slate-400 block font-sans">
                      ({service.unitEn})
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        service.active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {service.active ? t.statusActive : t.statusInactive}
                    </span>
                  </td>

                  {/* Actions */}
                  {currentUser.permissions.canManageServices && (
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingService(service)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                          title="Edit Service & Photo"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-blue-900" />
                        </button>

                        <button
                          onClick={() => handleToggleActive(service)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            service.active
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                          }`}
                          title={service.active ? 'Disable' : 'Enable'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(service.id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Service Modal with Photo Customizer */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto p-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Edit2 className="w-4 h-4 text-blue-900" />
                <span>{t.editService}</span>
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateExistingService} className="space-y-3.5 text-xs">
              {/* Photo & Icon Customizer Area */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <label className="block text-slate-700 font-bold text-xs">
                  পরিষেবার ফটো ও আইকন কাস্টমাইজেশন
                </label>

                <div className="flex items-center gap-3">
                  <ServiceThumbnail
                    imageUrl={editingService.imageUrl}
                    iconKey={editingService.iconKey}
                    category={editingService.category}
                    name={editingService.nameBn}
                    size="xl"
                  />

                  <div className="flex-1 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setCropTarget('edit');
                        setCropModalOpen(true);
                      }}
                      className="w-full py-1.5 px-3 bg-blue-900 hover:bg-blue-950 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        {editingService.imageUrl
                          ? 'ছবি পরিবর্তন / ক্রপ'
                          : 'গ্যালারি থেকে ফটো দিন'}
                      </span>
                    </button>

                    {editingService.imageUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setEditingService({ ...editingService, imageUrl: undefined })
                        }
                        className="w-full py-1 px-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-lg flex items-center justify-center gap-1 text-[11px]"
                      >
                        <RotateCcw className="w-3 h-3 text-amber-600" />
                        <span>ডিফল্ট আইকনে ফেরত যান</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Built-in Icon Picker */}
                <div>
                  <span className="text-[11px] text-slate-600 font-semibold block mb-1">
                    বিল্ট-ইন ভেক্টর আইকন বাছাই করুন:
                  </span>
                  <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                    {BUILT_IN_SERVICE_ICONS.map((ic) => (
                      <button
                        key={ic.key}
                        type="button"
                        onClick={() =>
                          setEditingService({
                            ...editingService,
                            iconKey: ic.key,
                            imageUrl: undefined, // switch to vector icon
                          })
                        }
                        className={`px-2 py-1 rounded-md text-[10px] whitespace-nowrap transition-colors border ${
                          editingService.iconKey === ic.key && !editingService.imageUrl
                            ? 'bg-blue-900 text-white border-blue-900 font-bold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {ic.labelBn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Names */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  {t.serviceNameBn} *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.nameBn}
                  onChange={(e) =>
                    setEditingService({ ...editingService, nameBn: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  {t.serviceNameEn}
                </label>
                <input
                  type="text"
                  value={editingService.nameEn}
                  onChange={(e) =>
                    setEditingService({ ...editingService, nameEn: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  বিবরণ / নোটস (Description)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: আধার কার্ড লিংক বা রঙিন ছবি ৮ কপি..."
                  value={editingService.descriptionBn || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, descriptionBn: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Pricing & Units */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    {t.ratePerUnit} (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={editingService.defaultPrice}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        defaultPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    {t.unitType} (বাংলা)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.unitBn}
                    onChange={(e) =>
                      setEditingService({ ...editingService, unitBn: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
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

      {/* Add New Service Modal with Photo Customizer */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto p-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-900" />
                <span>{t.addNewService}</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewService} className="space-y-3.5 text-xs">
              {/* Photo & Icon Selector */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-slate-700 font-bold text-xs">
                  পরিষেবার ছবি বা ভেক্টর আইকন নির্বাচন
                </label>

                <div className="flex items-center gap-3">
                  <ServiceThumbnail
                    imageUrl={newServiceImageUrl}
                    iconKey={newServiceIconKey}
                    category={category}
                    name={nameBn || 'New Service'}
                    size="xl"
                  />

                  <div className="flex-1 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setCropTarget('add');
                        setCropModalOpen(true);
                      }}
                      className="w-full py-1.5 px-3 bg-blue-900 hover:bg-blue-950 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      <span>গ্যালারি থেকে ফটো দিন</span>
                    </button>

                    {newServiceImageUrl && (
                      <button
                        type="button"
                        onClick={() => setNewServiceImageUrl('')}
                        className="w-full py-1 px-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-lg text-[11px]"
                      >
                        ফটো মুছুন (Use Icon)
                      </button>
                    )}
                  </div>
                </div>

                {/* Built-in Icon Chips */}
                <div>
                  <span className="text-[11px] text-slate-600 font-semibold block mb-1">
                    অথবা তৈরি আইকন বেছে নিন:
                  </span>
                  <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                    {BUILT_IN_SERVICE_ICONS.map((ic) => (
                      <button
                        key={ic.key}
                        type="button"
                        onClick={() => {
                          setNewServiceIconKey(ic.key);
                          setNewServiceImageUrl('');
                        }}
                        className={`px-2 py-1 rounded-md text-[10px] whitespace-nowrap transition-colors border ${
                          newServiceIconKey === ic.key && !newServiceImageUrl
                            ? 'bg-blue-900 text-white border-blue-900 font-bold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {ic.labelBn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  {t.serviceCategory} *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                >
                  <option value="online">{t.catOnline}</option>
                  <option value="printing">{t.catPrinting}</option>
                  <option value="photo">{t.catPhoto}</option>
                  <option value="tickets">{t.catTickets}</option>
                  <option value="agriculture">{t.catAgriculture}</option>
                  <option value="other">{t.catOther}</option>
                </select>
              </div>

              {/* Bengali & English Names */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  {t.serviceNameBn} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ড্রাইভিং লাইসেন্স আবেদন"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  {t.serviceNameEn}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Driving Licence Assistance"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  পরিষেবার বিবরণ (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: নতুন লার্নার লাইসেন্স আবেদন ও ফি পেমেন্ট..."
                  value={descBn}
                  onChange={(e) => setDescBn(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Price & Unit */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    {t.ratePerUnit} (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    {t.unitType} (বাংলা)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: প্রতি আবেদন"
                    value={unitBn}
                    onChange={(e) => setUnitBn(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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

      {/* Delete Service Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">পরিষেবা মুছে ফেলার নিশ্চিতকরণ</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              আপনি কি নিশ্চিতভাবে এই পরিষেবাটি ক্যাটালগ থেকে মুছে ফেলতে চান? আগের তৈরিকৃত কোনো ইনভয়েসে এর প্রভাব পড়বে না।
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => handleDeleteService(deleteConfirmId)}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Cropping Modal */}
      <ImageCropModal
        title="পরিষেবার ফটো ক্রপ ও সাইজ করুন (1:1 Square)"
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        onImageCropped={handleImageCropped}
        aspectRatio="square"
        lang={lang}
      />
    </div>
  );
};
