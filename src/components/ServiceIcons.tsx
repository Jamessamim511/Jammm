import React from 'react';

interface IconProps {
  className?: string;
  size?: number | string;
}

/**
 * Premium 2D/Subtle 3D Professional Digital Service Centre Icons
 * Built with precision SVG vector geometry, layered gradients, and clean styling.
 */

// 1. Online Form Fill-up — Digital application document with fields and stylus pen
export const FormFillupIcon: React.FC<IconProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="formBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EFF6FF" />
        <stop offset="100%" stopColor="#DBEAFE" />
      </linearGradient>
      <linearGradient id="formHeader" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      <linearGradient id="penGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E40AF" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
      <filter id="subtleDrop" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#1E3A8A" floodOpacity="0.12" />
      </filter>
    </defs>
    {/* Base Container */}
    <rect width="64" height="64" rx="16" fill="url(#formBg)" stroke="#BFDBFE" strokeWidth="1.5" />
    
    {/* Document Paper */}
    <g filter="url(#subtleDrop)">
      <rect x="12" y="10" width="36" height="44" rx="5" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
      {/* Header Bar */}
      <path d="M12 15C12 12.2386 14.2386 10 17 10H43C45.7614 10 48 12.2386 48 15V18H12V15Z" fill="url(#formHeader)" />
      <circle cx="17" cy="14" r="1.5" fill="#FFFFFF" />
      <circle cx="22" cy="14" r="1.5" fill="#BFDBFE" />
      
      {/* Form Fields & Checkboxes */}
      <rect x="17" y="23" width="5" height="5" rx="1.5" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1" />
      <path d="M18.5 25.5L20 27L23 23.5" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="25" y="24.5" width="18" height="2" rx="1" fill="#94A3B8" />

      <rect x="17" y="32" width="5" height="5" rx="1.5" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1" />
      <path d="M18.5 34.5L20 36L23 32.5" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="25" y="33.5" width="15" height="2" rx="1" fill="#94A3B8" />

      <rect x="17" y="41" width="5" height="5" rx="1.5" fill="#EFF6FF" stroke="#CBD5E1" strokeWidth="1" />
      <rect x="25" y="42.5" width="12" height="2" rx="1" fill="#CBD5E1" />
    </g>

    {/* Digital Stylus Pen */}
    <g transform="translate(34, 28) rotate(-35)">
      <rect x="0" y="0" width="6" height="22" rx="2" fill="url(#penGrad)" stroke="#1E3A8A" strokeWidth="0.8" />
      <path d="M0 22L3 27L6 22H0Z" fill="#F59E0B" />
      <circle cx="3" cy="26" r="0.8" fill="#D97706" />
      <rect x="1" y="2" width="4" height="2" rx="0.5" fill="#60A5FA" />
    </g>
  </svg>
);

// 2. Government Services — Stately government pillars & official Ashok seal
export const GovtServicesIcon: React.FC<IconProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="govtBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EEF2FF" />
        <stop offset="100%" stopColor="#E0E7FF" />
      </linearGradient>
      <linearGradient id="govtPillar" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3730A3" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
      <linearGradient id="goldSeal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#govtBg)" stroke="#C7D2FE" strokeWidth="1.5" />
    
    {/* Pediment Roof (Triangle) */}
    <path d="M32 12L12 23H52L32 12Z" fill="url(#govtPillar)" stroke="#312E81" strokeWidth="1.2" strokeLinejoin="round" />
    {/* Inner Tympanum Seal */}
    <circle cx="32" cy="19.5" r="3" fill="url(#goldSeal)" stroke="#92400E" strokeWidth="0.8" />
    
    {/* Entablature beam */}
    <rect x="13" y="23" width="38" height="3" rx="1" fill="#4338CA" />

    {/* 4 Stately Pillars */}
    <rect x="16" y="27" width="4.5" height="19" rx="1.5" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="1.2" />
    <rect x="25" y="27" width="4.5" height="19" rx="1.5" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="1.2" />
    <rect x="34.5" y="27" width="4.5" height="19" rx="1.5" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="1.2" />
    <rect x="43.5" y="27" width="4.5" height="19" rx="1.5" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="1.2" />

    {/* Plinth Foundation Steps */}
    <rect x="12" y="46" width="40" height="3" rx="1" fill="#4338CA" />
    <rect x="9" y="49" width="46" height="4" rx="1.5" fill="#312E81" />
  </svg>
);

