import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Search,
  UserPlus,
  QrCode,
  CheckCircle,
  FileText,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  BusinessInfo,
  Customer,
  Invoice,
  InvoiceItem,
  Language,
  PaymentMethod,
  PaymentStatus,
  Service,
  ServiceCategory,
  User,
} from '../types';
import { db, formatINR, toPaise, toRupees } from '../db/storage';
import { translations } from '../utils/i18n';
import { ServiceThumbnail } from '../components/ServiceThumbnail';

interface NewBillViewProps {
  currentUser: User;
  business: BusinessInfo;
  services: Service[];
  customers: Customer[];
  lang: Language;
  onInvoiceCreated: (invoice: Invoice) => void;
  onShowDynamicQr: (invoiceData: { amount: number; invoiceNumber: string }) => void;
  onCustomerAdded: (customer: Customer) => void;
}

export const NewBillView: React.FC<NewBillViewProps> = ({
  currentUser,
  business,
  services,
  customers,
  lang,
  onInvoiceCreated,
  onShowDynamicQr,
  onCustomerAdded,
}) => {
  const t = translations[lang];

  // Selected Customer
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState<boolean>(false);
  const [newCustName, setNewCustName] = useState<string>('');
  const [newCustMobile, setNewCustMobile] = useState<string>('');
  const [newCustNotes, setNewCustNotes] = useState<string>('');

  // Invoice Items
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [serviceSearch, setServiceSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');

  // Pricing & Calculations
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [isManualPaidAmount, setIsManualPaidAmount] = useState<boolean>(false);
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  // Filter services
  const filteredServices = services.filter((s) => {
    if (!s.active) return false;
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.nameBn.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.nameEn.toLowerCase().includes(serviceSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Add service item to invoice
  const handleAddService = (service: Service) => {
    const existingIndex = items.findIndex((i) => i.serviceId === service.id);
    if (existingIndex >= 0) {
      const updated = [...items];
      const newQty = updated[existingIndex].quantity + 1;
      const unitPaise = toPaise(updated[existingIndex].unitPrice);
      updated[existingIndex].quantity = newQty;
      updated[existingIndex].lineTotal = toRupees(unitPaise * newQty);
      setItems(updated);
    } else {
      const unitPaise = toPaise(service.defaultPrice);
      const newItem: InvoiceItem = {
        id: 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        serviceId: service.id,
        serviceNameBn: service.nameBn,
        serviceNameEn: service.nameEn,
        quantity: 1,
        unitPrice: service.defaultPrice,
        lineTotal: toRupees(unitPaise),
        unitBn: service.unitBn,
      };
      setItems([...items, newItem]);
    }
  };

  // Update item quantity
  const handleUpdateQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    const updated = items.map((item) => {
      if (item.id === itemId) {
        const lineTotal = toRupees(toPaise(item.unitPrice) * qty);
        return { ...item, quantity: qty, lineTotal };
      }
      return item;
    });
    setItems(updated);
  };

  // Update item unit price (locked at billing time)
  const handleUpdateUnitPrice = (itemId: string, newPrice: number) => {
    const safePrice = Math.max(0, newPrice);
    const updated = items.map((item) => {
      if (item.id === itemId) {
        const lineTotal = toRupees(toPaise(safePrice) * item.quantity);
        return { ...item, unitPrice: safePrice, lineTotal };
      }
      return item;
    });
    setItems(updated);
  };

  // Remove item
  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((i) => i.id !== itemId));
  };

  // Decimal-Safe Calculations
  const subtotalPaise = items.reduce((sum, item) => sum + toPaise(item.lineTotal), 0);
  const subtotalRupees = toRupees(subtotalPaise);
  const discountPaise = toPaise(discountAmount);
  const totalAmountPaise = Math.max(0, subtotalPaise - discountPaise);
  const totalAmountRupees = toRupees(totalAmountPaise);

  // If user hasn't manually overridden paid amount, default to full payment for convenience
  const effectivePaidAmount = isManualPaidAmount ? paidAmount : totalAmountRupees;
  const balanceRupees = Math.max(0, totalAmountRupees - effectivePaidAmount);

  // Handle Quick Add Customer
  const handleSaveQuickCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;

    const newCust: Customer = {
      id: 'cust-' + Date.now(),
      customerCode: `CUST-${1000 + customers.length + 1}`,
      name: newCustName.trim(),
      mobile: newCustMobile.trim() || undefined,
      notes: newCustNotes.trim() || undefined,
      totalBilled: 0,
      totalPaid: 0,
      balance: 0,
      createdAt: new Date().toISOString(),
    };

    db.saveCustomer(newCust);
    onCustomerAdded(newCust);
    setSelectedCustomerId(newCust.id);
    setShowAddCustomerModal(false);
    setNewCustName('');
    setNewCustMobile('');
    setNewCustNotes('');
  };

  // Submit & Save Invoice
  const handleCreateInvoice = () => {
    if (items.length === 0) return;

    const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || {
      id: 'cust-walkin',
      name: 'সাধারণ গ্রাহক (Walk-in Customer)',
      mobile: '',
    };

    setSaving(true);

    const nextInvoiceNo = db.getNextInvoiceNumber();
    const nowIso = new Date().toISOString();

    // Determine payment status
    let status: PaymentStatus = 'paid';
    if (balanceRupees === 0) {
      status = 'paid';
    } else if (effectivePaidAmount > 0) {
      status = 'partially_paid';
    } else {
      status = paymentMethod === 'upi' ? 'pending_verification' : 'unpaid';
    }

    if (paymentMethod === 'upi' && effectivePaidAmount > 0) {
      // Pending verification for UPI initially as required by Indian financial rules!
      status = balanceRupees === 0 ? 'pending_verification' : 'partially_paid';
    }

    const newInvoice: Invoice = {
      id: 'inv-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      invoiceNumber: nextInvoiceNo,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      customerMobile: currentCustomer.mobile,
      items: items,
      subtotal: subtotalRupees,
      discount: discountAmount,
      totalAmount: totalAmountRupees,
      paidAmount: effectivePaidAmount,
      balance: balanceRupees,
      paymentMethod,
      paymentStatus: status,
      transactionRef: transactionRef.trim() || undefined,
      createdByUserId: currentUser.id,
      createdByUserName: currentUser.name,
      createdAt: nowIso,
      updatedAt: nowIso,
      auditTrail: [
        {
          id: 'aud-' + Date.now(),
          timestamp: nowIso,
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'CREATED',
          details: `Invoice ${nextInvoiceNo} created for ${currentCustomer.name}. Amount: ₹${totalAmountRupees}, Paid: ₹${effectivePaidAmount}`,
        },
      ],
      syncStatus: 'pending',
    };

    // Save invoice to local database
    db.saveInvoice(newInvoice);

    // If payment recorded, save payment record
    if (effectivePaidAmount > 0) {
      const paymentRecord = {
        id: 'pay-' + Date.now(),
        invoiceId: newInvoice.id,
        invoiceNumber: newInvoice.invoiceNumber,
        customerId: currentCustomer.id,
        customerName: currentCustomer.name,
        amount: effectivePaidAmount,
        method: paymentMethod,
        transactionRef: transactionRef.trim() || undefined,
        verificationStatus: (paymentMethod === 'cash' ? 'verified' : 'pending') as 'verified' | 'pending',
        recordedByUserId: currentUser.id,
        recordedByUserName: currentUser.name,
        date: nowIso,
        notes: paymentMethod === 'cash' ? 'নগদ গ্রহণ' : 'UPI মাধ্যমে পেমেন্ট',
        syncStatus: 'pending' as const,
      };
      db.savePayment(paymentRecord);
    }

    // Trigger celebratory confetti effect
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    setSaving(false);
    // Clear items and notify parent to show Receipt modal
    setItems([]);
    setDiscountAmount(0);
    setPaidAmount(0);
    setIsManualPaidAmount(false);
    setTransactionRef('');

    onInvoiceCreated(newInvoice);
  };

  const selectedCustomerObj = customers.find((c) => c.id === selectedCustomerId);

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-900" />
            <span>{t.createInvoice}</span>
          </h1>
          <p className="text-xs text-slate-500 font-bengali">
            কাস্টমার নির্বাচন করুন, পরিষেবা যোগ করুন এবং ডিজিটাল ক্যাশ মেমো তৈরি করুন
          </p>
        </div>

        {/* Customer Balance Alert if customer has outstanding balance */}
        {selectedCustomerObj && selectedCustomerObj.balance > 0 && (
          <div className="px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-2 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              কাস্টমারের আগের বাকি:{' '}
              <strong className="font-mono font-bold text-amber-950">
                {formatINR(selectedCustomerObj.balance)}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Main 2-Column POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Service Catalogue & Selector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Customer Selection Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">{t.selectCustomer}</label>
              <button
                type="button"
                onClick={() => setShowAddCustomerModal(true)}
                className="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                {t.orCreateCustomer}
              </button>
            </div>

            <div className="flex gap-2">
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.mobile ? `(${c.mobile})` : ''} — [বাকি: ₹{c.balance.toFixed(2)}]
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Service Search & Category Filter Tabs */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-800">{t.addServices}</h2>
              <span className="text-[11px] text-slate-600">
                {filteredServices.length} টি পরিষেবা উপলব্ধ
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={t.searchService}
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            {/* Category Filter Buttons */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                সব বিভাগ
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('online')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'online'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                অনলাইন ফর্ম
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('government')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'government'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                সরকারি সেবা
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('printing')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'printing'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                জেরক্স ও প্রিন্ট
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('pvc_card')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'pvc_card'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                পিভিসি কার্ড
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('recharge_bill')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'recharge_bill'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                রিচার্জ ও বিল
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('tickets')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'tickets'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                টিকিট বুকিং
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('farmer')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'farmer'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                কৃষক সেবা
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('other')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'other'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                অন্যান্য
              </button>
            </div>

            {/* Quick Service Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-96 overflow-y-auto pr-1">
              {filteredServices.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => handleAddService(service)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-900 bg-white hover:bg-blue-50/40 text-left transition-all flex flex-col justify-between group active:scale-[0.98] shadow-2xs"
                >
                  <div className="flex items-start gap-2">
                    <ServiceThumbnail service={service} size="sm" className="mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                        {service.nameBn}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5 font-sans">
                        {service.nameEn}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs pt-1.5 border-t border-slate-100">
                    <span className="font-mono font-bold text-blue-900">
                      ₹{service.defaultPrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                      {service.unitBn}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Invoice Items & Bill Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[500px]">
            <div>
              {/* Cart Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">বিল আইটেম তালিকা</h3>
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-900 font-bold rounded-full">
                    {items.length}
                  </span>
                </div>
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setItems([])}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    সব মুছুন
                  </button>
                )}
              </div>

              {/* Items List */}
              {items.length === 0 ? (
                <div className="py-16 text-center text-slate-600">
                  <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">এখনো কোনো পরিষেবা যোগ করা হয়নি</p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    বামের তালিকা থেকে পরিষেবা সিলেক্ট করুন
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto my-2 pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {item.serviceNameBn}
                        </div>
                        <div className="text-[10px] text-slate-600 flex items-center gap-1.5 mt-0.5">
                          <span>দর:</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={item.unitPrice}
                            onChange={(e) => handleUpdateUnitPrice(item.id, Number(e.target.value))}
                            className="w-14 px-1 py-0.5 border border-slate-200 rounded text-slate-800 text-[11px] font-mono text-right"
                            title="Editable Unit Price"
                          />
                          <span>/ {item.unitBn}</span>
                        </div>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right shrink-0 w-16">
                        <div className="text-xs font-mono font-bold text-slate-900">
                          ₹{item.lineTotal.toFixed(2)}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-[10px] text-red-500 hover:text-red-700"
                        >
                          মুছুন
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Calculations & Payment Controls */}
            {items.length > 0 && (
              <div className="pt-3 border-t border-slate-200 space-y-3">
                {/* Subtotal & Discount */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>{t.subtotal}:</span>
                    <span className="font-mono font-bold text-slate-800">
                      ₹{subtotalRupees.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>{t.discount} (₹):</span>
                    <input
                      type="number"
                      min="0"
                      step="5"
                      value={discountAmount || ''}
                      onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value)))}
                      placeholder="0"
                      className="w-20 px-2 py-0.5 border border-slate-300 rounded text-right font-mono text-xs focus:ring-1 focus:ring-blue-900"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-1.5 border-t border-slate-200 text-sm font-black text-slate-950">
                    <span>{t.finalAmount}:</span>
                    <span className="text-base text-blue-900 font-mono">
                      {formatINR(totalAmountRupees)}
                    </span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    {t.paymentMethod}
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors ${
                        paymentMethod === 'cash'
                          ? 'bg-blue-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span>💵 {t.cash}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors ${
                        paymentMethod === 'upi'
                          ? 'bg-blue-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-amber-400" />
                      <span>{t.upi}</span>
                    </button>
                  </div>
                </div>

                {/* Amount Paid & Due balance */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">{t.paidAmount}:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500 font-mono">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={isManualPaidAmount ? paidAmount : totalAmountRupees}
                        onChange={(e) => {
                          setIsManualPaidAmount(true);
                          setPaidAmount(Number(e.target.value));
                        }}
                        className="w-24 px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-emerald-700 text-right text-xs"
                      />
                    </div>
                  </div>

                  {/* Quick Payment Preset Buttons */}
                  <div className="flex gap-1 justify-end text-[10px]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsManualPaidAmount(true);
                        setPaidAmount(totalAmountRupees);
                      }}
                      className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold hover:bg-emerald-200"
                    >
                      সম্পূর্ণ জমা
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsManualPaidAmount(true);
                        setPaidAmount(0);
                      }}
                      className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold hover:bg-amber-200"
                    >
                      পুরো বাকি
                    </button>
                  </div>

                  <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
                    <span className="text-slate-600">{t.remainingBalance}:</span>
                    <span className={balanceRupees > 0 ? 'text-amber-700 font-mono' : 'text-slate-400 font-mono'}>
                      {formatINR(balanceRupees)}
                    </span>
                  </div>

                  {/* Transaction Ref for UPI */}
                  {paymentMethod === 'upi' && (
                    <div className="pt-2 border-t border-slate-200">
                      <input
                        type="text"
                        placeholder="UPI UTR / রেফারেন্স নম্বর (যদি থাকে)"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* UPI Verification Note */}
                {paymentMethod === 'upi' && (
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      ইউপিআই পেমেন্ট প্রাথমিকভাবে "যাচাই অপেক্ষমান" থাকবে। ব্যাংক এসএমএস দেখে নিশ্চিত করবেন।
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-1">
                  {paymentMethod === 'upi' && (
                    <button
                      type="button"
                      onClick={() =>
                        onShowDynamicQr({
                          amount: totalAmountRupees,
                          invoiceNumber: 'PREVIEW-' + Date.now().toString().slice(-4),
                        })
                      }
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-300"
                    >
                      <QrCode className="w-4 h-4 text-blue-900" />
                      <span>{t.showQrForBill}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={saving || items.length === 0}
                    onClick={handleCreateInvoice}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-400/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4 text-slate-950" />
                    <span>{saving ? 'বিল সেভ হচ্ছে...' : t.saveAndGenerateReceipt}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5">
            <h3 className="font-bold text-sm text-slate-900 mb-3">{t.addNewCustomer}</h3>

            <form onSubmit={handleSaveQuickCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  {t.customerName} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: সমীর বর্মণ"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  {t.customerMobile}
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="১০ অঙ্কের মোবাইল নম্বর"
                  value={newCustMobile}
                  onChange={(e) => setNewCustMobile(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  {t.customerAddressNotes}
                </label>
                <textarea
                  rows={2}
                  placeholder="গ্রাম বা এলাকার নাম..."
                  value={newCustNotes}
                  onChange={(e) => setNewCustNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
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
  );
};
