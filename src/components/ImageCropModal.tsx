import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  Upload,
  AlertCircle,
  Move,
} from 'lucide-react';
import { processImageFile } from '../utils/imageUtils';

interface ImageCropModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onImageCropped: (dataUrl: string) => void;
  aspectRatio?: 'square' | 'circle';
  lang?: 'bn' | 'en';
  initialImage?: string;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  title,
  isOpen,
  onClose,
  onImageCropped,
  aspectRatio = 'square',
  lang = 'bn',
  initialImage,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>(initialImage || '');
  const [zoom, setZoom] = useState<number>(1);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialImage) {
        setImageSrc(initialImage);
      }
    } else {
      setSelectedFile(null);
      setImageSrc('');
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
      setError('');
    }
  }, [isOpen, initialImage]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError(
        lang === 'bn'
          ? 'শুধুমাত্র PNG, JPG বা WebP ছবি গ্রহণযোগ্য।'
          : 'Only PNG, JPG or WebP images are supported.'
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        lang === 'bn'
          ? 'ছবির আকার ১০ মেগাবাইটের কম হতে হবে।'
          : 'Image size must be under 10MB.'
      );
      return;
    }

    setError('');
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  const handleSaveCrop = async () => {
    if (!selectedFile) return;

    setProcessing(true);
    try {
      const croppedDataUrl = await processImageFile(selectedFile, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.88,
        cropSquare: true,
        zoom,
        offsetX,
        offsetY,
      });

      onImageCropped(croppedDataUrl);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Cropping failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Crop className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm tracking-tight">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {!imageSrc ? (
            /* Upload Drop Area */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-900 bg-slate-50 hover:bg-blue-50/40 rounded-2xl p-8 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2.5"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {lang === 'bn'
                    ? 'গ্যালারি বা ফাইল থেকে ছবি নির্বাচন করুন'
                    : 'Choose image from Gallery or Files'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  PNG, JPG, WebP (সর্বোচ্চ ১০MB)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            /* Interactive Cropping Workspace */
            <div className="space-y-3.5">
              <div className="relative w-64 h-64 mx-auto bg-slate-100 rounded-2xl border border-slate-300 overflow-hidden flex items-center justify-center shadow-inner">
                {/* Visual Image with Zoom and Offset */}
                <div
                  className="relative w-full h-full flex items-center justify-center overflow-hidden"
                  style={{
                    cursor: 'grab',
                  }}
                >
                  <img
                    src={imageSrc}
                    alt="Preview"
                    className="max-w-none transition-transform duration-75 select-none"
                    style={{
                      transform: `scale(${zoom}) translate(${offsetX * 50}px, ${offsetY * 50}px)`,
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                    }}
                    draggable={false}
                  />
                </div>

                {/* Crop Boundary Mask Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div
                    className={`w-52 h-52 border-2 border-amber-400 shadow-[0_0_0_9999px_rgba(15,23,42,0.45)] ${
                      aspectRatio === 'circle' ? 'rounded-full' : 'rounded-2xl'
                    }`}
                  />
                </div>
              </div>

              {/* Zoom Controller */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-700 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5 text-blue-900" />
                    <span>{lang === 'bn' ? 'জুম বা স্কেল:' : 'Zoom Scale:'}</span>
                  </span>
                  <span className="font-mono text-blue-900">{zoom.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-blue-900 cursor-pointer"
                />

                {/* Horizontal & Vertical Pan Sliders */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 text-[11px] text-slate-600">
                  <div>
                    <label className="block mb-0.5">
                      {lang === 'bn' ? 'বামে / ডানে:' : 'Pan X:'}
                    </label>
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.05"
                      value={offsetX}
                      onChange={(e) => setOffsetX(Number(e.target.value))}
                      className="w-full accent-slate-700 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block mb-0.5">
                      {lang === 'bn' ? 'উপরে / নিচে:' : 'Pan Y:'}
                    </label>
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.05"
                      value={offsetY}
                      onChange={(e) => setOffsetY(Number(e.target.value))}
                      className="w-full accent-slate-700 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Reset / Choose Different Image */}
              <div className="flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setOffsetX(0);
                    setOffsetY(0);
                  }}
                  className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'রিসেট জুম' : 'Reset Zoom'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-900 hover:text-blue-950 font-bold"
                >
                  {lang === 'bn' ? 'অন্য ছবি বাছাই করুন' : 'Change Image'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl transition-colors"
          >
            {lang === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>

          <button
            type="button"
            disabled={!imageSrc || processing}
            onClick={handleSaveCrop}
            className="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
          >
            <Check className="w-4 h-4 text-amber-400" />
            <span>
              {processing
                ? lang === 'bn'
                  ? 'ক্রপ হচ্ছে...'
                  : 'Cropping...'
                : lang === 'bn'
                ? 'ক্রপ ও সেভ করুন'
                : 'Crop & Save'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