// 3. Printing (B/W & Colour) — High-tech desktop laser printer with output page
export const PrintingIcon: React.FC<IconProps & { isColor?: boolean }> = ({ className = 'w-full h-full', isColor = false }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="prtBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F8FAFC" />
        <stop offset="100%" stopColor="#F1F5F9" />
      </linearGradient>
      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="100%" stopColor="#1E293B" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#prtBg)" stroke="#CBD5E1" strokeWidth="1.5" />
    
    {/* Input Paper Sheet */}
    <rect x="20" y="10" width="24" height="16" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.2" />
    <line x1="24" y1="14" x2="40" y2="14" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="24" y1="18" x2="36" y2="18" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />

    {/* Printer Body */}
    <rect x="11" y="22" width="42" height="23" rx="5" fill="url(#bodyGrad)" stroke="#0F172A" strokeWidth="1.5" />
    
    {/* Front Panel Control Strip */}
    <rect x="15" y="26" width="34" height="5" rx="1.5" fill="#0F172A" />
    <circle cx="19" cy="28.5" r="1.5" fill="#10B981" /> {/* Power LED */}
    <circle cx="24" cy="28.5" r="1.2" fill="#F59E0B" /> {/* Ready LED */}
    <rect x="40" y="27" width="6" height="3" rx="1" fill="#3B82F6" />

    {/* Output Feed Slot */}
    <rect x="17" y="35" width="30" height="3" rx="1" fill="#020617" />

    {/* Output Printed Paper Sheet */}
    <rect x="19" y="36" width="26" height="18" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.2" />
    <line x1="23" y1="41" x2="41" y2="41" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="23" y1="45" x2="37" y2="45" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />

    {/* CMYK dots if color, or mono lines */}
    {isColor ? (
      <g transform="translate(23, 48)">
        <circle cx="2" cy="2" r="1.5" fill="#06B6D4" />
        <circle cx="6" cy="2" r="1.5" fill="#EC4899" />
        <circle cx="10" cy="2" r="1.5" fill="#EAB308" />
        <circle cx="14" cy="2" r="1.5" fill="#0F172A" />
      </g>
    ) : (
      <line x1="23" y1="49" x2="33" y2="49" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
    )}
  </svg>
);

// 4. Photocopy / Xerox — Dual documents under scanner lamp bar
export const XeroxIcon: React.FC<IconProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="xeroxBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="100%" stopColor="#FEF3C7" />
      </linearGradient>
      <linearGradient id="scanBeam" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2" />
        <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#xeroxBg)" stroke="#FDE68A" strokeWidth="1.5" />
    
    {/* Base Document (Original) */}
    <rect x="14" y="14" width="26" height="34" rx="3" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
    <line x1="18" y1="20" x2="30" y2="20" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="18" y1="25" x2="36" y2="25" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="18" y1="30" x2="32" y2="30" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

    {/* Duplicate Document (Xerox Copy) */}
    <rect x="24" y="18" width="26" height="34" rx="3" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
    <line x1="28" y1="24" x2="40" y2="24" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="28" y1="29" x2="46" y2="29" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="28" y1="34" x2="42" y2="34" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="28" y1="39" x2="36" y2="39" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />

    {/* Dynamic Scanner Light Beam */}
    <rect x="10" y="32" width="44" height="4" rx="2" fill="url(#scanBeam)" />
    <line x1="12" y1="34" x2="52" y2="34" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />

    {/* "2X" Multiplier Pill */}
    <rect x="13" y="38" width="13" height="12" rx="3" fill="#D97706" />
    <text x="19.5" y="47" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">2×</text>
  </svg>
);

