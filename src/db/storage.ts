import {
  AppThemeConfig,
  BusinessInfo,
  Customer,
  Expense,
  Invoice,
  PaymentRecord,
  PriceHistoryEntry,
  Service,
  SyncQueueItem,
  User,
} from '../types';
import { DEFAULT_SHIZA_LOGO } from '../utils/imageUtils';
import { applyThemeToDocument, THEME_PRESETS } from '../utils/themeUtils';

const STORAGE_KEYS = {
  BUSINESS: 'shiza_business_info_v1',
  USERS: 'shiza_users_v1',
  CURRENT_USER_ID: 'shiza_current_user_id_v1',
  SERVICES: 'shiza_services_v1',
  CUSTOMERS: 'shiza_customers_v1',
  INVOICES: 'shiza_invoices_v1',
  PAYMENTS: 'shiza_payments_v1',
  EXPENSES: 'shiza_expenses_v1',
  SYNC_QUEUE: 'shiza_sync_queue_v1',
  LAST_INVOICE_SEQ: 'shiza_invoice_seq_v1',
  LAST_SYNC_TIME: 'shiza_last_sync_time_v1',
  LANGUAGE: 'shiza_language_v1',
  THEME: 'shiza_theme_config_v1',
  PRICE_HISTORY: 'shiza_price_history_v1',
};

// Safe Decimal Money Math helpers (using integer paise/cents: 1 INR = 100 paise)
export function toPaise(rupees: number): number {
  return Math.round(Number(rupees || 0) * 100);
}

export function toRupees(paise: number): number {
  return Math.round(paise) / 100;
}

export function formatINR(amount: number): string {
  const safeNum = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeNum);
}

// Initial Default Business Information
export const defaultBusinessInfo: BusinessInfo = {
  name: 'Shiza Online',
  bengaliName: 'সিজা অনলাইন',
  type: 'CSC | Digital Service Centre',
  address: 'বেলকুড়িয়া, জোড়দিঘী, দক্ষিণ দিনাজপুর, ৭৩৩১২১',
  contact: '6294363894',
  whatsapp: '6294363894',
  ownerName: 'মমিনুর ইসলাম (Mominur Islam)',
  cscId: 'CSC-WB-733121',
  tagline: 'আপনার অনলাইন কাজের সহজ সমাধান।',
  openingHours: 'সকাল ৮:০০ - রাত ৯:০০ (প্রতিদিন খোলা)',
  upiId: '6294363894@upi',
  upiMerchantName: 'Shiza Online',
  upiNote: 'Shiza Online Services Belkuria',
  logoUrl: DEFAULT_SHIZA_LOGO,
  currency: 'INR',
  showLogoOnReceipt: true,
  showAddressOnReceipt: true,
  showPhoneOnReceipt: true,
  showOwnerOnReceipt: true,
  showCscIdOnReceipt: true,
  showQrOnReceipt: true,
  invoiceHeaderText: 'সিজা অনলাইন — ডিজিটাল সেবা ও ক্যাশ মেমো',
  invoiceFooterText: 'ধন্যবাদ! আবার আসবেন। যেকোনো ডিজিটাল সহায়তায় আমরা আপনার পাশে।',
};

// Initial Default Users
export const defaultUsers: User[] = [
  {
    id: 'user-owner-1',
    name: 'Mominur Islam (Owner)',
    username: 'owner',
    pin: '1234',
    role: 'owner',
    permissions: {
      canManageServices: true,
      canManageStaff: true,
      canViewFinancialReports: true,
      canCancelInvoices: true,
      canExportData: true,
      canVerifyPayments: true,
      canManageBranding: true,
      canManageShopProfile: true,
      canManagePricing: true,
      canOverridePrice: true,
      canManageThemes: true,
    },
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-staff-1',
    name: 'Rahul Roy (Staff)',
    username: 'staff',
    pin: '1234',
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
  },
];

