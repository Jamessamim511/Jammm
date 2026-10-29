import React, { useEffect, useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { buildUpiUri, generateQrCodeDataUrl } from '../utils/upi';
import { formatINR } from '../db/storage';

interface UpiQrModalProps {
  upiId: string;
  merchantName: string;
  amount?: number;
  invoiceNumber?: string;
  note?: string;
  isOpen: boolean;
  onClose: () => void;
  onVerifyPayment?: () => void;
  canVerify?: boolean;
  lang?: 'bn' | 'en';
}

export const UpiQrModal: React.FC<UpiQrModalProps> = ({
  upiId,
  merchantName,
  amount,
  invoiceNumber,
  note,
  isOpen,
  onClose,
  onVerifyPayment,
  canVerify = false,
  lang = 'bn',
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    const upiUri = buildUpiUri({
      upiId,
      payeeName: merchantName,
      amount,
      invoiceNumber,
      note,
    });

    generateQrCodeDataUrl(upiUri, 320)
      .then((url) => {
        setQrCodeUrl(url);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to generate UPI QR:', err);
        setLoading(false);
      });
  }, [isOpen, upiId, merchantName, amount, invoiceNumber, note]);

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `UPI-QR-${invoiceNumber || 'Shiza-Online'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isDynamic = typeof amount === 'number' && amount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-blue-900 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">
              {isDynamic
                ? lang === 'bn'
                  ? 'ডায়নামিক ইউপিআই পেমেন্ট QR'
                  : 'Invoice UPI Payment QR'
                : lang === 'bn'
                ? 'স্থায়ী দোকান ইউপিআই QR'
                : 'Static Shop UPI QR'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-blue-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-center">
          {/* Target Amount */}
          {isDynamic ? (
            <div className="mb-3">
              <div className="text-xs text-slate-500 font-medium">
                {lang === 'bn' ? 'প্রদেয় মোট টাকা:' : 'Amount to Pay:'}
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono tracking-tight text-blue-900">
                {formatINR(amount)}
              </div>
              {invoiceNumber && (
                <div className="text-xs font-semibold text-slate-600 mt-0.5">
                  {lang === 'bn' ? 'বিল নম্বর:' : 'Invoice:'}{' '}
                  <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">
                    {invoiceNumber}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-3">
              <div className="text-xs text-slate-500 font-medium">
                {lang === 'bn' ? 'স্থায়ী দোকান কিউআর' : 'Static Counter QR'}
              </div>
              <div className="text-lg font-bold text-slate-900">{merchantName}</div>
              <div className="text-xs text-slate-500">
                {lang === 'bn' ? 'গ্রাহক যেকোনো পরিমাণ টাকা লিখে পাঠাতে পারেন' : 'Customer enters amount manually'}
              </div>
            </div>
          )}

          {/* QR Code Container */}
          <div className="relative mx-auto w-64 h-64 bg-slate-50 border-2 border-slate-200 rounded-2xl p-2 flex items-center justify-center shadow-inner">
            {loading ? (
              <div className="text-xs text-slate-500 animate-pulse">QR তৈরি হচ্ছে...</div>
            ) : qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="UPI QR Code"
                className="w-full h-full object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="text-xs text-red-500">QR তৈরি করা সম্ভব হয়নি</div>
            )}
          </div>

          {/* UPI ID Info with copy */}
          <div className="mt-4 flex items-center justify-between p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <div className="text-left overflow-hidden">
              <div className="text-[10px] text-slate-500">{lang === 'bn' ? 'ইউপিআই আইডি:' : 'UPI ID:'}</div>
              <div className="font-mono font-bold text-slate-900 truncate">{upiId}</div>
            </div>
            <button
              onClick={handleCopyUpi}
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shrink-0 ml-2"
              title="Copy UPI ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Crucial Indian Financial Warning Box */}
          <div className="mt-3.5 p-3 bg-amber-50 rounded-xl border border-amber-200 text-left flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-snug">
              <strong className="font-bold block text-amber-950">
                {lang === 'bn' ? 'আর্থিক সুরক্ষা নিয়ম:' : 'Verification Rules:'}
              </strong>
              {lang === 'bn'
                ? 'কিউআর স্ক্যান বা দেখালেই পেমেন্ট সম্পন্ন হয় না। আপনার ব্যাংক অ্যাকাউন্ট বা Google Pay/PhonePe অ্যাপে টাকা ঢোকার মেসেজ দেখে তবেই নিশ্চিত করুন।'
                : 'Scanning the QR does NOT confirm money receipt. Only mark as verified after confirming the actual bank credit.'}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-2">
          {canVerify && onVerifyPayment && isDynamic && (
            <button
              onClick={() => {
                onVerifyPayment();
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              {lang === 'bn' ? 'টাকা পেয়েছি - যাচাই সম্পন্ন করুন' : 'Confirm & Mark Payment as Verified'}
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadQr}
              className="flex-1 py-2 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              {lang === 'bn' ? 'QR ডাউনলোড' : 'Download QR'}
            </button>

            <button
              onClick={onClose}
              className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
            >
              {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