// 5. PVC Card — Smart identity card with metallic chip, avatar & magnetic strip
export const PvcCardIcon: React.FC<IconProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="pvcBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FAF5FF" />
        <stop offset="100%" stopColor="#EDE9FE" />
      </linearGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6D28D9" />
        <stop offset="100%" stopColor="#4C1D95" />
      </linearGradient>
      <linearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#pvcBg)" stroke="#DDD6FE" strokeWidth="1.5" />
    
    {/* PVC Card Body */}
    <rect x="9" y="16" width="46" height="32" rx="4.5" fill="url(#cardGrad)" stroke="#3B0764" strokeWidth="1.5" />

    {/* Magnetic Stripe / Accent Ribbon */}
    <rect x="9" y="21" width="46" height="3" fill="#8B5CF6" fillOpacity="0.4" />

    {/* EMV Microchip */}
    <rect x="15" y="27" width="9" height="7" rx="1.5" fill="url(#chipGrad)" stroke="#78350F" strokeWidth="0.8" />
    <line x1="19.5" y1="27" x2="19.5" y2="34" stroke="#78350F" strokeWidth="0.6" />
    <line x1="15" y1="30.5" x2="24" y2="30.5" stroke="#78350F" strokeWidth="0.6" />

    {/* Photo Frame / Avatar Box */}
    <rect x="38" y="25" width="12" height="14" rx="2" fill="#FFFFFF" fillOpacity="0.2" stroke="#DDD6FE" strokeWidth="0.8" />
    <circle cx="44" cy="29" r="2.5" fill="#FFFFFF" />
    <path d="M40 37C40 34.5 41.8 33 44 33C46.2 33 48 34.5 48 37H40Z" fill="#FFFFFF" />

    {/* Embossed Card Number Mockup */}
    <line x1="15" y1="38" x2="33" y2="38" stroke="#F5D0FE" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 2" />
    <line x1="15" y1="42" x2="26" y2="42" stroke="#DDD6FE" strokeWidth="1" strokeLinecap="round" />

    {/* Contactless Waves */}
    <path d="M48 19C49.5 20.2 50.5 21.8 50.5 23.5" stroke="#FDE047" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M46 20.5C47 21.3 47.7 22.3 47.7 23.5" stroke="#FDE047" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// 6. Farmer ID / Krishak Bandhu — Biometric identity card with agriculture sprout
export const FarmerIdIcon: React.FC<IconProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="agrBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ECFDF5" />
        <stop offset="100%" stopColor="#D1FAE5" />
      </linearGradient>
      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="wheatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#agrBg)" stroke="#A7F3D0" strokeWidth="1.5" />
    
    {/* Identity Card Outline */}
    <rect x="11" y="14" width="42" height="36" rx="4" fill="#FFFFFF" stroke="#059669" strokeWidth="1.5" />
    {/* Green Header Strip */}
    <path d="M11 18C11 15.7909 12.7909 14 15 14H49C51.2091 14 53 15.7909 53 18V21H11V18Z" fill="#047857" />
    <text x="32" y="19" fontFamily="sans-serif" fontSize="5.5" fontWeight="bold" fill="#A7F3D0" textAnchor="middle">KRISHI ID</text>

    {/* Farmer Portrait Box */}
    <rect x="15" y="24" width="10" height="12" rx="1.5" fill="#F0FDF4" stroke="#10B981" strokeWidth="0.8" />
    <circle cx="20" cy="27.5" r="2" fill="#047857" />
    <path d="M17 34C17 31.8 18.3 30.5 20 30.5C21.7 30.5 23 31.8 23 34H17Z" fill="#047857" />

    {/* Identity Line Fields */}
    <rect x="28" y="25" width="20" height="2" rx="1" fill="#94A3B8" />
    <rect x="28" y="29" width="16" height="2" rx="1" fill="#94A3B8" />
    <rect x="28" y="33" width="12" height="2" rx="1" fill="#CBD5E1" />

    {/* Agriculture Sprout & Golden Grain Emblem */}
    <g transform="translate(34, 34)">
      <circle cx="10" cy="10" r="8" fill="#ECFDF5" stroke="#10B981" strokeWidth="1" />
      {/* Golden Wheat Stalk */}
      <path d="M10 16V6M10 8L7 6M10 8L13 6M10 11L6 9M10 11L14 9M10 14L7 12M10 14L13 12" stroke="url(#wheatGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Green Leaf Accent */}
      <path d="M6 14C6 11 10 10 10 10C10 10 10 14 7 15" fill="url(#leafGrad)" />
    </g>
  </svg>
);

