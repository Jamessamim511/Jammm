import QRCode from 'qrcode';

export interface UpiParams {
  upiId: string;
  payeeName: string;
  amount?: number; // optional for static QR, required for dynamic invoice QR
  invoiceNumber?: string;
  note?: string;
}

/**
 * Validates standard Indian UPI ID format (e.g. username@bank, 6294363894@upi)
 */
export function isValidUpiId(upiId: string): boolean {
  if (!upiId) return false;
  const regex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  return regex.test(upiId.trim());
}

/**
 * Builds standard NPCI UPI Payment URI string:
 * upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...
 */
export function buildUpiUri(params: UpiParams): string {
  const cleanPa = params.upiId.trim();
  const cleanPn = encodeURIComponent(params.payeeName.trim());
  const cu = 'INR';

  let uri = `upi://pay?pa=${cleanPa}&pn=${cleanPn}&cu=${cu}`;

  if (params.amount && params.amount > 0) {
    const formattedAmount = params.amount.toFixed(2);
    uri += `&am=${formattedAmount}`;
  }

  if (params.invoiceNumber) {
    const tr = encodeURIComponent(params.invoiceNumber.replace(/[^a-zA-Z0-9_-]/g, ''));
    uri += `&tr=${tr}`;
  }

  const noteText = params.note || (params.invoiceNumber ? `Bill ${params.invoiceNumber}` : 'Payment to Shiza Online');
  uri += `&tn=${encodeURIComponent(noteText)}`;

  return uri;
}

/**
 * Generates Base64 Data URL for QR Code using qrcode library
 */
export async function generateQrCodeDataUrl(text: string, width = 320): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width,
      margin: 2,
      color: {
        dark: '#0f172a', // Navy Dark
        light: '#ffffff', // Crisp White
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Failed to generate QR code:', err);
    throw err;
  }
}