// Initial Services Catalogue (As per Section 7 of Specification)
export const initialServices: Service[] = [
  // 1. Online Application
  {
    id: 'srv-onl-1',
    category: 'online',
    nameBn: 'অনলাইন ফর্ম ফিলাপ',
    nameEn: 'Online Form Fill-up',
    descriptionBn: 'বিভিন্ন বিশ্ববিদ্যালয়, কলেজ ও ভর্তি পরীক্ষার অনলাইন ফর্ম পূরণ',
    descriptionEn: 'College, university, and online admission form fill-up assistance',
    defaultPrice: 50,
    pricingType: 'fixed',
    extraCharges: 0,
    isFree: false,
    unitBn: 'প্রতি আবেদন',
    unitEn: 'per application',
    iconKey: 'form',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'srv-onl-2',
    category: 'online',
    nameBn: 'ডকুমেন্ট আপলোড ও রিসাইজ সাবমিশন',
    nameEn: 'Document Upload & Size Correction',
    descriptionBn: 'ছবি ও সই সঠিক ফরম্যাট ও সাইজে কনভার্ট করে আপলোড',
    descriptionEn: 'Photo, signature and certificate conversion & submission',
    defaultPrice: 30,
    pricingType: 'fixed',
    extraCharges: 0,
    isFree: false,
    unitBn: 'প্রতি ফাইল',
    unitEn: 'per file',
    iconKey: 'upload',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },

  // 2. Government Services
  {
    id: 'srv-gov-1',
    category: 'government',
    nameBn: 'সরকারি চাকরির আবেদন সহায়তা',
    nameEn: 'Govt Job Application Assistance',
    descriptionBn: 'রেলওয়ে, পুলিশ, এসএসসি ও রাজ্য সরকারের পরীক্ষার আবেদন',
    descriptionEn: 'State & Central Government recruitment application support',
    defaultPrice: 60,
    pricingType: 'fixed',
    extraCharges: 0,
    isFree: false,
    unitBn: 'প্রতি আবেদন',
    unitEn: 'per application',
    iconKey: 'govt',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'srv-gov-2',
    category: 'government',
    nameBn: 'আয়ুষ্মান ভারত কার্ড eKYC সহায়তা',
    nameEn: 'Ayushman Card eKYC Assistance',
    descriptionBn: 'পিএমজেএওয়াই স্বাস্থ্য কার্ড বায়োমেট্রিক ও আধার ওটিপি যাচাই',
    descriptionEn: 'PM-JAY Health Insurance eKYC and beneficiary card issuance',
    defaultPrice: 50,
    pricingType: 'fixed',
    extraCharges: 0,
    isFree: false,
    unitBn: 'প্রতি কার্ড',
    unitEn: 'per card',
    iconKey: 'ayushman',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'srv-gov-3',
    category: 'government',
    nameBn: 'রেশন কার্ড eKYC ও সংশোধন সহায়তা',
    nameEn: 'Ration Card eKYC & Modification',
    descriptionBn: 'খাদ্য সাথী রেশন কার্ড আধার লিঙ্ক ও ঠিকানা পরিবর্তন',
    descriptionEn: 'Digital Ration Card Aadhaar linking and member update',
    defaultPrice: 40,
    pricingType: 'fixed',
    extraCharges: 0,
    isFree: false,
    unitBn: 'প্রতি আবেদন',
    unitEn: 'per application',
    iconKey: 'ration',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'srv-apaar-1',
    category: 'online',
    nameBn: 'আপার স্টুডেন্ট আইডি কার্ড (APAAR ID)',
    nameEn: 'APAAR ID Card (One Nation One Student)',
    descriptionBn: 'শিক্ষা মন্ত্রণালয় ওয়ান নেশন ওয়ান স্টুডেন্ট আইডি ও কার্ড প্রিন্ট',
    descriptionEn: 'Automated Permanent Academic Account Registry student ID card',
    defaultPrice: 50,
    pricingType: 'fixed',
    extraCharges: 0,
    isFree: false,
    unitBn: 'প্রতি কার্ড',
    unitEn: 'per card',
    iconKey: 'apaar',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },

  // 3. Printing and Photocopy
  {
    id: 'srv-prt-1',
    category: 'printing',
    nameBn: 'সাদা-কালো জেরক্স / ফটোকপি (A4)',
    nameEn: 'B/W Photocopy / Xerox (A4)',
    descriptionBn: 'উচ্চমানের লেজার জেরক্স প্রতি কপি',
    descriptionEn: 'High quality laser monochrome xerox copy',
    defaultPrice: 3,
    pricingType: 'unit_based',
    extraCharges: 0,
    isFree: false,
    unitBn: 'প্রতি কপি',
    unitEn: 'per copy',
    iconKey: 'xerox',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'srv-prt-2',
    category: 'printing',
    nameBn: 'সাদা-কালো প্রিন্টিং (B/W Print)',
    nameEn: 'Black-and-White Laser Print',
    descriptionBn: 'কম্পিউটার থেকে অ্যাডমিট বা যেকোনো পেপার প্রিন্ট',
    descriptionEn: 'Admit card, resume, or document monochrome print',
    defaultPrice: 5,
    pricingType: 'unit_based',
    extraCharges: 0,
    isFree: false,
    unitBn: 'প্রতি পাতা',
    unitEn: 'per page',
    iconKey: 'print-bw',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'srv-prt-3',
    category: 'printing',
    nameBn: 'রঙিন প্রিন্টিং (Colour Print)',
    nameEn: 'Colour Photo Paper Print',
    descriptionBn: 'উজ্জ্বল রঙিন প্রিন্টিং ও প্রেজেন্টেশন পেজ',
    descriptionEn: 'Full colour vibrant document or photo printout',
    defaultPrice: 15,
    pricingType: 'unit_based',
    extraCharges: 0,
    isFree: false,
    unitBn: 'প্রতি পাতা',
    unitEn: 'per page',
    iconKey: 'print-color',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'srv-prt-4',
    category: 'printing',
    nameBn: 'ডকুমেন্ট স্ক্যানিং ও ল্যামিনেশন',
    nameEn: 'Document Scanning & Lamination',
    descriptionBn: 'মূল সার্টিফিকেট স্ক্যান অথবা সামরিক গ্রেড থিক ল্যামিনেশন',
    descriptionEn: 'High-res document scanning and heavy-duty lamination',
    defaultPrice: 20,
    pricingType: 'unit_based',
    extraCharges: 0,
    isFree: false,
    unitBn: 'প্রতি পাতা',
    unitEn: 'per page',
    iconKey: 'scan',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'srv-prt-5',
    category: 'printing',
    nameBn: 'পাসপোর্ট সাইজ ছবি (৮ কপি সেট)',
    nameEn: 'Passport Photos (8 Copies)',
    descriptionBn: 'স্টুডিও কোয়ালিটি তাত্ক্ষণিক ৮ কপি পাসপোর্ট ছবি',
    descriptionEn: 'Instant 8-copy passport photo sheet cutting',
    defaultPrice: 50,
    pricingType: 'fixed',
    extraCharges: 0,
    isFree: false,
    unitBn: 'প্রতি সেট',
    unitEn: 'per set',
    iconKey: 'photo',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },

  // 4. PVC Card
  {
    id: 'srv-pvc-1',
    category: 'pvc_card',
    nameBn: 'পিভিসি স্মার্ট কার্ড তৈরি (PVC Smart Card)',
    nameEn: 'PVC Smart Card Printing',
    descriptionBn: 'প্লাস্টিক এটিএম কোয়ালিটি ওয়াটারপ্রুফ আধার বা ভোটার কার্ড',
    descriptionEn: 'ATM-grade waterproof durable PVC card printing',
    defaultPrice: 70,
    pricingType: 'unit_based',
    extraCharges: 0,
    isFree: false,
    unitBn: 'প্রতি কার্ড',
    unitEn: 'per card',
    iconKey: 'pvc-card',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },

  // 5. Recharge and Bill Payment
  {
    id: 'srv-rec-1',
    category: 'recharge_bill',
    nameBn: 'বিদ্যুৎ বিল পেমেন্ট সহায়তা (WBSEDCL)',
    nameEn: 'Electricity Bill Payment Assistance',
    descriptionBn: 'পশ্চিমবঙ্গ বিদ্যুৎ বিল জমা ও রসিদ প্রিন্ট',
    descriptionEn: 'WBSEDCL Electric bill instant payment & receipt',
    defaultPrice: 20,
    pricingType: 'fixed',
    extraCharges: 0,
    isFree: false,
    unitBn: 'প্রতি বিল',
    unitEn: 'per bill',
    iconKey: 'electricity',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'srv-rec-2',
    category: 'recharge_bill',
    nameBn: 'মোবাইল ও ডিটিএইচ রিচার্জ সহায়তা',
    nameEn: 'Mobile & DTH Recharge Assistance',
    descriptionBn: 'জিও, এয়ারটেল, ভি এবং ডিশ টিভি ইনস্ট্যান্ট রিচার্জ',
    descriptionEn: 'All telecom & DTH prepaid fast top-up service',
    defaultPrice: 10,
    pricingType: 'fixed',
    extraCharges: 0,
    isFree: false,
    unitBn: 'প্রতি রিচার্জ',
    unitEn: 'per recharge',
    iconKey: 'recharge',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },

  // 6. Bus and Train Tickets
  {
    id: 'srv-tkt-1',
    category: 'tickets',
    nameBn: 'ট্রেন টিকিট বুকিং সহায়তা (IRCTC)',
    nameEn: 'Train Ticket Booking Assistance',
    descriptionBn: 'দূরপাল্লার সংরক্ষিত ট্রেনের টিকিট কাটা ও প্রিন্ট',
    descriptionEn: 'Indian Railways confirmed ticket booking support',
    defaultPrice: 50,
    pricingType: 'fixed',
    extraCharges: 20, // tatkal or booking fee option
    isFree: false,
    unitBn: 'প্রতি টিকিট',
    unitEn: 'per ticket',
    iconKey: 'train',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'srv-tkt-2',
    category: 'tickets',
    nameBn: 'বাস টিকিট বুকিং সহায়তা (SBSTC / NBSTC)',
    nameEn: 'Bus Ticket Booking Assistance',
    descriptionBn: 'কলকাতা, শিলিগুড়ি ও মালদা রুটের সরকারি ও প্রাইভেট বাস',
    descriptionEn: 'Intercity AC/Non-AC government & private bus seats',
    defaultPrice: 40,
    pricingType: 'fixed',
    extraCharges: 0,
    isFree: false,
    unitBn: 'প্রতি টিকিট',
    unitEn: 'per ticket',
    iconKey: 'bus',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },

  // 7. Farmer Services
  {
    id: 'srv-agr-1',
    category: 'farmer',
    nameBn: 'কৃষক আইডি রেজিস্ট্রেশন সহায়তা',
    nameEn: 'Farmer ID Registration Assistance',
    descriptionBn: 'কৃষি দপ্তর পোর্টাল কৃষক নিবন্ধন ও রেকর্ড এন্ট্রি',
    descriptionEn: 'Department of Agriculture farmer profile registration',
    defaultPrice: 50,
    pricingType: 'fixed',
    extraCharges: 0,
    isFree: false,
    unitBn: 'প্রতি আবেদন',
    unitEn: 'per application',
    iconKey: 'farmer',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'srv-agr-2',
    category: 'farmer',
    nameBn: 'কৃষক আইডি কার্ড ডাউনলোড ও প্রিন্ট',
    nameEn: 'Farmer ID Card Download & Print',
    descriptionBn: 'অনলাইন থেকে কৃষক পরিচয়পত্র ডাউনলোড ও লেমিনেটেড প্রিন্ট',
    descriptionEn: 'Digital Farmer Identity card fetching and lamination',
    defaultPrice: 30,
    pricingType: 'fixed',
    extraCharges: 0,
    isFree: false,
    unitBn: 'প্রতি কার্ড',
    unitEn: 'per card',
    iconKey: 'farmer',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'srv-agr-3',
    category: 'farmer',
    nameBn: 'কৃষক বন্ধু স্ট্যাটাস ও কিস্তি চেক',
    nameEn: 'Krishak Bandhu Status & Due Check',
    descriptionBn: 'কৃষক বন্ধু একাউন্ট সক্রিয়তা ও ব্যাংক একাউন্ট ভ্যালিডেশন',
    descriptionEn: 'Krishak Bandhu installment and status query',
    defaultPrice: 0,
    pricingType: 'fixed',
    extraCharges: 0,
    isFree: true, // Free public status check as requested!
    unitBn: 'প্রতি অনুসন্ধান',
    unitEn: 'per query',
    iconKey: 'farmer',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },

  // 8. Other Services
  {
    id: 'srv-oth-1',
    category: 'other',
    nameBn: 'সাধারণ ডিজিটাল কাউন্সেলিং ও সহায়তা',
    nameEn: 'General Digital Assistance & Enquiry',
    descriptionBn: 'যেকোনো অনলাইন পোর্টাল সংক্রান্ত পরামর্শ ও নির্দেশনা',
    descriptionEn: 'General advisory, internet lookup and consultation',
    defaultPrice: 20,
    pricingType: 'variable', // variable pricing supported!
    extraCharges: 0,
    isFree: false,
    unitBn: 'প্রতি সেশন',
    unitEn: 'per session',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
];

// Initial Customers
export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    customerCode: 'CUST-1001',
    name: 'আব্দুল করিম (Abdul Karim)',
    mobile: '9832104567',
    notes: 'বেলকুড়িয়া নিবাসী, কৃষক বন্ধু আবেদনকারী',
    totalBilled: 120,
    totalPaid: 120,
    balance: 0,
    createdAt: '2026-10-25T10:00:00Z',
  },
  {
    id: 'cust-2',
    customerCode: 'CUST-1002',
    name: 'বিপ্লব সরকার (Biplab Sarkar)',
    mobile: '8918234120',
    notes: 'জোড়দিঘী বাজার, জেব্রক্স ও রেশন eKYC',
    totalBilled: 210,
    totalPaid: 150,
    balance: 60,
    createdAt: '2026-10-26T11:30:00Z',
  },
  {
    id: 'cust-3',
    customerCode: 'CUST-1003',
    name: 'মানস মাহাতো (Manas Mahato)',
    mobile: '7001458920',
    notes: 'পিভিসি স্মার্ট কার্ড ও ট্রেন টিকিট',
    totalBilled: 190,
    totalPaid: 190,
    balance: 0,
    createdAt: '2026-10-27T09:15:00Z',
  },
];