// 7. Ayushman eKYC — Official healthcare card with cross, shield & verification seal
export const AyushmanIcon: React.FC<IconProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="ayushBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF1F2" />
        <stop offset="100%" stopColor="#FFE4E6" />
      </linearGradient>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#9F1239" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#ayushBg)" stroke="#FECDD3" strokeWidth="1.5" />
    
    {/* Health Protection Shield */}
    <path d="M32 11L48 16V29C48 40.5 41 48 32 52C23 48 16 40.5 16 29V16L32 11Z" fill="url(#shieldGrad)" stroke="#881337" strokeWidth="1.5" strokeLinejoin="round" />

    {/* Medical Cross */}
    <rect x="29" y="21" width="6" height="18" rx="1.5" fill="#FFFFFF" />
    <rect x="23" y="27" width="18" height="6" rx="1.5" fill="#FFFFFF" />

    {/* Biometric eKYC Verification Badge Overlay */}
    <circle cx="44" cy="43" r="8.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.8" />
    <path d="M40 43L42.5 45.5L48 39.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 8. APAAR ID — Student identity card with graduation mortarboard & education credentials
export const ApaarIdIcon: React.FC<IconProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="apaarBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FAF5FF" />
        <stop offset="100%" stopColor="#F3E8FF" />
      </linearGradient>
      <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="100%" stopColor="#3730A3" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#apaarBg)" stroke="#E9D5FF" strokeWidth="1.5" />
    
    {/* Academic Student ID Card */}
    <rect x="11" y="15" width="42" height="35" rx="4" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="1.5" />
    <rect x="11" y="15" width="42" height="6" rx="3" fill="#6D28D9" />
    <text x="32" y="20" fontFamily="sans-serif" fontSize="4.5" fontWeight="bold" fill="#DDD6FE" textAnchor="middle">APAAR • EDU ID</text>

    {/* Student Photo */}
    <rect x="15" y="25" width="11" height="14" rx="2" fill="#F5F3FF" stroke="#C4B5FD" strokeWidth="0.8" />
    <circle cx="20.5" cy="29" r="2.2" fill="#6D28D9" />
    <path d="M17 37C17 34.5 18.5 33 20.5 33C22.5 33 24 34.5 24 37H17Z" fill="#6D28D9" />

    {/* Academic Registry Records */}
    <rect x="29" y="26" width="19" height="2" rx="1" fill="#6D28D9" />
    <rect x="29" y="30" width="15" height="2" rx="1" fill="#94A3B8" />
    <rect x="29" y="34" width="12" height="2" rx="1" fill="#CBD5E1" />

    {/* Mortarboard Graduation Cap Overlay */}
    <g transform="translate(32, 33)">
      {/* Cap Diamond */}
      <polygon points="12,4 23,8 12,12 1,8" fill="url(#capGrad)" stroke="#1E1B4B" strokeWidth="0.8" />
      {/* Skullcap underneath */}
      <path d="M6 10V14C6 16.5 8.7 18 12 18C15.3 18 18 16.5 18 14V10" fill="#312E81" />
      {/* Tassel */}
      <path d="M12 8L20 13V17" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="20" cy="17" r="1.2" fill="#D97706" />
    </g>
  </svg>
);

// 9. Passport Photo — Studio camera with lens, portrait guidelines & flash
export const PassportPhotoIcon: React.FC<IconProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="camBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F8FAFC" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
      <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#camBg)" stroke="#94A3B8" strokeWidth="1.5" />
    
    {/* Camera Body */}
    <path d="M12 23C12 20.7909 13.7909 19 16 19H22L25 15H39L42 19H48C50.2091 19 52 20.7909 52 23V46C52 48.2091 50.2091 50 48 50H16C13.7909 50 12 48.2091 12 46V23Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />

    {/* Studio Flash Diffuser & Shutter Button */}
    <rect x="18" y="16" width="5" height="3" rx="1" fill="#E2E8F0" />
    <rect x="42" y="22" width="6" height="4" rx="1" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />

    {/* Concentric Lens Barrel */}
    <circle cx="32" cy="35" r="12" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
    <circle cx="32" cy="35" r="8.5" fill="url(#lensGrad)" stroke="#38BDF8" strokeWidth="1" />
    
    {/* Aperture Reflection */}
    <circle cx="30" cy="33" r="2.5" fill="#FFFFFF" fillOpacity="0.8" />
    <circle cx="34" cy="37" r="1" fill="#FFFFFF" fillOpacity="0.6" />

    {/* 35x45mm Corner Crop Guides */}
    <path d="M14 26V23H17" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M50 26V23H47" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 43V46H17" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M50 43V46H47" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 10. Bus Ticket — Express passenger bus with destination LED & ticket stub
