import React, { useState } from 'react';
import {
  Search,
  Filter,
  Printer,
  QrCode,
  AlertCircle,
  CheckCircle2,
  XCircle,
  CreditCard,
  UserCheck,
} from 'lucide-react';
import { Invoice, Language, PaymentStatus, User } from '../types';
import { db, formatINR } from '../db/storage';
import { translations } from '../utils/i18n';

interface InvoiceListViewProps {
  currentUser: User;
  invoices: Invoice[];
  lang: Language;
  onViewReceipt: (invoice: Invoice) => void;
  onShowQr: (invoice: Invoice) => void;
  onInvoicesUpdated: () => void;
}

export const InvoiceListView: React.FC<InvoiceListViewProps> = ({
  currentUser,
  invoices,
  lang,
  onViewReceipt,
  onShowQr,
  onInvoicesUpdated,
}) => {
  const t = translations[lang];

  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi'>('cash');
  const [cancelModalInvoice, setCancelModalInvoice] = useState<Invoice | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');

  // Filter invoices
  const filtered = invoices.filter((inv) => {
    const matchesStatus = statusFilter === 'all' || inv.paymentStatus === statusFilter;
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      inv.invoiceNumber.toLowerCase().includes(query) ||
      inv.customerName.toLowerCase().includes(query) ||
      (inv.customerMobile && inv.customerMobile.includes(query));
    return matchesStatus && matchesSearch;
  });

  // Handle Recording Payment for Due Invoice
  const handleSavePaymentForInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPayment || paymentAmount <= 0) return;

    const nowIso = new Date().toISOString();
    const newPayment = {
      id: 'pay-' + Date.now(),
      invoiceId: selectedInvoiceForPayment.id,
      invoiceNumber: selectedInvoiceForPayment.invoiceNumber,
      customerId: selectedInvoiceForPayment.customerId,
      customerName: selectedInvoiceForPayment.customerName,
      amount: paymentAmount,
      method: paymentMethod,
      verificationStatus: (paymentMethod === 'cash' ? 'verified' : 'pending') as 'verified' | 'pending',
      recordedByUserId: currentUser.id,
      recordedByUserName: currentUser.name,
      date: nowIso,
      notes: `বকেয়া জমা: ${paymentMethod === 'cash' ? 'নগদ' : 'UPI'}`,
      syncStatus: 'pending' as const,
    };

    db.savePayment(newPayment);
    setSelectedInvoiceForPayment(null);
    setPaymentAmount(0);
    onInvoicesUpdated();
  };

  // Handle Cancellation (Audited workflow)
  const handleConfirmCancelInvoice = () => {
    if (!cancelModalInvoice || !currentUser.permissions.canCancelInvoices) return;

    const nowIso = new Date().toISOString();
    cancelModalInvoice.paymentStatus = 'cancelled';
    cancelModalInvoice.updatedAt = nowIso;
    cancelModalInvoice.auditTrail.push({
      id: 'aud-' + Date.now(),
      timestamp: nowIso,
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'CANCELLED',
      details: `Invoice cancelled by ${currentUser.name}. Reason: ${cancelReason || 'Customer requested cancel'}`,
    });

    db.saveInvoice(cancelModalInvoice);
    setCancelModalInvoice(null);
    setCancelReason('');
    onInvoicesUpdated();
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{t.navInvoiceList}</span>
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-900 font-bold rounded-full">
              {filtered.length} টি
            </span>
          </h1>
          <p className="text-xs text-slate-500 font-bengali">
            সকল ডিজিটাল ক্যাশ মেমো, পেমেন্ট অবস্থা এবং রশিদের বিবরণ
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="বিল নম্বর (SO-2026-...), কাস্টমারের নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              statusFilter === 'all'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            সব বিল ({invoices.length})
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              statusFilter === 'paid'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            পরিশোধিত
          </button>
          <button
            onClick={() => setStatusFilter('partially_paid')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              statusFilter === 'partially_paid'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            আংশিক পরিশোধ
          </button>
          <button
            onClick={() => setStatusFilter('pending_verification')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              statusFilter === 'pending_verification'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            যাচাই অপেক্ষমান
          </button>
          <button
            onClick={() => setStatusFilter('unpaid')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              statusFilter === 'unpaid'
                ? 'bg-red-700 text-white shadow-sm'
                : 'bg-red-50 text-red-800 hover:bg-red-100'
            }`}
          >
            বকেয়া (Due)
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              statusFilter === 'cancelled'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            বাতিলকৃত
          </button>
        </div>
      </div>

      {/* Invoices List Table & Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-600 text-xs">
            কোনো বিল পাওয়া যায়নি
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-3 px-4">বিল নম্বর ও তারিখ</th>
                  <th className="py-3 px-4">কাস্টমার তথ্য</th>
                  <th className="py-3 px-4">পরিষেবা সমূহ</th>
                  <th className="py-3 px-4 text-right">মোট টাকা</th>
                  <th className="py-3 px-4 text-right">জমা</th>
                  <th className="py-3 px-4 text-right">বাকি</th>
                  <th className="py-3 px-4 text-center">অবস্থা</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    {/* Invoice Number & Date */}
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                      <div>{inv.invoiceNumber}</div>
                      <div className="text-[10px] text-slate-600 font-sans font-normal mt-0.5">
                        {new Date(inv.createdAt).toLocaleDateString('bn-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{inv.customerName}</div>
                      {inv.customerMobile && (
                        <div className="text-[10px] text-slate-600 font-mono mt-0.5">
                          {inv.customerMobile}
                        </div>
                      )}
                    </td>

                    {/* Items preview */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-slate-800 line-clamp-1">
                        {inv.items.map((i) => `${i.serviceNameBn} (${i.quantity})`).join(', ')}
                      </div>
                      <div className="text-[10px] text-slate-600 mt-0.5">
                        স্টাফ: {inv.createdByUserName}
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-950">
                      {formatINR(inv.totalAmount)}
                    </td>

                    {/* Paid Amount */}
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-semibold">
                      {formatINR(inv.paidAmount)}
                      <div className="text-[10px] text-slate-600 uppercase font-sans">
                        {inv.paymentMethod}
                      </div>
                    </td>

                    {/* Balance */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      <span className={inv.balance > 0 ? 'text-amber-700' : 'text-slate-600'}>
                        {formatINR(inv.balance)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {inv.paymentStatus === 'paid' && (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          পরিশোধিত
                        </span>
                      )}
                      {inv.paymentStatus === 'partially_paid' && (
                        <span className="text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          আংশিক জমা
                        </span>
                      )}
                      {inv.paymentStatus === 'pending_verification' && (
                        <span className="text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          যাচাই বাকি
                        </span>
                      )}
                      {inv.paymentStatus === 'unpaid' && (
                        <span className="text-red-700 font-bold bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                          বকেয়া রয়েছে
                        </span>
                      )}
                      {inv.paymentStatus === 'cancelled' && (
                        <span className="text-slate-600 line-through font-bold bg-slate-100 px-2.5 py-1 rounded-full">
                          বাতিল
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {/* Receipt Button */}
                        <button
                          onClick={() => onViewReceipt(inv)}
                          className="p-1.5 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Print / View Receipt"
                        >
                          <Printer className="w-4 h-4 text-slate-700" />
                        </button>

                        {/* UPI QR Button */}
                        <button
                          onClick={() => onShowQr(inv)}
                          className="p-1.5 text-blue-800 hover:text-blue-950 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Dynamic UPI QR"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        {/* Pay Due Button if invoice has balance */}
                        {inv.balance > 0 && inv.paymentStatus !== 'cancelled' && (
                          <button
                            onClick={() => {
                              setSelectedInvoiceForPayment(inv);
                              setPaymentAmount(inv.balance);
                            }}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg font-bold text-[11px] flex items-center gap-1"
                            title="Record Payment"
                          >
                            <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                            জমা নিন
                          </button>
                        )}

                        {/* Cancel Invoice (Audited, Owner only) */}
                        {currentUser.permissions.canCancelInvoices &&
                          inv.paymentStatus !== 'cancelled' && (
                            <button
                              onClick={() => setCancelModalInvoice(inv)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancel Invoice (Audited)"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment on Due Invoice Modal */}
      {selectedInvoiceForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5">
            <h3 className="font-bold text-sm text-slate-900 mb-2">
              বকেয়া জমা নিন: {selectedInvoiceForPayment.invoiceNumber}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              গ্রাহক: <strong>{selectedInvoiceForPayment.customerName}</strong> · বর্তমান বাকি:{' '}
              <strong className="text-amber-800 font-mono">
                {formatINR(selectedInvoiceForPayment.balance)}
              </strong>
            </p>

            <form onSubmit={handleSavePaymentForInvoice} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  জমার পরিমাণ (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedInvoiceForPayment.balance}
                  step="1"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">পেমেন্ট মাধ্যম</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-2 px-3 rounded-xl font-bold transition-colors ${
                      paymentMethod === 'cash'
                        ? 'bg-blue-900 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    নগদ (Cash)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2 px-3 rounded-xl font-bold transition-colors ${
                      paymentMethod === 'upi'
                        ? 'bg-blue-900 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    ইউপিআই (UPI)
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForPayment(null)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl"
                >
                  জমা নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Invoice Audit Modal */}
      {cancelModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">বিল বাতিলের অডিট যাচাই</h3>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              আপনি কি নিশ্চিতভাবে বিল <strong>{cancelModalInvoice.invoiceNumber}</strong> বাতিল
              করতে চান? এই কার্যক্রমটি অডিট লগে স্থায়ীভাবে রেকর্ড হবে।
            </p>

            <div className="mb-4">
              <label className="block text-slate-600 font-semibold mb-1 text-xs">
                বাতিলের কারণ লিখুন *
              </label>
              <textarea
                rows={2}
                required
                placeholder="যেমন: ভুল পরিষেবা এন্ট্রি বা গ্রাহক বাতিল চেয়েছেন..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCancelModalInvoice(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                না, ফিরে যান
              </button>
              <button
                type="button"
                disabled={!cancelReason.trim()}
                onClick={handleConfirmCancelInvoice}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs disabled:opacity-50"
              >
                হ্যাঁ, বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
