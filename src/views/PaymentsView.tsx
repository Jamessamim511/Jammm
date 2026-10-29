import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { Language, PaymentRecord, User } from '../types';
import { formatINR } from '../db/storage';
import { translations } from '../utils/i18n';

interface PaymentsViewProps {
  currentUser: User;
  payments: PaymentRecord[];
  lang: Language;
  onVerifyPayment: (paymentId: string) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  currentUser,
  payments,
  lang,
  onVerifyPayment,
}) => {
  const t = translations[lang];

  const [search, setSearch] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'verified'>('all');
  const [methodFilter, setMethodFilter] = useState<'all' | 'cash' | 'upi'>('all');

  const filtered = payments.filter((p) => {
    const matchesStatus =
      filterType === 'all' ||
      (filterType === 'pending' && p.verificationStatus === 'pending') ||
      (filterType === 'verified' && p.verificationStatus === 'verified');

    const matchesMethod = methodFilter === 'all' || p.method === methodFilter;

    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.invoiceNumber.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q) ||
      (p.transactionRef && p.transactionRef.toLowerCase().includes(q));

    return matchesStatus && matchesMethod && matchesSearch;
  });

  const pendingCount = payments.filter((p) => p.verificationStatus === 'pending').length;

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-900" />
            <span>{t.paymentLedger}</span>
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-900 font-bold rounded-full">
              {payments.length} টি এন্ট্রি
            </span>
          </h1>
          <p className="text-xs text-slate-500 font-bengali">
            আদায়কৃত নগদ ও অনলাইন ইউপিআই পেমেন্টের সম্পূর্ণ ব্যাংক লেজার
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="px-3.5 py-2 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-2 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>{pendingCount}</strong> টি ইউপিআই পেমেন্ট ব্যাংক যাচাই অপেক্ষমান
            </span>
          </div>
        )}
      </div>

      {/* Search & Tabs */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="বিল নম্বর, গ্রাহকের নাম বা রেফারেন্স আইডি খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Status Filter */}
          <div className="flex gap-1.5 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              সব পেমেন্ট ({payments.length})
            </button>
            <button
              onClick={() => setFilterType('pending')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                filterType === 'pending'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              যাচাই অপেক্ষমান ({pendingCount})
            </button>
            <button
              onClick={() => setFilterType('verified')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                filterType === 'verified'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              যাচাইকৃত
            </button>
          </div>

          {/* Method Filter */}
          <div className="flex gap-1 text-xs">
            <button
              onClick={() => setMethodFilter('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${
                methodFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              সকল মাধ্যম
            </button>
            <button
              onClick={() => setMethodFilter('cash')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${
                methodFilter === 'cash' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              নগদ (Cash)
            </button>
            <button
              onClick={() => setMethodFilter('upi')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${
                methodFilter === 'upi' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              ইউপিআই (UPI)
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-600 text-xs">
            কোনো পেমেন্ট রেকর্ড পাওয়া যায়নি
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-3 px-4">তারিখ ও সময়</th>
                  <th className="py-3 px-4">বিল নম্বর</th>
                  <th className="py-3 px-4">কাস্টমার</th>
                  <th className="py-3 px-4">পদ্ধতি ও তথ্য</th>
                  <th className="py-3 px-4 text-right">পরিমাণ (₹)</th>
                  <th className="py-3 px-4 text-center">যাচাই অবস্থা</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                      {new Date(pay.date).toLocaleDateString('bn-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      <div className="text-[10px] text-slate-600 font-sans">
                        স্টাফ: {pay.recordedByUserName}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                      {pay.invoiceNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{pay.customerName}</div>
                      {pay.notes && <div className="text-[10px] text-slate-600">{pay.notes}</div>}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold uppercase text-slate-800">
                        {pay.method === 'cash' ? '💵 নগদ (Cash)' : '📱 ইউপিআই (UPI)'}
                      </span>
                      {pay.transactionRef && (
                        <div className="text-[10px] font-mono text-slate-600">
                          Ref: {pay.transactionRef}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-base text-emerald-700">
                      {formatINR(pay.amount)}
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {pay.verificationStatus === 'verified' ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> যাচাইকৃত
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <Clock className="w-3 h-3" /> যাচাই বাকি
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {pay.verificationStatus === 'pending' &&
                        currentUser.permissions.canVerifyPayments && (
                          <button
                            onClick={() => onVerifyPayment(pay.id)}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center gap-1 ml-auto shadow-sm transition-colors"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            যাচাই সম্পন্ন
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
