import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FilePlus,
  Receipt,
  Users,
  Layers,
  CreditCard,
  DollarSign,
  TrendingUp,
  Settings,
  Languages,
  QrCode,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';
import { db } from './db/storage';
import { BusinessInfo, Customer, Expense, Invoice, Language, PaymentRecord, Service, SyncQueueItem, User } from './types';
import { translations } from './utils/i18n';
import { ReceiptModal } from './components/ReceiptModal';
import { UpiQrModal } from './components/UpiQrModal';
import { DashboardView } from './views/DashboardView';
import { NewBillView } from './views/NewBillView';
import { InvoiceListView } from './views/InvoiceListView';
import { CustomersView } from './views/CustomersView';
import { ServicesView } from './views/ServicesView';
import { PaymentsView } from './views/PaymentsView';
import { ExpensesView } from './views/ExpensesView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  const [lang, setLang] = useState<Language>('bn');
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Core State
  const [currentUser, setCurrentUser] = useState<User>(() => {
    db.initDatabase();
    return db.getCurrentUser();
  });
  const [business, setBusiness] = useState<BusinessInfo>(() => db.getBusinessInfo());
  const [users, setUsers] = useState<User[]>(() => db.getUsers());
  const [services, setServices] = useState<Service[]>(() => db.getServices());
  const [customers, setCustomers] = useState<Customer[]>(() => db.getCustomers());
  const [invoices, setInvoices] = useState<Invoice[]>(() => db.getInvoices());
  const [payments, setPayments] = useState<PaymentRecord[]>(() => db.getPayments());
  const [expenses, setExpenses] = useState<Expense[]>(() => db.getExpenses());
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(() => db.getSyncQueue());
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => db.getLastSyncTime());

  // Modal states
  const [receiptModalInvoice, setReceiptModalInvoice] = useState<Invoice | null>(null);
  const [qrModalData, setQrModalData] = useState<{
    isOpen: boolean;
    amount?: number;
    invoiceNumber?: string;
    note?: string;
    isStatic?: boolean;
    paymentIdToVerify?: string;
  }>({ isOpen: false });

  // Refresh all state from local DB
  const refreshData = () => {
    setBusiness(db.getBusinessInfo());
    setUsers(db.getUsers());
    setCurrentUser(db.getCurrentUser());
    setServices(db.getServices());
    setCustomers(db.getCustomers());
    setInvoices(db.getInvoices());
    setPayments(db.getPayments());
    setExpenses(db.getExpenses());
    setSyncQueue(db.getSyncQueue());
    setLastSyncTime(db.getLastSyncTime());
  };

  useEffect(() => {
    db.initDatabase();
    refreshData();
  }, []);

  const t = translations[lang];

  // Navigation Items (9 Bengali-First Items)
  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'new-bill', label: t.navNewBill, icon: FilePlus, highlight: true },
    { id: 'invoices', label: t.navInvoiceList, icon: Receipt },
    { id: 'customers', label: t.navCustomers, icon: Users },
    { id: 'services', label: t.navServices, icon: Layers },
    { id: 'payments', label: t.navPayments, icon: CreditCard },
    { id: 'expenses', label: t.navExpenses, icon: DollarSign },
    { id: 'reports', label: t.navReports, icon: TrendingUp },
    { id: 'settings', label: t.navSettings, icon: Settings },
  ];

  // Quick verify handler
  const handleVerifyPayment = (paymentId: string) => {
    db.verifyPayment(paymentId, currentUser.id, currentUser.name);
    refreshData();
  };

  // Cloud sync handler
  const handleTriggerSync = async () => {
    await db.performCloudSync();
    refreshData();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Contract (Zone 1: Wordmark, Zone 2: Nav items, Zone 3: Actions) */}
      <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-left flex items-center gap-2 group"
            >
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={business.name}
                  className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 shadow-md border border-amber-400/30 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm font-sans shadow-md shrink-0">
                  SO
                </div>
              )}
              <div>
                <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-amber-300 transition-colors whitespace-nowrap">
                  {lang === 'bn' ? business.bengaliName : business.name}
                </span>
                <span className="hidden sm:inline-block text-[11px] text-slate-400 ml-1.5 font-normal">
                  {business.type}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Language toggle, User Role & Mobile Hamburger) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold flex items-center gap-1 text-slate-200 transition-colors"
              title="Switch Language"
            >
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'bn' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* Quick Static QR Trigger */}
            <button
              onClick={() =>
                setQrModalData({
                  isOpen: true,
                  isStatic: true,
                })
              }
              className="hidden sm:flex p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 transition-colors"
              title="Shop UPI QR"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* User Indicator */}
            <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-slate-800 text-xs">
              <span className="text-[11px] text-slate-400">
                {currentUser.role === 'owner' ? 'মালিক' : 'স্টাফ'}:
              </span>
              <span className="font-bold text-amber-300 truncate max-w-[120px]">
                {currentUser.name}
              </span>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden pt-3 pb-2 border-t border-slate-800 mt-2 space-y-1">
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-2 text-left transition-colors ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
        {currentView === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            business={business}
            invoices={invoices}
            payments={payments}
            expenses={expenses}
            syncPendingCount={syncQueue.length}
            lastSyncTime={lastSyncTime}
            lang={lang}
            onNavigate={(view) => setCurrentView(view)}
            onViewInvoiceReceipt={(inv) => setReceiptModalInvoice(inv)}
            onShowInvoiceQr={(inv) =>
              setQrModalData({
                isOpen: true,
                amount: inv.balance > 0 ? inv.balance : inv.totalAmount,
                invoiceNumber: inv.invoiceNumber,
                note: `Bill ${inv.invoiceNumber} Shiza Online`,
                paymentIdToVerify: payments.find((p) => p.invoiceId === inv.id)?.id,
              })
            }
            onShowStaticQr={() => setQrModalData({ isOpen: true, isStatic: true })}
            onQuickVerifyPayment={handleVerifyPayment}
          />
        )}

        {currentView === 'new-bill' && (
          <NewBillView
            currentUser={currentUser}
            business={business}
            services={services}
            customers={customers}
            lang={lang}
            onInvoiceCreated={(newInv) => {
              refreshData();
              setReceiptModalInvoice(newInv);
            }}
            onShowDynamicQr={(invData) =>
              setQrModalData({
                isOpen: true,
                amount: invData.amount,
                invoiceNumber: invData.invoiceNumber,
                note: `Bill ${invData.invoiceNumber} Shiza Online`,
              })
            }
            onCustomerAdded={() => refreshData()}
          />
        )}

        {currentView === 'invoices' && (
          <InvoiceListView
            currentUser={currentUser}
            invoices={invoices}
            lang={lang}
            onViewReceipt={(inv) => setReceiptModalInvoice(inv)}
            onShowQr={(inv) =>
              setQrModalData({
                isOpen: true,
                amount: inv.balance > 0 ? inv.balance : inv.totalAmount,
                invoiceNumber: inv.invoiceNumber,
                note: `Bill ${inv.invoiceNumber} Shiza Online`,
              })
            }
            onInvoicesUpdated={() => refreshData()}
          />
        )}

        {currentView === 'customers' && (
          <CustomersView
            customers={customers}
            invoices={invoices}
            lang={lang}
            onCustomersUpdated={() => refreshData()}
            onViewInvoiceReceipt={(inv) => setReceiptModalInvoice(inv)}
          />
        )}

        {currentView === 'services' && (
          <ServicesView
            currentUser={currentUser}
            services={services}
            lang={lang}
            onServicesUpdated={() => refreshData()}
          />
        )}

        {currentView === 'payments' && (
          <PaymentsView
            currentUser={currentUser}
            payments={payments}
            lang={lang}
            onVerifyPayment={handleVerifyPayment}
          />
        )}

        {currentView === 'expenses' && (
          <ExpensesView
            currentUser={currentUser}
            expenses={expenses}
            lang={lang}
            onExpensesUpdated={() => refreshData()}
          />
        )}

        {currentView === 'reports' && (
          <ReportsView
            currentUser={currentUser}
            business={business}
            invoices={invoices}
            payments={payments}
            expenses={expenses}
            lang={lang}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView
            currentUser={currentUser}
            business={business}
            users={users}
            services={services}
            syncQueue={syncQueue}
            lastSyncTime={lastSyncTime}
            lang={lang}
            onBusinessUpdated={(updated) => {
              setBusiness(updated);
              refreshData();
            }}
            onUsersUpdated={() => refreshData()}
            onServicesUpdated={() => refreshData()}
            onThemeUpdated={() => refreshData()}
            onLanguageChanged={(newLang) => setLang(newLang)}
            onSwitchUser={(userId) => {
              db.setCurrentUser(userId);
              refreshData();
            }}
            onTriggerSync={handleTriggerSync}
            onShowStaticQr={() => setQrModalData({ isOpen: true, isStatic: true })}
          />
        )}
      </main>

      {/* Mobile Ergonomic Bottom Tab Navigation (Natural Thumb Zone) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5">
        <div className="grid grid-cols-5 items-center text-center">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              currentView === 'dashboard' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">ড্যাশবোর্ড</span>
          </button>

          <button
            onClick={() => setCurrentView('invoices')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              currentView === 'invoices' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Receipt className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">বিল সমূহ</span>
          </button>

          {/* Elevated Center Primary Action: New Bill */}
          <button
            onClick={() => setCurrentView('new-bill')}
            className="flex flex-col items-center justify-center -mt-4 group"
          >
            <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/30 group-active:scale-95 transition-transform">
              <FilePlus className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-amber-300 mt-0.5">নতুন বিল</span>
          </button>

          <button
            onClick={() => setCurrentView('customers')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              currentView === 'customers' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">কাস্টমার</span>
          </button>

          <button
            onClick={() => setCurrentView('settings')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              currentView === 'settings' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">সেটিংস</span>
          </button>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {receiptModalInvoice && (
        <ReceiptModal
          invoice={receiptModalInvoice}
          business={business}
          onClose={() => setReceiptModalInvoice(null)}
          lang={lang}
        />
      )}

      {/* Dynamic & Static UPI QR Modal */}
      {qrModalData.isOpen && (
        <UpiQrModal
          upiId={business.upiId}
          merchantName={business.upiMerchantName}
          amount={qrModalData.amount}
          invoiceNumber={qrModalData.invoiceNumber}
          note={qrModalData.note}
          isOpen={qrModalData.isOpen}
          onClose={() => setQrModalData({ isOpen: false })}
          canVerify={currentUser.permissions.canVerifyPayments}
          onVerifyPayment={() => {
            if (qrModalData.paymentIdToVerify) {
              handleVerifyPayment(qrModalData.paymentIdToVerify);
            }
          }}
          lang={lang}
        />
      )}
    </div>
  );
}
