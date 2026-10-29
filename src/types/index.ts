export type UserRole = 'owner' | 'staff';

export interface UserPermissions {
  canManageServices: boolean;
  canManageStaff: boolean;
  canViewFinancialReports: boolean;
  canCancelInvoices: boolean;
  canExportData: boolean;
  canVerifyPayments: boolean;
  canManageBranding: boolean;
  canManageShopProfile: boolean;
  canManagePricing: boolean;
  canOverridePrice: boolean;
  canManageThemes: boolean;
}

export interface User {
  id: string;
  name: string;
  username: string;
  pin: string;
  role: UserRole;
  permissions: UserPermissions;
  active: boolean;
  createdAt: string;
}

export interface BusinessInfo {
  name: string;
  bengaliName: string;
  type: string;
  address: string;
  contact: string;
  whatsapp?: string;
  ownerName: string;
  cscId?: string;
  tagline: string;
  openingHours: string;
  upiId: string;
  upiMerchantName: string;
  upiNote: string;
  logoUrl?: string;
  logoScale?: number;
  currency: string;
  // Invoice & Receipt Preferences
  showLogoOnReceipt?: boolean;
  showAddressOnReceipt?: boolean;
  showPhoneOnReceipt?: boolean;
  showOwnerOnReceipt?: boolean;
  showCscIdOnReceipt?: boolean;
  showQrOnReceipt?: boolean;
  invoiceHeaderText?: string;
  invoiceFooterText?: string;
}

export type ServiceCategory =
  | 'online'
  | 'government'
  | 'printing'
  | 'pvc_card'
  | 'recharge_bill'
  | 'tickets'
  | 'farmer'
  | 'other';

export type ServicePricingType = 'fixed' | 'variable' | 'unit_based';

export interface Service {
  id: string;
  category: ServiceCategory;
  nameEn: string;
  nameBn: string;
  descriptionBn?: string;
  descriptionEn?: string;
  defaultPrice: number; // in INR rupees
  pricingType: ServicePricingType;
  extraCharges?: number; // optional service-specific extra fee
  isFree?: boolean; // free of cost service
  unitEn: string; // e.g. "per page", "per application", "per copy"
  unitBn: string; // e.g. "প্রতি পাতা", "প্রতি আবেদন", "প্রতি কপি"
  imageUrl?: string;
  iconKey?: string;
  active: boolean;
  lastPriceChangeBy?: string;
  lastPriceChangeAt?: string;
  createdAt: string;
}

export interface PriceHistoryEntry {
  id: string;
  serviceId: string;
  serviceNameBn: string;
  oldPrice: number;
  newPrice: number;
  oldExtraCharges?: number;
  newExtraCharges?: number;
  changedByUserId: string;
  changedByUserName: string;
  changedAt: string;
  reason?: string;
}

export type ThemePreset =
  | 'professional_blue'
  | 'csc_green'
  | 'purple_modern'
  | 'dark_premium'
  | 'clean_white'
  | 'custom';

export type ButtonShape = 'rounded-xl' | 'rounded-full' | 'rounded-md';
export type CardRadius = 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
export type FontSizeScale = 'sm' | 'base' | 'lg';
export type ColorMode = 'light' | 'dark' | 'system';

export interface AppThemeConfig {
  preset: ThemePreset;
  colorMode: ColorMode;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  appBgColor: string;
  cardBgColor: string;
  textColor: string;
  buttonShape: ButtonShape;
  cardRadius: CardRadius;
  fontSize: FontSizeScale;
}

export interface Customer {
  id: string;
  customerCode: string; // e.g. "CUST-1001"
  name: string;
  mobile?: string;
  notes?: string;
  totalBilled: number;
  totalPaid: number;
  balance: number;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  serviceId: string;
  serviceNameBn: string;
  serviceNameEn: string;
  quantity: number;
  unitPrice: number; // locked at billing time
  extraCharges?: number;
  discount?: number;
  lineTotal: number;
  unitBn: string;
}

export type PaymentMethod = 'cash' | 'upi' | 'other';
export type PaymentStatus = 'paid' | 'partially_paid' | 'unpaid' | 'pending_verification' | 'cancelled' | 'refunded';

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
}

export interface Invoice {
  id: string; // UUID
  invoiceNumber: string; // e.g. "SO-2026-00001"
  customerId: string;
  customerName: string;
  customerMobile?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionRef?: string;
  createdByUserId: string;
  createdByUserName: string;
  createdAt: string;
  updatedAt: string;
  auditTrail: AuditEntry[];
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed';
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  transactionRef?: string;
  verificationStatus: 'verified' | 'pending';
  recordedByUserId: string;
  recordedByUserName: string;
  date: string;
  notes?: string;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed';
}

export type ExpenseCategory = 'internet' | 'electricity' | 'paper_supplies' | 'maintenance' | 'other';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  notes: string;
  createdByUserId: string;
  createdByUserName: string;
  createdAt: string;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed';
}

export interface SyncQueueItem {
  id: string;
  operation: 'create' | 'update' | 'delete';
  entity: 'invoice' | 'payment' | 'customer' | 'service' | 'expense';
  recordId: string;
  timestamp: string;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  retryCount: number;
  lastAttempt?: string;
  error?: string;
}

export type Language = 'bn' | 'en';