// Initial Sample Invoices to show working ledger & reports
export const initialInvoices: Invoice[] = [
  {
    id: 'inv-uuid-1',
    invoiceNumber: 'SO-2026-00001',
    customerId: 'cust-1',
    customerName: 'আব্দুল করিম (Abdul Karim)',
    customerMobile: '9832104567',
    items: [
      {
        id: 'item-1-1',
        serviceId: 'srv-agr-1',
        serviceNameBn: 'কৃষক আইডি রেজিস্ট্রেশন সহায়তা',
        serviceNameEn: 'Farmer ID Registration Assistance',
        quantity: 1,
        unitPrice: 50,
        lineTotal: 50,
        unitBn: 'প্রতি আবেদন',
      },
      {
        id: 'item-1-2',
        serviceId: 'srv-pht-3',
        serviceNameBn: 'পিভিসি স্মার্ট কার্ড তৈরি (PVC Card)',
        serviceNameEn: 'PVC Smart Card Creation',
        quantity: 1,
        unitPrice: 70,
        lineTotal: 70,
        unitBn: 'প্রতি কার্ড',
      },
    ],
    subtotal: 120,
    discount: 0,
    totalAmount: 120,
    paidAmount: 120,
    balance: 0,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    createdByUserId: 'user-owner-1',
    createdByUserName: 'Mominur Islam (Owner)',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    auditTrail: [
      {
        id: 'aud-1',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        userId: 'user-owner-1',
        userName: 'Mominur Islam (Owner)',
        action: 'CREATED',
        details: 'Invoice SO-2026-00001 created. Amount ₹120.00',
      },
    ],
    syncStatus: 'synced',
  },
  {
    id: 'inv-uuid-2',
    invoiceNumber: 'SO-2026-00002',
    customerId: 'cust-2',
    customerName: 'বিপ্লব সরকার (Biplab Sarkar)',
    customerMobile: '8918234120',
    items: [
      {
        id: 'item-2-1',
        serviceId: 'srv-agr-4',
        serviceNameBn: 'রেশন কার্ড eKYC ও সংশোধন সহায়তা',
        serviceNameEn: 'Ration Card eKYC Assistance',
        quantity: 2,
        unitPrice: 40,
        lineTotal: 80,
        unitBn: 'প্রতি আবেদন',
      },
      {
        id: 'item-2-2',
        serviceId: 'srv-pht-1',
        serviceNameBn: 'পাসপোর্ট সাইজ ছবি (৮ কপি সেট)',
        serviceNameEn: 'Passport Photos (8 Copies)',
        quantity: 1,
        unitPrice: 50,
        lineTotal: 50,
        unitBn: 'প্রতি সেট',
      },
      {
        id: 'item-2-3',
        serviceId: 'srv-prt-1',
        serviceNameBn: 'সাদা-কালো প্রিন্টিং (B/W)',
        serviceNameEn: 'Black-and-White Printing',
        quantity: 16,
        unitPrice: 5,
        lineTotal: 80,
        unitBn: 'প্রতি পাতা',
      },
    ],
    subtotal: 210,
    discount: 0,
    totalAmount: 210,
    paidAmount: 150,
    balance: 60,
    paymentMethod: 'upi',
    paymentStatus: 'partially_paid',
    transactionRef: 'UPI-REF-99824',
    createdByUserId: 'user-staff-1',
    createdByUserName: 'Rahul Roy (Staff)',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    auditTrail: [
      {
        id: 'aud-2',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        userId: 'user-staff-1',
        userName: 'Rahul Roy (Staff)',
        action: 'CREATED',
        details: 'Invoice SO-2026-00002 created. ₹150 paid via UPI, ₹60 balance.',
      },
    ],
    syncStatus: 'pending',
  },
];