export const BusTicketIcon: React.FC<IconProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="busBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F0FDFA" />
        <stop offset="100%" stopColor="#CCFBF1" />
      </linearGradient>
      <linearGradient id="busBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0D9488" />
        <stop offset="100%" stopColor="#042F2E" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#busBg)" stroke="#99F6E4" strokeWidth="1.5" />
    
    {/* Express Bus Body */}
    <rect x="14" y="12" width="36" height="38" rx="7" fill="url(#busBody)" stroke="#042F2E" strokeWidth="1.5" />

    {/* Destination LED Board */}
    <rect x="22" y="15" width="20" height="3.5" rx="1" fill="#042F2E" />
    <line x1="24" y1="16.8" x2="40" y2="16.8" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="2 1" />

    {/* Curved Front Windshield Glass */}
    <rect x="17" y="21" width="30" height="13" rx="3" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.2" />
    <line x1="32" y1="21" x2="32" y2="34" stroke="#0284C7" strokeWidth="1" />

    {/* Twin Headlamps */}
    <circle cx="20" cy="40" r="2.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
    <circle cx="44" cy="40" r="2.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />

    {/* Radiator Grille */}
    <rect x="26" y="38" width="12" height="4" rx="1" fill="#042F2E" />
    <line x1="28" y1="40" x2="36" y2="40" stroke="#99F6E4" strokeWidth="1" />

    {/* Dual Bus Wheels */}
    <rect x="15" y="49" width="7" height="4" rx="1.5" fill="#0F172A" />
    <rect x="42" y="49" width="7" height="4" rx="1.5" fill="#0F172A" />
  </svg>
);

// 11. Train Ticket — IRCTC high-speed train engine with railway track
export const TrainTicketIcon: React.FC<IconProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="trainBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F0F9FF" />
        <stop offset="100%" stopColor="#E0F2FE" />
      </linearGradient>
      <linearGradient id="trainBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0C4A6E" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#trainBg)" stroke="#BAE6FD" strokeWidth="1.5" />
    
    {/* Aerodynamic Locomotive Body */}
    <path d="M21 11C21 9.34315 22.3431 8 24 8H40C41.6569 8 43 9.34315 43 11L46 38C46 41.3137 43.3137 44 40 44H24C20.6863 44 18 41.3137 18 38L21 11Z" fill="url(#trainBody)" stroke="#082F49" strokeWidth="1.5" />

    {/* Windshield */}
    <path d="M22 17H42L40 27H24L22 17Z" fill="#E0F2FE" stroke="#0369A1" strokeWidth="1.2" />

    {/* IRCTC Orange Stripe */}
    <rect x="19" y="30" width="26" height="3" fill="#F97316" />

    {/* Center High Beam & Side Markers */}
    <circle cx="32" cy="37" r="2.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
    <circle cx="23" cy="37" r="1.5" fill="#EF4444" />
    <circle cx="41" cy="37" r="1.5" fill="#EF4444" />

    {/* Railway Track Bed */}
    <line x1="10" y1="52" x2="54" y2="52" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="56" x2="48" y2="56" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="20" y1="48" x2="16" y2="56" stroke="#94A3B8" strokeWidth="1.5" />
    <line x1="44" y1="48" x2="48" y2="56" stroke="#94A3B8" strokeWidth="1.5" />
  </svg>
);

