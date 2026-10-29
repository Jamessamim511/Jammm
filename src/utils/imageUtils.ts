/**
 * Image processing, compression, cropping, and default SVG assets for Shiza Online
 */

// Default Shiza Online Official Logo SVG as clean Data URL
export const DEFAULT_SHIZA_LOGO = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e3a8a" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="100%" stop-color="#eab308" />
    </linearGradient>
  </defs>
  <!-- Outer Gold Ring -->
  <circle cx="100" cy="100" r="95" fill="url(#navyGrad)" stroke="url(#goldGrad)" stroke-width="5" />
  <circle cx="100" cy="100" r="88" fill="none" stroke="#eab308" stroke-width="1.5" stroke-dasharray="4 3" />
  
  <!-- Emblem Center -->
  <circle cx="100" cy="100" r="62" fill="#0b1120" stroke="#fde047" stroke-width="2" />
  
  <!-- Text Arch Simulation & Modern Monogram -->
  <text x="100" y="44" font-family="'Hind Siliguri', sans-serif" font-weight="700" font-size="13" fill="#fde047" text-anchor="middle" letter-spacing="1">সিজা অনলাইন</text>
  <text x="100" y="166" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="10.5" fill="#f8fafc" text-anchor="middle" letter-spacing="2">SHIZA ONLINE</text>
  <text x="100" y="179" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="7.5" fill="#cbd5e1" text-anchor="middle">BELKURIA • CSC</text>

  <!-- Center Icons & Letters -->
  <path d="M78 86 L100 70 L122 86 L114 86 L114 116 L86 116 L86 86 Z" fill="none" stroke="#eab308" stroke-width="2.5" stroke-linejoin="round" />
  <circle cx="100" cy="98" r="9" fill="#1e3a8a" stroke="#fde047" stroke-width="1.5" />
  <text x="100" y="102" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="12" fill="#ffffff" text-anchor="middle">SO</text>

  <!-- Stars -->
  <polygon points="50,100 52,104 56,104 53,107 54,111 50,108 46,111 47,107 44,104 48,104" fill="#eab308" />
  <polygon points="150,100 152,104 156,104 153,107 154,111 150,108 146,111 147,107 144,104 148,104" fill="#eab308" />
</svg>
`)}`;

/**
 * Built-in Service Icon keys and human-readable metadata
 */
export const BUILT_IN_SERVICE_ICONS: { key: string; labelBn: string; labelEn: string; category: string }[] = [
  { key: 'form', labelBn: 'অনলাইন ফর্ম ফিলাপ', labelEn: 'Form Fill-up', category: 'online' },
  { key: 'govt', labelBn: 'সরকারি চাকরি ও আবেদন', labelEn: 'Govt Application', category: 'government' },
  { key: 'upload', labelBn: 'ডকুমেন্ট আপলোড', labelEn: 'Doc Upload', category: 'online' },
  { key: 'print-bw', labelBn: 'সাদা-কালো প্রিন্টিং', labelEn: 'B/W Print', category: 'printing' },
  { key: 'print-color', labelBn: 'রঙিন প্রিন্টিং', labelEn: 'Colour Print', category: 'printing' },
  { key: 'xerox', labelBn: 'ফটোকপি / জেরক্স', labelEn: 'Photocopy / Xerox', category: 'printing' },
  { key: 'scan', labelBn: 'ডকুমেন্ট স্ক্যানিং', labelEn: 'Scanner', category: 'printing' },
  { key: 'photo', labelBn: 'পাসপোর্ট ছবি', labelEn: 'Passport Photo', category: 'printing' },
  { key: 'pvc-card', labelBn: 'পিভিসি স্মার্ট কার্ড', labelEn: 'PVC Smart Card', category: 'pvc_card' },
  { key: 'bus', labelBn: 'বাস টিকিট বুকিং', labelEn: 'Bus Ticket', category: 'tickets' },
  { key: 'train', labelBn: 'ট্রেন টিকিট বুকিং', labelEn: 'Train Ticket', category: 'tickets' },
  { key: 'electricity', labelBn: 'বিদ্যুৎ বিল পেমেন্ট', labelEn: 'Electricity Bill', category: 'recharge_bill' },
  { key: 'recharge', labelBn: 'মোবাইল রিচার্জ', labelEn: 'Mobile Recharge', category: 'recharge_bill' },
  { key: 'farmer', labelBn: 'কৃষক বন্ধু / আইডি', labelEn: 'Farmer ID', category: 'farmer' },
  { key: 'ayushman', labelBn: 'আয়ুষ্মান ভারত eKYC', labelEn: 'Ayushman eKYC', category: 'government' },
  { key: 'apaar', labelBn: 'আপার স্টুডেন্ট আইডি', labelEn: 'APAAR ID Card', category: 'online' },
  { key: 'ration', labelBn: 'রেশন কার্ড eKYC', labelEn: 'Ration Card', category: 'government' },
];

/**
 * Resize and optimize an image file to an efficient Data URL for offline storage
 */
export async function processImageFile(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    cropSquare?: boolean;
    zoom?: number;
    offsetX?: number;
    offsetY?: number;
  } = {}
): Promise<string> {
  const {
    maxWidth = 400,
    maxHeight = 400,
    quality = 0.85,
    cropSquare = true,
    zoom = 1,
    offsetX = 0,
    offsetY = 0,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image element'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D canvas context'));
          return;
        }

        if (cropSquare) {
          canvas.width = maxWidth;
          canvas.height = maxHeight;

          // Clear background (white/transparent)
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Calculate square crop math with zoom & offset
          const minDim = Math.min(img.width, img.height);
          const cropW = (minDim / zoom);
          const cropH = (minDim / zoom);

          // Center coordinates plus offset
          const cx = img.width / 2 + offsetX * (img.width / 2);
          const cy = img.height / 2 + offsetY * (img.height / 2);

          const srcX = Math.max(0, Math.min(img.width - cropW, cx - cropW / 2));
          const srcY = Math.max(0, Math.min(img.height - cropH, cy - cropH / 2));

          ctx.drawImage(img, srcX, srcY, cropW, cropH, 0, 0, maxWidth, maxHeight);
        } else {
          // Proportional fit
          let w = img.width;
          let h = img.height;
          if (w > maxWidth || h > maxHeight) {
            const ratio = Math.min(maxWidth / w, maxHeight / h);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);
          }
          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(img, 0, 0, w, h);
        }

        // Output JPEG or PNG
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
