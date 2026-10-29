import React, { useEffect, useState } from 'react';
import {
  Printer,
  Share2,
  X,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  QrCode as QrIcon,
} from 'lucide-react';
import { BusinessInfo, Invoice } from '../types';
import { formatINR } from '../db/storage';
import { buildUpiUri, generateQrCodeDataUrl } from '../utils/upi';

interface ReceiptModalProps {
  invoice: Invoice | null;
  business: BusinessInfo;
  onClose: () => void;
  lang?: 'bn' | 'en';
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  invoice,
  business,
  onClose,
  lang = 'bn',
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showQr, setShowQr] = useState<boolean>(true);

  useEffect(() => {
    if (!invoice) return;

    // Generate Dynamic UPI QR for invoice
    const amountToPay = invoice.balance > 0 ? invoice.balance : invoice.totalAmount;
    const upiUri = buildUpiUri({
      upiId: business.upiId || '6294363894@upi',
      payeeName: business.upiMerchantName || 'Shiza Online',
      amount: amountToPay,
      invoiceNumber: invoice.invoiceNumber,
      note: `Bill ${invoice.invoiceNumber} Shiza Online`,
    });

    generateQrCodeDataUrl(upiUri, 240)
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('QR generation error in receipt:', err));
  }, [invoice, business]);

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const getReceiptTextForShare = () => {
    const isBn = lang === 'bn';
    const itemsList = invoice.items
      .map(
        (item, idx) =>
          `${idx + 1}. ${isBn ? item.serviceNameBn : item.serviceNameEn} (${item.quantity} ${item.unitBn}) - ₹${item.lineTotal.toFixed(2)}`
      )
      .join('\n');

    const statusText =
      invoice.paymentStatus === 'paid'
        ? isBn ? 'সম্পূর্ণ পরিশোধিত (Paid)' : 'Paid in Full'
        : invoice.paymentStatus === 'partially_paid'
        ? isBn ? 'আংশিক পরিশোধিত (Partial)' : 'Partially Paid'
        : invoice.paymentStatus === 'pending_verification'
        ? isBn ? 'যাচাই অপেক্ষমান (Pending)' : 'Pending Verification'
        : isBn ? 'বকেয়া রয়েছে (Due)' : 'Due';

    return `🧾 *${business.bengaliName} (${business.name})*
${business.type}
${business.address}
যোগাযোগ: ${business.contact}
----------------------------------------
*${isBn ? 'বিল নম্বর' : 'Invoice No'}:* ${invoice.invoiceNumber}
*${isBn ? 'তারিখ' : 'Date'}:* ${new Date(invoice.createdAt).toLocaleDateString('bn-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })}
*${isBn ? 'কাস্টমার' : 'Customer'}:* ${invoice.customerName} ${invoice.customerMobile ? `(${invoice.customerMobile})` : ''}
----------------------------------------
*${isBn ? 'পরিষেবা সমূহ' : 'Services'}:*
${itemsList}
----------------------------------------
*${isBn ? 'মোট বিল' : 'Subtotal'}:* ₹${invoice.subtotal.toFixed(2)}
${invoice.discount > 0 ? `*${isBn ? 'ছাড় (Discount)' : 'Discount'}:* -₹${invoice.discount.toFixed(2)}\n` : ''}*${isBn ? 'সর্বমোট প্রদেয়' : 'Total Amount'}:* ₹${invoice.totalAmount.toFixed(2)}
*${isBn ? 'জমা দেওয়া হয়েছে' : 'Amount Paid'}:* ₹${invoice.paidAmount.toFixed(2)}
*${isBn ? 'অবশিষ্ট বাকি' : 'Remaining Due'}:* ₹${invoice.balance.toFixed(2)}
*${isBn ? 'পেমেন্ট অবস্থা' : 'Status'}:* ${statusText}
*${isBn ? 'বিলিং কারী' : 'Billed By'}:* ${invoice.createdByUserName}
----------------------------------------
“${business.bengaliName} — আপনার অনলাইন কাজের সহজ সমাধান।”
`;
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(getReceiptTextForShare());
    const phone = invoice.customerMobile ? invoice.customerMobile.replace(/\D/g, '') : '';
    const cleanPhone = phone.length === 10 ? `91${phone}` : phone;

    if (cleanPhone) {
      window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
    } else {
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(getReceiptTextForShare());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `রশিদ: ${invoice.invoiceNumber} - সিজা অনলাইন`,
          text: getReceiptTextForShare(),
        });
      } catch (err) {
        console.log('Share dismissed or failed:', err);
      }
    } else {
      handleWhatsAppShare();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Action Header (Hidden in Print) */}
        <div className="no-print flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm sm:text-base">
              {lang === 'bn' ? 'ডিজিটাল ক্যাশ মেমো / রশিদ' : 'Cash Memo & Receipt'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold">
              {invoice.invoiceNumber}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar (Hidden in Print) */}
        <div className="no-print p-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              {lang === 'bn' ? 'প্রিন্ট / PDF' : 'Print / PDF'}
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              {lang === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}
            </button>

            <button
              onClick={handleNativeShare}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-xs font-medium rounded-lg transition-colors"
              title="Android Share Sheet"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
              {lang === 'bn' ? 'শেয়ার' : 'Share'}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowQr(!showQr)}
              className={`p-1.5 rounded-lg border text-xs font-medium inline-flex items-center gap-1 transition-colors ${
                showQr ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-white border-slate-200 text-slate-600'
              }`}
              title="Toggle QR Code"
            >
              <QrIcon className="w-3.5 h-3.5" />
              <span>QR</span>
            </button>

            <button
              onClick={handleCopyText}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
              title="Copy Summary"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div id="receipt-printable-area" className="p-6 text-slate-900 font-sans print:p-0 print:m-0">
          {/* Header */}
          <div className="text-center pb-4 border-b-2 border-dashed border-slate-300">
            {business.showLogoOnReceipt !== false && business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt="Shiza Online Logo"
                className="w-16 h-16 mx-auto mb-2 object-contain"
                referrerPolicy="no-referrer"
              />
            ) : null}
            <h1 className="text-2xl font-black tracking-tight text-slate-950 font-sans">
              {business.name.toUpperCase()}
            </h1>
            <h2 className="text-xl font-bold text-blue-900 font-bengali">
              {business.bengaliName}
            </h2>
            <div className="text-xs font-semibold text-slate-600 tracking-wide mt-0.5">
              {business.type}
            </div>

            {business.showOwnerOnReceipt && business.ownerName && (
              <div className="text-xs text-slate-700 font-medium mt-0.5">
                মালিক / স্বত্বাধিকারী: <strong>{business.ownerName}</strong>
              </div>
            )}

            {business.showCscIdOnReceipt && business.cscId && (
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                সিএসসি আইডি: <strong>{business.cscId}</strong>
              </div>
            )}

            {business.showAddressOnReceipt !== false && (
              <div className="text-xs text-slate-600 mt-1 leading-tight font-bengali">
                {business.address}
              </div>
            )}

            {business.showPhoneOnReceipt !== false && (
              <div className="text-xs font-semibold text-slate-800 mt-0.5">
                যোগাযোগ: {business.contact} {business.whatsapp ? `· হোয়াটসঅ্যাপ: ${business.whatsapp}` : ''}
              </div>
            )}

            {business.openingHours && (
              <div className="text-[10px] text-slate-500 mt-0.5">
                সময়সূচি: {business.openingHours}
              </div>
            )}
          </div>

          {/* Invoice & Customer Meta */}
          <div className="py-3.5 border-b border-dashed border-slate-300 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">রশিদ / বিল নম্বর:</span>
              <span className="font-mono font-bold text-slate-900">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">তারিখ ও সময়:</span>
              <span className="text-slate-800">
                {new Date(invoice.createdAt).toLocaleDateString('bn-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">গ্রাহকের নাম:</span>
              <span className="font-bold text-slate-950">{invoice.customerName}</span>
            </div>
            {invoice.customerMobile && (
              <div className="flex justify-between items-center">
                <span className="text-slate-600">মোবাইল নম্বর:</span>
                <span className="font-mono text-slate-800">+91 {invoice.customerMobile}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-slate-600">বিলিং স্টাফ:</span>
              <span className="text-slate-700">{invoice.createdByUserName}</span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="py-3 border-b border-dashed border-slate-300">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold text-left">
                  <th className="py-1">পরিষেবা (Service)</th>
                  <th className="py-1 text-center">পরিমাণ</th>
                  <th className="py-1 text-right">দর</th>
                  <th className="py-1 text-right">মোট (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item) => (
                  <tr key={item.id} className="py-1.5">
                    <td className="py-1.5 pr-2 font-medium text-slate-900">
                      <div>{item.serviceNameBn}</div>
                      <div className="text-[10px] text-slate-500">{item.serviceNameEn}</div>
                    </td>
                    <td className="py-1.5 px-1 text-center text-slate-700 font-mono">
                      {item.quantity}
                    </td>
                    <td className="py-1.5 px-1 text-right text-slate-600 font-mono">
                      ₹{item.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-1.5 pl-1 text-right font-bold text-slate-950 font-mono">
                      ₹{item.lineTotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Calculations */}
          <div className="py-3 border-b border-dashed border-slate-300 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>মোট মূল্য (Subtotal):</span>
              <span className="font-mono text-slate-800">₹{invoice.subtotal.toFixed(2)}</span>
            </div>

            {invoice.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>বিশেষ ছাড় (Discount):</span>
                <span className="font-mono">-₹{invoice.discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-black text-slate-950 pt-1 border-t border-slate-200">
              <span>সর্বমোট প্রদেয় (Final Total):</span>
              <span className="font-mono text-base text-blue-900">
                {formatINR(invoice.totalAmount)}
              </span>
            </div>

            <div className="flex justify-between text-slate-700 font-semibold">
              <span>পরিশোধিত টাকা (Paid):</span>
              <span className="font-mono text-emerald-700">₹{invoice.paidAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-900 font-bold">
              <span>অবশিষ্ট বাকি (Due Balance):</span>
              <span
                className={`font-mono ${invoice.balance > 0 ? 'text-amber-600 font-black' : 'text-slate-500'}`}
              >
                ₹{invoice.balance.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Method & Status Badge */}
          <div className="py-3 border-b border-dashed border-slate-300 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">পেমেন্ট মাধ্যম: </span>
              <span className="font-bold text-slate-800 uppercase">
                {invoice.paymentMethod === 'cash' ? 'নগদ (Cash)' : 'ইউপিআই (UPI)'}
              </span>
              {invoice.transactionRef && (
                <div className="text-[10px] text-slate-500 font-mono">
                  রেফারেন্স: {invoice.transactionRef}
                </div>
              )}
            </div>

            <div className="text-right">
              {invoice.paymentStatus === 'paid' && (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" /> সম্পূর্ণ পরিশোধিত
                </span>
              )}
              {invoice.paymentStatus === 'partially_paid' && (
                <span className="inline-flex items-center gap-1 font-bold text-amber-700 text-xs">
                  <AlertCircle className="w-3.5 h-3.5" /> আংশিক পরিশোধিত
                </span>
              )}
              {invoice.paymentStatus === 'pending_verification' && (
                <span className="inline-flex items-center gap-1 font-bold text-amber-700 text-xs">
                  <AlertCircle className="w-3.5 h-3.5" /> যাচাই অপেক্ষমান
                </span>
              )}
              {invoice.paymentStatus === 'unpaid' && (
                <span className="inline-flex items-center gap-1 font-bold text-red-600 text-xs">
                  <AlertCircle className="w-3.5 h-3.5" /> বকেয়া রয়েছে
                </span>
              )}
            </div>
          </div>

          {/* Dynamic UPI QR Code for instant scanning */}
          {showQr && qrCodeUrl && (
            <div className="py-3 text-center border-b border-dashed border-slate-300">
              <div className="text-[11px] font-semibold text-slate-700 mb-1">
                {invoice.balance > 0 ? 'বাকি টাকা UPI স্ক্যান করে জমা দিন:' : 'অনলাইন ইউপিআই পেমেন্ট QR:'}
              </div>
              <img
                src={qrCodeUrl}
                alt="UPI Payment QR Code"
                className="w-32 h-32 mx-auto border border-slate-200 rounded-lg p-1 bg-white"
                referrerPolicy="no-referrer"
              />
              <div className="text-[10px] font-mono font-bold text-slate-800 mt-1">
                UPI ID: {business.upiId}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                পরিমাণ: ₹{(invoice.balance > 0 ? invoice.balance : invoice.totalAmount).toFixed(2)}
              </div>
            </div>
          )}

          {/* Footer Motto */}
          <div className="pt-3 text-center">
            <div className="font-bengali font-bold text-slate-800 text-xs tracking-wide">
              “{business.tagline || 'আপনার অনলাইন কাজের সহজ সমাধান।'}”
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-bengali">
              {business.invoiceFooterText || 'ধন্যবাদ! আবার আসবেন। (Computer Generated Cash Memo)'}
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="no-print p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