// 12. Electricity Bill Payment — WBSEDCL meter invoice with energetic power bolt
export const ElectricityBillIcon: React.FC<IconProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="elecBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ECFEFF" />
        <stop offset="100%" stopColor="#CFFAFE" />
      </linearGradient>
      <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#elecBg)" stroke="#A5F3FC" strokeWidth="1.5" />
    
    {/* Bill Statement Paper */}
    <rect x="14" y="10" width="36" height="44" rx="4" fill="#FFFFFF" stroke="#0891B2" strokeWidth="1.5" />
    <rect x="14" y="10" width="36" height="6" rx="3" fill="#0891B2" />
    <text x="32" y="15" fontFamily="sans-serif" fontSize="4.5" fontWeight="bold" fill="#ECFEFF" textAnchor="middle">WBSEDCL BILL</text>

    {/* Meter Display Window */}
    <rect x="19" y="20" width="26" height="7" rx="1.5" fill="#0F172A" />
    <text x="32" y="25.5" fontFamily="monospace" fontSize="5.5" fontWeight="bold" fill="#10B981" textAnchor="middle">02480 kWh</text>

    {/* Invoice Items Mockup */}
    <line x1="19" y1="32" x2="35" y2="32" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="19" y1="36" x2="31" y2="36" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="19" y1="40" x2="27" y2="40" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />

    {/* Energetic High-Voltage Bolt Badge */}
    <g transform="translate(30, 28)">
      <circle cx="11" cy="11" r="10" fill="#FEF08A" stroke="#EAB308" strokeWidth="1.5" />
      <path d="M12 3L6 12H11L9 19L17 9H12L14 3H12Z" fill="url(#boltGrad)" stroke="#B45309" strokeWidth="0.8" strokeLinejoin="round" />
    </g>
  </svg>
);

// 13. Mobile & DTH Recharge — Smartphone with 5G towers & ₹ topup coin
export const MobileRechargeIcon: React.FC<IconProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="recBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F0FDF4" />
        <stop offset="100%" stopColor="#DCFCE7" />
      </linearGradient>
      <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#recBg)" stroke="#BBF7D0" strokeWidth="1.5" />
    
    {/* Smartphone Casing */}
    <rect x="14" y="10" width="28" height="44" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
    {/* Screen Glass */}
    <rect x="16.5" y="14" width="23" height="35" rx="3" fill="#1E293B" />
    
    {/* Dynamic 5G Cellular Signal Bars */}
    <rect x="20" y="24" width="2" height="3" rx="0.5" fill="#10B981" />
    <rect x="23" y="22" width="2" height="5" rx="0.5" fill="#10B981" />
    <rect x="26" y="20" width="2" height="7" rx="0.5" fill="#10B981" />
    <rect x="29" y="18" width="2" height="9" rx="0.5" fill="#10B981" />

    {/* Battery Icon */}
    <rect x="33" y="18" width="5" height="2.5" rx="0.5" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
    <rect x="34" y="19" width="3" height="1.5" fill="#10B981" />

    {/* Speaker notch */}
    <line x1="25" y1="12" x2="31" y2="12" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />

    {/* Floating Indian Rupee ₹ Recharge Coin */}
    <g transform="translate(30, 26)">
      <circle cx="11" cy="11" r="10" fill="url(#coinGrad)" stroke="#78350F" strokeWidth="1.2" />
      <text x="11" y="15" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#78350F" textAnchor="middle">₹</text>
    </g>
  </svg>
);

// 14. Ration Card eKYC — Digital Food & Supplies card with biometric check
export const RationCardIcon: React.FC<IconProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="ratBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="100%" stopColor="#FEF3C7" />
      </linearGradient>
      <linearGradient id="cardOchre" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#ratBg)" stroke="#FDE68A" strokeWidth="1.5" />
    
    {/* Digital Ration Card */}
    <rect x="10" y="15" width="44" height="34" rx="4.5" fill="#FFFFFF" stroke="#92400E" strokeWidth="1.5" />
    <rect x="10" y="15" width="44" height="6" rx="3" fill="url(#cardOchre)" />
    <text x="32" y="19.5" fontFamily="sans-serif" fontSize="4.5" fontWeight="bold" fill="#FEF3C7" textAnchor="middle">KHADYA SATHI • RATION</text>

    {/* Food Grain Sheaf */}
    <g transform="translate(14, 25)">
      <path d="M5 18V6M5 8C3 7 2 5 2 5C3 7 5 8 5 8ZM5 8C7 7 8 5 8 5C7 7 5 8 5 8ZM5 12C3 11 1 9 1 9C3 11 5 12 5 12ZM5 12C7 11 9 9 9 9C7 11 5 12 5 12Z" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
    </g>

    {/* Card Details */}
    <rect x="25" y="25" width="23" height="2" rx="1" fill="#78350F" />
    <rect x="25" y="29" width="18" height="2" rx="1" fill="#94A3B8" />
    <rect x="25" y="33" width="14" height="2" rx="1" fill="#CBD5E1" />

    {/* Biometric Aadhaar eKYC Verified Stamp */}
    <circle cx="43" cy="40" r="7.5" fill="#047857" stroke="#FFFFFF" strokeWidth="1.5" />
    <path d="M40 40L42 42L46 38" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 15. Document Scan & Lamination — Optical flatbed scanner with scan line