// Initial Payment Records
export const initialPayments: PaymentRecord[] = [
  {
    id: 'pay-1',
    invoiceId: 'inv-uuid-1',
    invoiceNumber: 'SO-2026-00001',
    customerId: 'cust-1',
    customerName: 'আব্দুল করিম (Abdul Karim)',
    amount: 120,
    method: 'cash',
    verificationStatus: 'verified',
    recordedByUserId: 'user-owner-1',
    recordedByUserName: 'Mominur Islam (Owner)',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: 'নগদ জমা সম্পূর্ণ পরিশোধ',
    syncStatus: 'synced',
  },
  {
    id: 'pay-2',
    invoiceId: 'inv-uuid-2',
    invoiceNumber: 'SO-2026-00002',
    customerId: 'cust-2',
    customerName: 'বিপ্লব সরকার (Biplab Sarkar)',
    amount: 150,
    method: 'upi',
    transactionRef: 'UPI-REF-99824',
    verificationStatus: 'pending', // Pending UPI verification as required!
    recordedByUserId: 'user-staff-1',
    recordedByUserName: 'Rahul Roy (Staff)',
    date: new Date(Date.now() - 3600000 * 4).toISOString(),
    notes: 'Google Pay/PhonePe QR স্ক্যান পেমেন্ট - ব্যাংক যাচাই বাকি',
    syncStatus: 'pending',
  },
];

