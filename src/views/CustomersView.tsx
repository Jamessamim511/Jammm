import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Phone,
  FileText,
  AlertCircle,
  Eye,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { Customer, Invoice, Language } from '../types';
import { db, formatINR } from '../db/storage';
import { translations } from '../utils/i18n';

interface CustomersViewProps {
  customers: Customer[];
  invoices: Invoice[];
  lang: Language;
  onCustomersUpdated: () => void;
  onViewInvoiceReceipt: (invoice: Invoice) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  invoices,
  lang,
  onCustomersUpdated,
  onViewInvoiceReceipt,
}) => {
  const t = translations[lang];

  const [search, setSearch] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // New customer form
  const [name, setName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase().trim();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      (c.mobile && c.mobile.includes(q)) ||
      c.customerCode.toLowerCase().includes(q)
    );
  });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCust: Customer = {
      id: 'cust-' + Date.now(),
      customerCode: `CUST-${1000 + customers.length + 1}`,
      name: name.trim(),
      mobile: mobile.trim() || undefined,
      notes: notes.trim() || undefined,
      totalBilled: 0,
      totalPaid: 0,
      balance: 0,
      createdAt: new Date().toISOString(),
    };

    db.saveCustomer(newCust);
    setName('');
    setMobile('');
    setNotes('');
    setShowAddModal(false);
    onCustomersUpdated();
  };

  const getCustomerInvoices = (customerId: string) => {
    return invoices.filter((i) => i.customerId === customerId);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-900" />
            <span>{t.navCustomers}</span>
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-900 font-bold rounded-full">
              {customers.length} জন
            </span>
          </h1>
          <p className="text-xs text-slate-500 font-bengali">
            গ্রাহক তালিকা, বকেয়া হিসাব এবং লেনদেন খতিয়ান
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t.addNewCustomer}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={t.searchCustomerPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>
      </div>

      {/* Customer List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-600 text-xs">
            কোনো গ্রাহক পাওয়া যায়নি
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-3 px-4">আইডি</th>
                  <th className="py-3 px-4">গ্রাহকের নাম ও ঠিকানা</th>
                  <th className="py-3 px-4">মোবাইল নম্বর</th>
                  <th className="py-3 px-4 text-right">মোট বিল</th>
                  <th className="py-3 px-4 text-right">পরিশোধিত</th>
                  <th className="py-3 px-4 text-right">বর্তমান বাকি</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-900">
                      {c.customerCode}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      {c.notes && <div className="text-[11px] text-slate-600">{c.notes}</div>}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {c.mobile ? (
                        <span className="flex items-center gap-1 text-slate-700">
                          <Phone className="w-3 h-3 text-emerald-700" />
                          +91 {c.mobile}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatINR(c.totalBilled)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700">
                      {formatINR(c.totalPaid)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      <span
                        className={
                          c.balance > 0
                            ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200'
                            : 'text-slate-600'
                        }
                      >
                        {formatINR(c.balance)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-900" />
                        <span>খতিয়ান</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Detail & Invoice History Ledger Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono text-blue-900 font-bold">
                  {selectedCustomer.customerCode}
                </span>
                <h3 className="text-base font-bold text-slate-900">{selectedCustomer.name}</h3>
                {selectedCustomer.mobile && (
                  <p className="text-xs text-slate-500 font-mono">+91 {selectedCustomer.mobile}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded bg-slate-100"
              >
                {t.close}
              </button>
            </div>

            {/* Financial Summary Strip */}
            <div className="grid grid-cols-3 gap-2 my-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <div className="text-[10px] text-slate-500 font-bold">{t.totalBilledAmount}</div>
                <div className="text-sm sm:text-base font-black font-mono text-slate-900 mt-0.5">
                  {formatINR(selectedCustomer.totalBilled)}
                </div>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <div className="text-[10px] text-emerald-800 font-bold">{t.totalVerifiedPaid}</div>
                <div className="text-sm sm:text-base font-black font-mono text-emerald-700 mt-0.5">
                  {formatINR(selectedCustomer.totalPaid)}
                </div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
                <div className="text-[10px] text-amber-800 font-bold">{t.currentBalance}</div>
                <div className="text-sm sm:text-base font-black font-mono text-amber-700 mt-0.5">
                  {formatINR(selectedCustomer.balance)}
                </div>
              </div>
            </div>

            {/* Invoice History */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2">{t.customerHistory}</h4>
              {getCustomerInvoices(selectedCustomer.id).length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
                  এখনো কোনো বিল তৈরি হয়নি
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {getCustomerInvoices(selectedCustomer.id).map((inv) => (
                    <div
                      key={inv.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="font-mono font-bold text-blue-900">{inv.invoiceNumber}</div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(inv.createdAt).toLocaleDateString('bn-IN')} ·{' '}
                          {inv.items.map((i) => i.serviceNameBn).join(', ')}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-900">
                          {formatINR(inv.totalAmount)}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          জমা: ₹{inv.paidAmount.toFixed(2)} · বাকি: ₹{inv.balance.toFixed(2)}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedCustomer(null);
                          onViewInvoiceReceipt(inv);
                        }}
                        className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-[11px] font-bold text-slate-700 shrink-0"
                      >
                        রশিদ
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5">
            <h3 className="font-bold text-sm text-slate-900 mb-3">{t.addNewCustomer}</h3>

            <form onSubmit={handleAddCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  {t.customerName} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: সমীর সরকার"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  {t.customerAddressNotes}
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: বেলকুড়িয়া, কৃষক কার্ড বা অন্যান্য বিবরণ..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
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
    </div>
  );
};