export const ScanIcon: React.FC<IconProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="scanBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EFF6FF" />
        <stop offset="100%" stopColor="#DBEAFE" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#scanBg)" stroke="#93C5FD" strokeWidth="1.5" />
    
    {/* Scanner Bed */}
    <rect x="11" y="24" width="42" height="25" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
    {/* Glass Platen */}
    <rect x="15" y="28" width="34" height="17" rx="2" fill="#38BDF8" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="0.8" />
    
    {/* Document on Platen */}
    <rect x="20" y="30" width="20" height="13" rx="1.5" fill="#FFFFFF" />
    <line x1="23" y1="33" x2="35" y2="33" stroke="#94A3B8" strokeWidth="1" />
    <line x1="23" y1="36" x2="31" y2="36" stroke="#94A3B8" strokeWidth="1" />

    {/* Scanner Laser Beam */}
    <line x1="12" y1="36" x2="52" y2="36" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />

    {/* Raised Lid / Cover */}
    <path d="M12 24L32 10L52 24" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 16. Document Upload & Size Correction
export const UploadDocIcon: React.FC<IconProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="upBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F8FAFC" />
        <stop offset="100%" stopColor="#F1F5F9" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#upBg)" stroke="#CBD5E1" strokeWidth="1.5" />
    
    {/* Document File Base */}
    <rect x="15" y="14" width="34" height="40" rx="4" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" />
    <line x1="20" y1="20" x2="34" y2="20" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="26" x2="40" y2="26" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />

    {/* Dimensional Cloud / Upload Arrow */}
    <circle cx="32" cy="38" r="11" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1" />
    <path d="M32 32L27 37H30V43H34V37H37L32 32Z" fill="#FFFFFF" />

    {/* Size badge */}
    <rect x="31" y="11" width="16" height="7" rx="2" fill="#10B981" />
    <text x="39" y="16.5" fontFamily="sans-serif" fontSize="4.5" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">200 KB</text>
  </svg>
);

// General Other Services / Tools
export const OtherServicesIcon: React.FC<IconProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="othBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F1F5F9" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#othBg)" stroke="#CBD5E1" strokeWidth="1.5" />
    <circle cx="32" cy="32" r="14" fill="#3B82F6" fillOpacity="0.1" stroke="#3B82F6" strokeWidth="1.5" />
    <path d="M32 22V42M22 32H42" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="32" cy="32" r="4" fill="#F59E0B" />
  </svg>
);

/**
 * Universal Registry Mapping for all Service Icons
 */
export const SERVICE_VECTOR_ICONS: Record<string, React.FC<IconProps>> = {
  form: FormFillupIcon,
  'online-form': FormFillupIcon,
  govt: GovtServicesIcon,
  'govt-services': GovtServicesIcon,
  'print-bw': (props) => <PrintingIcon {...props} isColor={false} />,
  'print-color': (props) => <PrintingIcon {...props} isColor={true} />,
  print: (props) => <PrintingIcon {...props} isColor={true} />,
  xerox: XeroxIcon,
  photocopy: XeroxIcon,
  'pvc-card': PvcCardIcon,
  pvc: PvcCardIcon,
  farmer: FarmerIdIcon,
  krishak: FarmerIdIcon,
  'farmer-id': FarmerIdIcon,
  ayushman: AyushmanIcon,
  'ayushman-card': AyushmanIcon,
  apaar: ApaarIdIcon,
  'apaar-id': ApaarIdIcon,
  photo: PassportPhotoIcon,
  'passport-photo': PassportPhotoIcon,
  bus: BusTicketIcon,
  'bus-ticket': BusTicketIcon,
  train: TrainTicketIcon,
  'train-ticket': TrainTicketIcon,
  electricity: ElectricityBillIcon,
  'electricity-bill': ElectricityBillIcon,
  recharge: MobileRechargeIcon,
  'mobile-recharge': MobileRechargeIcon,
  ration: RationCardIcon,
  'ration-card': RationCardIcon,
  scan: ScanIcon,
  scanning: ScanIcon,
  upload: UploadDocIcon,
  other: OtherServicesIcon,
};