// Initial Expenses
export const initialExpenses: Expense[] = [
  {
    id: 'exp-1',
    category: 'paper_supplies',
    amount: 350,
    date: new Date(Date.now() - 86400000).toISOString(),
    notes: 'A4 75 GSM জেরক্স পেপার ১ রিম কেনা হলো',
    createdByUserId: 'user-owner-1',
    createdByUserName: 'Mominur Islam (Owner)',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    syncStatus: 'synced',
  },
  {
    id: 'exp-2',
    category: 'internet',
    amount: 499,
    date: new Date().toISOString(),
    notes: 'ব্রডব্যান্ড ফাইবার রিচার্জ মাসিক বিল',
    createdByUserId: 'user-owner-1',
    createdByUserName: 'Mominur Islam (Owner)',
    createdAt: new Date().toISOString(),
    syncStatus: 'synced',
  },
];

// Data Repository Manager (Room Database equivalent for Web & Local Storage)
class LocalDatabase {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data);
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('Storage set failed:', err);
    }
  }

  initDatabase(): void {
    if (!localStorage.getItem(STORAGE_KEYS.BUSINESS)) {
      this.set(STORAGE_KEYS.BUSINESS, defaultBusinessInfo);
    } else {
      const biz = this.get<BusinessInfo>(STORAGE_KEYS.BUSINESS, defaultBusinessInfo);
      let bizChanged = false;
      if (!biz.logoUrl) {
        biz.logoUrl = DEFAULT_SHIZA_LOGO;
        bizChanged = true;
      }
      if (!biz.ownerName) {
        biz.ownerName = defaultBusinessInfo.ownerName;
        bizChanged = true;
      }
      if (!biz.tagline) {
        biz.tagline = defaultBusinessInfo.tagline;
        bizChanged = true;
      }
      if (!biz.openingHours) {
        biz.openingHours = defaultBusinessInfo.openingHours;
        bizChanged = true;
      }
      if (!biz.whatsapp) {
        biz.whatsapp = defaultBusinessInfo.whatsapp;
        bizChanged = true;
      }
      if (biz.showLogoOnReceipt === undefined) {
        biz.showLogoOnReceipt = true;
        biz.showAddressOnReceipt = true;
        biz.showPhoneOnReceipt = true;
        biz.showOwnerOnReceipt = true;
        biz.showCscIdOnReceipt = true;
        biz.showQrOnReceipt = true;
        biz.invoiceHeaderText = defaultBusinessInfo.invoiceHeaderText;
        biz.invoiceFooterText = defaultBusinessInfo.invoiceFooterText;
        bizChanged = true;
      }
      if (bizChanged) {
        this.set(STORAGE_KEYS.BUSINESS, biz);
      }
    }

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.set(STORAGE_KEYS.USERS, defaultUsers);
    } else {
      const users = this.get<User[]>(STORAGE_KEYS.USERS, defaultUsers);
      let changed = false;
      for (const u of users) {
        const isOwner = u.role === 'owner';
        if (u.permissions.canManageBranding === undefined) {
          u.permissions.canManageBranding = isOwner;
          changed = true;
        }
        if (u.permissions.canManageShopProfile === undefined) {
          u.permissions.canManageShopProfile = isOwner;
          changed = true;
        }
        if (u.permissions.canManagePricing === undefined) {
          u.permissions.canManagePricing = isOwner;
          changed = true;
        }
        if (u.permissions.canOverridePrice === undefined) {
          u.permissions.canOverridePrice = isOwner;
          changed = true;
        }
        if (u.permissions.canManageThemes === undefined) {
          u.permissions.canManageThemes = isOwner;
          changed = true;
        }
      }
      if (changed) {
        this.set(STORAGE_KEYS.USERS, users);
      }
    }

    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
      this.set(STORAGE_KEYS.CURRENT_USER_ID, defaultUsers[0].id);
    }

    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      this.set(STORAGE_KEYS.SERVICES, initialServices);
    } else {
      // Migrate missing fields and ensure all standard catalogue services exist
      const srvs = this.get<Service[]>(STORAGE_KEYS.SERVICES, initialServices);
      let srvChanged = false;

      // Add APAAR ID or any newly added service if missing
      for (const initSrv of initialServices) {
        if (!srvs.some((s) => s.id === initSrv.id)) {
          srvs.push(initSrv);
          srvChanged = true;
        }
      }

      for (const s of srvs) {
        if (!s.pricingType) {
          s.pricingType = 'fixed';
          srvChanged = true;
        }
        if (s.extraCharges === undefined) {
          s.extraCharges = 0;
          srvChanged = true;
        }
        if (s.isFree === undefined) {
          s.isFree = s.defaultPrice === 0;
          srvChanged = true;
        }
        if (!s.iconKey) {
          const matched = initialServices.find((init) => init.id === s.id);
          s.iconKey = matched?.iconKey || 'form';
          srvChanged = true;
        }
      }
      if (srvChanged) {
        this.set(STORAGE_KEYS.SERVICES, srvs);
      }
    }

    if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
      this.set(STORAGE_KEYS.THEME, THEME_PRESETS.professional_blue.config);
    }

    if (!localStorage.getItem(STORAGE_KEYS.PRICE_HISTORY)) {
      this.set<PriceHistoryEntry[]>(STORAGE_KEYS.PRICE_HISTORY, [
        {
          id: 'ph-init-1',
          serviceId: 'srv-prt-1',
          serviceNameBn: 'সাদা-কালো জেরক্স / ফটোকপি (A4)',
          oldPrice: 2,
          newPrice: 3,
          oldExtraCharges: 0,
          newExtraCharges: 0,
          changedByUserId: 'user-owner-1',
          changedByUserName: 'Mominur Islam (Owner)',
          changedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          reason: 'পেপার রিমের দাম বৃদ্ধি ও লেজার টোনার রক্ষণাবেক্ষণ খরচ সমন্বয়',
        },
      ]);
    }

    // Apply active theme immediately to document
    const currentTheme = this.getThemeConfig();
    applyThemeToDocument(currentTheme);

    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      this.set(STORAGE_KEYS.CUSTOMERS, initialCustomers);
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
      this.set(STORAGE_KEYS.INVOICES, initialInvoices);
      this.set(STORAGE_KEYS.LAST_INVOICE_SEQ, 2);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      this.set(STORAGE_KEYS.PAYMENTS, initialPayments);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EXPENSES)) {
      this.set(STORAGE_KEYS.EXPENSES, initialExpenses);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE)) {
      this.set<SyncQueueItem[]>(STORAGE_KEYS.SYNC_QUEUE, [
        {
          id: 'sync-q-1',
          operation: 'create',
          entity: 'invoice',
          recordId: 'inv-uuid-2',
          timestamp: new Date().toISOString(),
          status: 'pending',
          retryCount: 0,
        },
      ]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.LAST_SYNC_TIME)) {
      this.set(STORAGE_KEYS.LAST_SYNC_TIME, new Date(Date.now() - 3600000 * 2).toISOString());
    }
  }

  // Theme Customization
  getThemeConfig(): AppThemeConfig {
    return this.get<AppThemeConfig>(
      STORAGE_KEYS.THEME,
      THEME_PRESETS.professional_blue.config
    );
  }

  saveThemeConfig(config: AppThemeConfig): void {
    this.set(STORAGE_KEYS.THEME, config);
    applyThemeToDocument(config);
    this.enqueueSync('update', 'service', 'theme_config', config);
  }

  // Price History & Audit Log
  getPriceHistory(): PriceHistoryEntry[] {
    return this.get<PriceHistoryEntry[]>(STORAGE_KEYS.PRICE_HISTORY, []);
  }

  recordPriceChange(entry: Omit<PriceHistoryEntry, 'id' | 'changedAt'>): void {
    const history = this.getPriceHistory();
    const newRecord: PriceHistoryEntry = {
      ...entry,
      id: 'ph-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      changedAt: new Date().toISOString(),
    };
    history.unshift(newRecord);
    this.set(STORAGE_KEYS.PRICE_HISTORY, history);
  }

  // Business Info
  getBusinessInfo(): BusinessInfo {
    return this.get<BusinessInfo>(STORAGE_KEYS.BUSINESS, defaultBusinessInfo);
  }

  updateBusinessInfo(info: BusinessInfo): void {
    this.set(STORAGE_KEYS.BUSINESS, info);
    this.enqueueSync('update', 'service', 'business_info', info);
  }

  // Users & Auth
  getUsers(): User[] {
    return this.get<User[]>(STORAGE_KEYS.USERS, defaultUsers);
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    this.set(STORAGE_KEYS.USERS, users);
  }

  getCurrentUser(): User {
    const currentId = this.get<string>(STORAGE_KEYS.CURRENT_USER_ID, defaultUsers[0].id);
    const users = this.getUsers();
    return users.find((u) => u.id === currentId) || users[0] || defaultUsers[0];
  }

  setCurrentUser(userId: string): void {
    this.set(STORAGE_KEYS.CURRENT_USER_ID, userId);
  }

  // Services
  getServices(): Service[] {
    return this.get<Service[]>(STORAGE_KEYS.SERVICES, initialServices);
  }

  saveService(service: Service): void {
    const services = this.getServices();
    const index = services.findIndex((s) => s.id === service.id);
    if (index >= 0) {
      services[index] = service;
      this.enqueueSync('update', 'service', service.id, service);
    } else {
      services.push(service);
      this.enqueueSync('create', 'service', service.id, service);
    }
    this.set(STORAGE_KEYS.SERVICES, services);
  }

  deleteService(serviceId: string): void {
    const services = this.getServices().filter((s) => s.id !== serviceId);
    this.set(STORAGE_KEYS.SERVICES, services);
    this.enqueueSync('delete', 'service', serviceId, null);
  }

  // Customers
  getCustomers(): Customer[] {
    return this.get<Customer[]>(STORAGE_KEYS.CUSTOMERS, initialCustomers);
  }

  saveCustomer(customer: Customer): void {
    const customers = this.getCustomers();
    const index = customers.findIndex((c) => c.id === customer.id);
    if (index >= 0) {
      customers[index] = customer;
      this.enqueueSync('update', 'customer', customer.id, customer);
    } else {
      customers.push(customer);
      this.enqueueSync('create', 'customer', customer.id, customer);
    }
    this.set(STORAGE_KEYS.CUSTOMERS, customers);
  }

  // Collision-Safe Unique Invoice Number Generation (SO-2026-00001)
  getNextInvoiceNumber(): string {
    const currentYear = new Date().getFullYear();
    const seq = this.get<number>(STORAGE_KEYS.LAST_INVOICE_SEQ, 0) + 1;
    this.set(STORAGE_KEYS.LAST_INVOICE_SEQ, seq);
    const padded = String(seq).padStart(5, '0');
    return `SO-${currentYear}-${padded}`;
  }

  // Invoices
  getInvoices(): Invoice[] {
    return this.get<Invoice[]>(STORAGE_KEYS.INVOICES, initialInvoices);
  }

  saveInvoice(invoice: Invoice): void {
    const invoices = this.getInvoices();
    const index = invoices.findIndex((i) => i.id === invoice.id);
    if (index >= 0) {
      invoices[index] = invoice;
      this.enqueueSync('update', 'invoice', invoice.id, invoice);
    } else {
      invoices.unshift(invoice);
      this.enqueueSync('create', 'invoice', invoice.id, invoice);
    }
    this.set(STORAGE_KEYS.INVOICES, invoices);

    // Update customer balances accurately
    this.recalculateCustomerBalance(invoice.customerId);
  }

  // Payments
  getPayments(): PaymentRecord[] {
    return this.get<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, initialPayments);
  }

  savePayment(payment: PaymentRecord): void {
    const payments = this.getPayments();
    const index = payments.findIndex((p) => p.id === payment.id);
    if (index >= 0) {
      payments[index] = payment;
      this.enqueueSync('update', 'payment', payment.id, payment);
    } else {
      payments.unshift(payment);
      this.enqueueSync('create', 'payment', payment.id, payment);
    }
    this.set(STORAGE_KEYS.PAYMENTS, payments);

    // If payment is linked to an invoice, update invoice paidAmount & status
    if (payment.invoiceId) {
      this.reconcileInvoiceWithPayments(payment.invoiceId);
    }
  }

  verifyPayment(paymentId: string, currentUserId: string, currentUserName: string): void {
    const payments = this.getPayments();
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return;

    payment.verificationStatus = 'verified';
    payment.notes = (payment.notes ? payment.notes + ' | ' : '') + `যাচাই করেছেন: ${currentUserName} (${new Date().toLocaleTimeString()})`;
    this.savePayment(payment);

    if (payment.invoiceId) {
      const invoices = this.getInvoices();
      const inv = invoices.find((i) => i.id === payment.invoiceId);
      if (inv) {
        inv.auditTrail.push({
          id: 'aud-' + Date.now(),
          timestamp: new Date().toISOString(),
          userId: currentUserId,
          userName: currentUserName,
          action: 'PAYMENT_VERIFIED',
          details: `UPI Payment ₹${payment.amount} verified by ${currentUserName}.`,
        });
        if (inv.paymentStatus === 'pending_verification') {
          inv.paymentStatus = inv.balance <= 0 ? 'paid' : 'partially_paid';
        }
        this.saveInvoice(inv);
      }
    }
  }

  // Reconcile Invoice Payments
  private reconcileInvoiceWithPayments(invoiceId: string): void {
    const invoices = this.getInvoices();
    const invoice = invoices.find((i) => i.id === invoiceId);
    if (!invoice) return;

    const allPayments = this.getPayments().filter(
      (p) => p.invoiceId === invoiceId && p.verificationStatus === 'verified'
    );
    const verifiedTotalPaise = allPayments.reduce((sum, p) => sum + toPaise(p.amount), 0);
    const totalPaise = toPaise(invoice.totalAmount);
    const balancePaise = Math.max(0, totalPaise - verifiedTotalPaise);

    invoice.paidAmount = toRupees(verifiedTotalPaise);
    invoice.balance = toRupees(balancePaise);

    if (invoice.paymentStatus !== 'cancelled' && invoice.paymentStatus !== 'refunded') {
      if (balancePaise === 0) {
        invoice.paymentStatus = 'paid';
      } else if (verifiedTotalPaise > 0) {
        invoice.paymentStatus = 'partially_paid';
      } else {
        // Check if there are pending UPI payments
        const hasPending = this.getPayments().some(
          (p) => p.invoiceId === invoiceId && p.verificationStatus === 'pending'
        );
        invoice.paymentStatus = hasPending ? 'pending_verification' : 'unpaid';
      }
    }

    const index = invoices.findIndex((i) => i.id === invoiceId);
    invoices[index] = invoice;
    this.set(STORAGE_KEYS.INVOICES, invoices);

    this.recalculateCustomerBalance(invoice.customerId);
  }

  // Recalculate customer total billed, paid, and balance
  private recalculateCustomerBalance(customerId: string): void {
    const customers = this.getCustomers();
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;

    const customerInvoices = this.getInvoices().filter(
      (inv) => inv.customerId === customerId && inv.paymentStatus !== 'cancelled'
    );

    const totalBilledPaise = customerInvoices.reduce((sum, inv) => sum + toPaise(inv.totalAmount), 0);
    const totalPaidPaise = customerInvoices.reduce((sum, inv) => sum + toPaise(inv.paidAmount), 0);
    const balancePaise = Math.max(0, totalBilledPaise - totalPaidPaise);

    customer.totalBilled = toRupees(totalBilledPaise);
    customer.totalPaid = toRupees(totalPaidPaise);
    customer.balance = toRupees(balancePaise);

    const index = customers.findIndex((c) => c.id === customerId);
    customers[index] = customer;
    this.set(STORAGE_KEYS.CUSTOMERS, customers);
  }

  // Expenses
  getExpenses(): Expense[] {
    return this.get<Expense[]>(STORAGE_KEYS.EXPENSES, initialExpenses);
  }

  saveExpense(expense: Expense): void {
    const expenses = this.getExpenses();
    expenses.unshift(expense);
    this.set(STORAGE_KEYS.EXPENSES, expenses);
    this.enqueueSync('create', 'expense', expense.id, expense);
  }

  // Sync Queue Operations
  getSyncQueue(): SyncQueueItem[] {
    return this.get<SyncQueueItem[]>(STORAGE_KEYS.SYNC_QUEUE, []);
  }

  getLastSyncTime(): string {
    return this.get<string>(STORAGE_KEYS.LAST_SYNC_TIME, new Date().toISOString());
  }

  private enqueueSync(
    operation: 'create' | 'update' | 'delete',
    entity: 'invoice' | 'payment' | 'customer' | 'service' | 'expense',
    recordId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _payload: unknown
  ): void {
    const queue = this.getSyncQueue();
    queue.push({
      id: 'sync-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      operation,
      entity,
      recordId,
      timestamp: new Date().toISOString(),
      status: 'pending',
      retryCount: 0,
    });
    this.set(STORAGE_KEYS.SYNC_QUEUE, queue);
  }

  // Simulate Cloud Sync Engine with error recovery & retry handling
  async performCloudSync(): Promise<{ syncedCount: number; failedCount: number }> {
    const queue = this.getSyncQueue();
    if (queue.length === 0) {
      this.set(STORAGE_KEYS.LAST_SYNC_TIME, new Date().toISOString());
      return { syncedCount: 0, failedCount: 0 };
    }

    // Process queue items
    let synced = 0;
    const remaining: SyncQueueItem[] = [];

    for (const item of queue) {
      // Simulate real cloud transmission
      try {
        await new Promise((resolve) => setTimeout(resolve, 80));
        synced++;
      } catch (err: unknown) {
        item.status = 'failed';
        item.retryCount += 1;
        item.error = err instanceof Error ? err.message : 'Network timeout';
        remaining.push(item);
      }
    }

    this.set(STORAGE_KEYS.SYNC_QUEUE, remaining);
    this.set(STORAGE_KEYS.LAST_SYNC_TIME, new Date().toISOString());

    // Mark pending records as synced in local DB
    const invoices = this.getInvoices().map((inv) => ({ ...inv, syncStatus: 'synced' as const }));
    this.set(STORAGE_KEYS.INVOICES, invoices);

    const payments = this.getPayments().map((p) => ({ ...p, syncStatus: 'synced' as const }));
    this.set(STORAGE_KEYS.PAYMENTS, payments);

    return { syncedCount: synced, failedCount: remaining.length };
  }

  // Backup & Restore
  exportAllData(): string {
    const data = {
      version: '1.2',
      exportedAt: new Date().toISOString(),
      business: this.getBusinessInfo(),
      theme: this.getThemeConfig(),
      services: this.getServices(),
      priceHistory: this.getPriceHistory(),
      customers: this.getCustomers(),
      invoices: this.getInvoices(),
      payments: this.getPayments(),
      expenses: this.getExpenses(),
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonString: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.business || !parsed.services || !parsed.invoices) {
        return { success: false, error: 'Invalid backup format' };
      }
      this.set(STORAGE_KEYS.BUSINESS, parsed.business);
      this.set(STORAGE_KEYS.SERVICES, parsed.services);
      if (parsed.theme) {
        this.saveThemeConfig(parsed.theme);
      }
      if (parsed.priceHistory) {
        this.set(STORAGE_KEYS.PRICE_HISTORY, parsed.priceHistory);
      }
      this.set(STORAGE_KEYS.CUSTOMERS, parsed.customers || []);
      this.set(STORAGE_KEYS.INVOICES, parsed.invoices || []);
      this.set(STORAGE_KEYS.PAYMENTS, parsed.payments || []);
      this.set(STORAGE_KEYS.EXPENSES, parsed.expenses || []);
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Parse error' };
    }
  }
}

export const db = new LocalDatabase();
