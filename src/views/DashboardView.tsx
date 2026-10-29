import React, { useState } from 'react';
import {
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Users,
  CreditCard,
  PlusCircle,
  QrCode,
  ArrowRight,
  Clock,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { BusinessInfo, Invoice, Language, PaymentRecord, User } from '../types';
import { formatINR, toPaise, toRupees } from '../db/storage';
import { translations } from '../utils/i18n';

interface DashboardViewProps {
  currentUser: User;
  business: BusinessInfo;
  invoices: Invoice[];
  payments: PaymentRecord[];
  expenses: { amount: number; date: string }[];
  syncPendingCount: number;
  lastSyncTime: string;
  lang: Language;
  onNavigate: (view: string) => void;
  onViewInvoiceReceipt: (invoice: Invoice) => void;
  onShowInvoiceQr: (invoice: Invoice) => void;
  onShowStaticQr: () => void;
  onQuickVerifyPayment: (paymentId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  business,
  invoices,
  payments,
  expenses,
  syncPendingCount,
  lastSyncTime,
  lang,
  onNavigate,
  onViewInvoiceReceipt,
  onShowInvoiceQr,
  onShowStaticQr,
  onQuickVerifyPayment,
}) => {
  const t = translations[lang];
  const [filterTodayOnly] = useState<boolean>(true);

  // Calculate Today's Stats
  const todayStr = new Date().toISOString().split('T')[0];

  const todayInvoices = invoices.filter(
    (inv) => inv.createdAt.startsWith(todayStr) && inv.paymentStatus !== 'cancelled'
  );

  const todayBilledRupees = toRupees(
    todayInvoices.reduce((sum, inv) => sum + toPaise(inv.totalAmount), 0)
  );

  // Today's Verified Collections (Real money in hand!)
  const todayVerifiedPayments = payments.filter(
    (p) => p.date.startsWith(todayStr) && p.verificationStatus === 'verified'
  );
  const todayCollectedRupees = toRupees(
    todayVerifiedPayments.reduce((sum, p) => sum + toPaise(p.amount), 0)
  );

  // Outstanding Customer Due (Across all non-cancelled invoices)
  const totalOutstandingDueRupees = toRupees(
    invoices
      .filter((inv) => inv.paymentStatus !== 'cancelled')
      .reduce((sum, inv) => sum + toPaise(inv.balance), 0)
  );

  // Today's Expenses
  const todayExpensesRupees = toRupees(
    expenses
      .filter((exp) => exp.date.startsWith(todayStr))
      .reduce((sum, exp) => sum + toPaise(exp.amount), 0)
  );

  // Estimated Real Net Profit Today = Actual Verified Collections - Actual Expenses
  const estimatedNetProfitToday = Math.max(0, todayCollectedRupees - todayExpensesRupees);

  // Pending verification payments
  const pendingPayments = payments.filter((p) => p.verificationStatus === 'pending');

  // Monthly summary
  const currentMonthStr = todayStr.substring(0, 7);
  const monthInvoices = invoices.filter(
    (inv) => inv.createdAt.startsWith(currentMonthStr) && inv.paymentStatus !== 'cancelled'
  );
  const monthBilledRupees = toRupees(
    monthInvoices.reduce((sum, inv) => sum + toPaise(inv.totalAmount), 0)
  );
  const monthCollectedRupees = toRupees(
    payments
      .filter((p) => p.date.startsWith(currentMonthStr) && p.verificationStatus === 'verified')
      .reduce((sum, p) => sum + toPaise(p.amount), 0)
  );

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Top Banner & Shop Identity */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={business.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-contain bg-white/95 p-1.5 shadow-lg border-2 border-amber-400/40 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl sm:text-2xl shadow-lg border-2 border-white/20 shrink-0">
                SO
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-extrabold tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                  CSC / Digital Centre
                </span>
                <span className="text-xs text-slate-300">
                  {currentUser.role === 'owner' ? t.ownerRole : t.staffRole}:{' '}
                  <strong className="text-white">{currentUser.name}</strong>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black mt-1 tracking-tight text-white font-bengali">
                {business.bengaliName}
                <span className="text-sm sm:text-base font-normal text-amber-300 ml-2 font-sans">
                  ({business.name})
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 font-bengali">
                {business.address} · {business.contact}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('new-bill')}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-400/20 flex items-center gap-2 transition-transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              {t.navNewBill}
            </button>

            <button
              onClick={onShowStaticQr}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>দোকানের QR</span>
            </button>
          </div>
        </div>

        {/* Sync & Offline Status Strip */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>লোকাল মেমোরি: সম্পূর্ণ সচল ও সংরক্ষিত</span>
            {syncPendingCount > 0 ? (
              <span className="text-amber-300 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded text-[11px]">
                {syncPendingCount} টি সিঙ্ক অপেক্ষমান
              </span>
            ) : (
              <span className="text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded text-[11px]">
                ক্লাউড সিঙ্ক আপ-টু-ডেট
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-400">
            সর্বশেষ সিঙ্ক: {new Date(lastSyncTime).toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Financial Metric Cards Grid (60-30-10 palette with tabular figures) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Today's Total Invoices */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">{t.todayInvoices}</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums">
            {todayInvoices.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-600">
            আজকের সেবা প্রদান
          </div>
        </div>

        {/* Today's Billed Amount */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">{t.todayBilled}</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-slate-900 font-mono tabular-nums">
            {formatINR(todayBilledRupees)}
          </div>
          <div className="mt-1 text-[11px] text-slate-600">
            মোট তৈরিকৃত বিল
          </div>
        </div>

        {/* Today's Verified Collections */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-900">{t.todayCollected}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-emerald-700 font-mono tabular-nums">
            {formatINR(todayCollectedRupees)}
          </div>
          <div className="mt-1 text-[11px] text-emerald-800">
            নগদ ও ব্যাংক যাচাইকৃত
          </div>
        </div>

        {/* Outstanding Customer Due */}
        <div className="bg-white rounded-2xl p-4 border border-amber-200 bg-amber-50/20 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900">{t.outstandingDue}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-amber-700 font-mono tabular-nums">
            {formatINR(totalOutstandingDueRupees)}
          </div>
          <div className="mt-1 text-[11px] text-amber-800">
            গ্রাহকের বাকি টাকা
          </div>
        </div>
      </div>

      {/* Second Row: Profit/Loss & Monthly Breakdown (Owner & Staff permitted) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Real Net Profit Estimate Today */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">{t.netProfitEst}</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 font-mono tabular-nums text-blue-900">
              {formatINR(estimatedNetProfitToday)}
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              হিসেব: যাচাইকৃত জমা ({formatINR(todayCollectedRupees)}) - খরচ ({formatINR(todayExpensesRupees)})
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">{t.todayExpenses}:</span>
            <span className="font-mono font-bold text-red-600">{formatINR(todayExpensesRupees)}</span>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">{t.monthlyBilling}</span>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 font-mono tabular-nums">
              {formatINR(monthBilledRupees)}
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              চলতি মাসের মোট বিল সংখ্যা: {monthInvoices.length} টি
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">{t.monthlyCollected}:</span>
            <span className="font-mono font-bold text-emerald-600">{formatINR(monthCollectedRupees)}</span>
          </div>
        </div>

        {/* Pending UPI Payment Verification Notice */}
        <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm flex flex-col justify-between bg-gradient-to-br from-amber-50/30 to-white">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">{t.pendingVerification}</span>
              <ShieldCheck className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-amber-700 font-mono tabular-nums">
              {pendingPayments.length} <span className="text-sm font-normal">টি পেমেন্ট</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              ইউপিআই কিউআর দিয়ে পাঠানো পেমেন্ট যা ব্যাংকে চেক করতে হবে।
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-amber-100">
            <button
              onClick={() => onNavigate('payments')}
              className="text-xs font-bold text-amber-900 hover:text-amber-800 flex items-center gap-1"
            >
              যাচাই করতে ক্লিক করুন <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 mb-3">{t.quickActions}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <button
            onClick={() => onNavigate('new-bill')}
            className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 text-blue-900 text-left transition-colors flex flex-col gap-1.5"
          >
            <PlusCircle className="w-5 h-5 text-blue-700" />
            <span className="text-xs font-bold">{t.navNewBill}</span>
            <span className="text-[10px] text-blue-700/80">নতুন ক্যাশ মেমো</span>
          </button>

          <button
            onClick={() => onNavigate('customers')}
            className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-left transition-colors flex flex-col gap-1.5"
          >
            <Users className="w-5 h-5 text-slate-700" />
            <span className="text-xs font-bold">{t.navCustomers}</span>
            <span className="text-[10px] text-slate-600">খাতা ও বকেয়া</span>
          </button>

          <button
            onClick={() => onNavigate('payments')}
            className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 text-emerald-900 text-left transition-colors flex flex-col gap-1.5"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <span className="text-xs font-bold">{t.navPayments}</span>
            <span className="text-[10px] text-emerald-800">জমা ও ব্যাংক যাচাই</span>
          </button>

          <button
            onClick={() => onNavigate('expenses')}
            className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 text-rose-900 text-left transition-colors flex flex-col gap-1.5"
          >
            <CreditCard className="w-5 h-5 text-rose-700" />
            <span className="text-xs font-bold">{t.navExpenses}</span>
            <span className="text-[10px] text-rose-800">দোকানের খরচ</span>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-left transition-colors flex flex-col gap-1.5"
          >
            <TrendingUp className="w-5 h-5 text-slate-700" />
            <span className="text-xs font-bold">{t.navReports}</span>
            <span className="text-[10px] text-slate-600">লাভ-ক্ষতি ও খতিয়ান</span>
          </button>
        </div>
      </div>

      {/* Pending Payment Verification Spotlight Banner if any */}
      {pendingPayments.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-700" />
              <h3 className="font-bold text-amber-950 text-sm">
                অনলাইন ইউপিআই পেমেন্ট যাচাই প্রয়োজন ({pendingPayments.length} টি)
              </h3>
            </div>
            <button
              onClick={() => onNavigate('payments')}
              className="text-xs font-bold text-amber-900 underline"
            >
              সব দেখুন
            </button>
          </div>

          <div className="space-y-2 mt-2">
            {pendingPayments.slice(0, 2).map((pay) => (
              <div
                key={pay.id}
                className="bg-white p-3 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {pay.customerName} · বিল: {pay.invoiceNumber}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    রেফারেন্স: {pay.transactionRef || 'N/A'} · সময়: {new Date(pay.date).toLocaleTimeString()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-bold font-mono text-blue-900">
                    {formatINR(pay.amount)}
                  </span>
                  {currentUser.permissions.canVerifyPayments && (
                    <button
                      onClick={() => onQuickVerifyPayment(pay.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> যাচাই সম্পন্ন
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-slate-900">{t.recentInvoices}</h2>
            <span className="text-xs text-slate-600 font-mono">
              ({invoices.length} টি মোট বিল)
            </span>
          </div>
          <button
            onClick={() => onNavigate('invoices')}
            className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1"
          >
            {t.viewAll} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {invoices.length === 0 ? (
          <div className="p-8 text-center text-slate-600 text-xs">
            {t.noDataFound}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5 px-4">বিল নম্বর</th>
                  <th className="py-2.5 px-4">কাস্টমার</th>
                  <th className="py-2.5 px-4 text-right">মোট টাকা</th>
                  <th className="py-2.5 px-4 text-right">জমা</th>
                  <th className="py-2.5 px-4 text-right">বাকি</th>
                  <th className="py-2.5 px-4 text-center">অবস্থা</th>
                  <th className="py-2.5 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.slice(0, 6).map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-900">
                      {inv.invoiceNumber}
                      <div className="text-[10px] text-slate-600 font-normal">
                        {new Date(inv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div>{inv.customerName}</div>
                      {inv.customerMobile && (
                        <div className="text-[10px] text-slate-600 font-mono">
                          {inv.customerMobile}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatINR(inv.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-700 font-semibold">
                      {formatINR(inv.paidAmount)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      <span className={inv.balance > 0 ? 'text-amber-700' : 'text-slate-600'}>
                        {formatINR(inv.balance)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {inv.paymentStatus === 'paid' && (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          পরিশোধিত
                        </span>
                      )}
                      {inv.paymentStatus === 'partially_paid' && (
                        <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          আংশিক
                        </span>
                      )}
                      {inv.paymentStatus === 'pending_verification' && (
                        <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          যাচাই বাকি
                        </span>
                      )}
                      {inv.paymentStatus === 'unpaid' && (
                        <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          বাকি
                        </span>
                      )}
                      {inv.paymentStatus === 'cancelled' && (
                        <span className="text-slate-600 line-through font-bold bg-slate-100 px-2 py-0.5 rounded">
                          বাতিল
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewInvoiceReceipt(inv)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Receipt"
                        >
                          <Printer className="w-4 h-4 text-slate-700" />
                        </button>
                        <button
                          onClick={() => onShowInvoiceQr(inv)}
                          className="p-1.5 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Show Dynamic UPI QR"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      </div>
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
