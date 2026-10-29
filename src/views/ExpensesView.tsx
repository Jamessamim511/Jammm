import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Calendar,
  Search,
  Filter,
  DollarSign,
  TrendingDown,
} from 'lucide-react';
import { Expense, ExpenseCategory, Language, User } from '../types';
import { db, formatINR } from '../db/storage';
import { translations } from '../utils/i18n';

interface ExpensesViewProps {
  currentUser: User;
  expenses: Expense[];
  lang: Language;
  onExpensesUpdated: () => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  currentUser,
  expenses,
  lang,
  onExpensesUpdated,
}) => {
  const t = translations[lang];

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [category, setCategory] = useState<ExpenseCategory>('paper_supplies');
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Filters
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | 'all'>('all');

  const filtered = expenses.filter((e) => {
    return filterCategory === 'all' || e.category === filterCategory;
  });

  const totalExpense = filtered.reduce((sum, e) => sum + e.amount, 0);

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    const newExp: Expense = {
      id: 'exp-' + Date.now(),
      category,
      amount: Math.max(0, amount),
      date: new Date(date).toISOString(),
      notes: notes.trim() || 'সাধারণ দোকান খরচ',
      createdByUserId: currentUser.id,
      createdByUserName: currentUser.name,
      createdAt: new Date().toISOString(),
      syncStatus: 'pending',
    };

    db.saveExpense(newExp);
    setAmount(0);
    setNotes('');
    setShowAddModal(false);
    onExpensesUpdated();
  };

  const categoryNames: Record<ExpenseCategory, string> = {
    internet: t.expInternet,
    electricity: t.expElectricity,
    paper_supplies: t.expPaperSupplies,
    maintenance: t.expMaintenance,
    other: t.expOther,
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-rose-700" />
            <span>{t.shopExpenses}</span>
            <span className="text-xs px-2 py-0.5 bg-rose-100 text-rose-900 font-bold rounded-full">
              {expenses.length} টি
            </span>
          </h1>
          <p className="text-xs text-slate-500 font-bengali">
            কাগজ, প্রিন্টিং কালি, বিদ্যুৎ, ইন্টারনেট ও রক্ষণাবেক্ষণের পরিচালন খরচ
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addExpense}</span>
        </button>
      </div>

      {/* Summary KPI Card */}
      <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            নির্বাচিত খরচের সর্বমোট
          </span>
          <div className="text-3xl font-black font-mono text-rose-700 mt-1">
            {formatINR(totalExpense)}
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
          <TrendingDown className="w-6 h-6" />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex gap-1.5 overflow-x-auto text-xs no-scrollbar">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            filterCategory === 'all'
              ? 'bg-rose-700 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          সব খাতের খরচ
        </button>
        {(['paper_supplies', 'internet', 'electricity', 'maintenance', 'other'] as ExpenseCategory[]).map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-rose-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {categoryNames[cat]}
            </button>
          )
        )}
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-600 text-xs">
            কোনো খরচের রেকর্ড পাওয়া যায়নি
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-3 px-4">তারিখ</th>
                  <th className="py-3 px-4">খরচের খাত</th>
                  <th className="py-3 px-4">বিবরণ / নোটস</th>
                  <th className="py-3 px-4">রেকর্ডকারী</th>
                  <th className="py-3 px-4 text-right">পরিমাণ (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                      {new Date(exp.date).toLocaleDateString('bn-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {categoryNames[exp.category]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800">
                      {exp.notes}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {exp.createdByUserName}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-base text-rose-700">
                      {formatINR(exp.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5">
            <h3 className="font-bold text-sm text-slate-900 mb-3">{t.addExpense}</h3>

            <form onSubmit={handleSaveExpense} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  তারিখ
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-rose-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  {t.expenseCategory}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-rose-700 focus:outline-none"
                >
                  <option value="paper_supplies">{t.expPaperSupplies}</option>
                  <option value="internet">{t.expInternet}</option>
                  <option value="electricity">{t.expElectricity}</option>
                  <option value="maintenance">{t.expMaintenance}</option>
                  <option value="other">{t.expOther}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  {t.expenseAmount} (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  placeholder="যেমন: ৩৫০"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-base font-bold text-slate-900 focus:ring-2 focus:ring-rose-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  {t.expenseNotes}
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: জেরক্সের কাগজ ১ রিম ও প্রিন্টার কালি..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-700 focus:outline-none"
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
                  className="flex-1 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl"
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
