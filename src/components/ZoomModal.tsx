import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { UploadedPage } from '../types/exam';

interface ZoomModalProps {
  pages: UploadedPage[];
  initialIndex: number;
  onClose: () => void;
}

export const ZoomModal: React.FC<ZoomModalProps> = ({ pages, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

  const currentPage = pages[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setZoomLevel(1);
      setRotation(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < pages.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setZoomLevel(1);
      setRotation(0);
    }
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.5));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  if (!currentPage) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-md text-white animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="bg-emerald-500/20 text-emerald-400 font-semibold px-3 py-1 rounded-full text-sm border border-emerald-500/30">
            পৃষ্ঠা {currentPage.pageNumber} / {pages.length}
          </span>
          <h3 className="text-base font-medium text-slate-200 truncate max-w-md">
            {currentPage.name}
          </h3>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            title="জুম আউট"
          >
            <ZoomOut size={18} />
          </button>
          <span className="text-xs font-mono text-slate-400 px-1">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            title="জুম ইন"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={handleRotate}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition ml-2"
            title="ঘুরান"
          >
            <RotateCw size={18} />
          </button>

          <div className="h-6 w-px bg-slate-700 mx-2" />

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white transition"
            title="বন্ধ করুন"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Image View Area */}
      <div className="relative flex-1 overflow-auto flex items-center justify-center p-6 bg-slate-950">
        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white shadow-xl border border-slate-700 transition"
            title="পূর্ববর্তী পাতা"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {currentIndex < pages.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white shadow-xl border border-slate-700 transition"
            title="পরবর্তী পাতা"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Display Image */}
        <div
          className="transition-transform duration-150 ease-out origin-center select-none shadow-2xl rounded-lg overflow-hidden bg-white"
          style={{
            transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
          }}
        >
          <img
            src={currentPage.previewUrl}
            alt={currentPage.name}
            className="max-h-[85vh] max-w-[85vw] object-contain block"
          />
        </div>
      </div>
    </div>
  );
};
