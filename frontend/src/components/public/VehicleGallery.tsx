"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, Image as ImageIcon } from 'lucide-react';

interface Props {
  images: string[];
  title: string;
  mediaAngles?: Record<string, string | string[] | undefined>;
}

export function VehicleGallery({ images = [], title, mediaAngles }: Props) {
  // Combine general images and mediaAngles into one consolidated list of unique URLs
  const allImages = React.useMemo(() => {
    const list: { url: string; label?: string }[] = [];
    const addedUrls = new Set<string>();

    // Add media angles with labels first
    if (mediaAngles) {
      const angleKeys: { key: string; label: string }[] = [
        { key: 'front', label: 'Front Exterior' },
        { key: 'rear', label: 'Rear View' },
        { key: 'left', label: 'Side Profile' },
        { key: 'right', label: 'Side Profile' },
        { key: 'interior', label: 'Interior Cabin' },
        { key: 'dashboard', label: 'Cockpit & Steering' },
        { key: 'engine', label: 'Engine Bay' },
        { key: 'wheels', label: 'Alloy Wheels' },
      ];

      for (const { key, label } of angleKeys) {
        const val = mediaAngles[key];
        if (typeof val === 'string' && val.trim() && !addedUrls.has(val)) {
          list.push({ url: val, label });
          addedUrls.add(val);
        }
      }
    }

    // Add standard images
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (img && typeof img === 'string' && !addedUrls.has(img)) {
        list.push({ url: img, label: `Photo ${list.length + 1}` });
        addedUrls.add(img);
      }
    }

    if (list.length === 0) {
      list.push({
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
        label: 'Dealership Preview',
      });
    }

    return list;
  }, [images, mediaAngles]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentImage = allImages[activeIndex] || allImages[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-4">
      {/* Main Image View */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 group shadow-xl">
        <img
          src={currentImage.url}
          alt={`${title} - ${currentImage.label || 'Vehicle Image'}`}
          className="w-full h-full object-cover object-center transition-all duration-300"
        />

        {/* Gradient backdrop for controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Current Photo Label */}
        {currentImage.label && (
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-amber-400 border border-slate-700/80">
              {currentImage.label}
            </span>
          </div>
        )}

        {/* Fullscreen Trigger */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white hover:text-amber-400 hover:bg-slate-900 transition-colors border border-slate-700/60"
          title="Open Fullscreen Gallery"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous Image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white hover:text-amber-400 hover:bg-slate-900 transition-all opacity-80 group-hover:opacity-100 border border-slate-700/60"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white hover:text-amber-400 hover:bg-slate-900 transition-all opacity-80 group-hover:opacity-100 border border-slate-700/60"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Photo Counter */}
        <div className="absolute bottom-4 right-4 z-10 px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-xs font-medium text-slate-300 border border-slate-800">
          {activeIndex + 1} / {allImages.length}
        </div>
      </div>

      {/* Thumbnails Strip */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
          {allImages.map((img, idx) => (
            <button
              key={`${img.url}-${idx}`}
              onClick={() => setActiveIndex(idx)}
              className={`relative shrink-0 w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden border-2 transition-all ${
                activeIndex === idx
                  ? 'border-amber-400 ring-2 ring-amber-400/20 scale-102'
                  : 'border-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img.url}
                alt={img.label || `Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 z-50 p-3 rounded-full bg-slate-900/80 text-white hover:text-amber-400 border border-slate-700"
            aria-label="Close fullscreen gallery"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev/Next arrows in Lightbox */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                aria-label="Previous Image"
                className="absolute left-6 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-slate-900/80 text-white hover:text-amber-400 border border-slate-700"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Image"
                className="absolute right-6 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-slate-900/80 text-white hover:text-amber-400 border border-slate-700"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Lightbox Center Image */}
          <div
            className="relative max-w-6xl max-h-[85vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.url}
              alt={title}
              className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
            <div className="mt-4 text-center">
              <p className="text-white font-medium text-sm">
                {title} {currentImage.label ? `— ${currentImage.label}` : ''}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Image {activeIndex + 1} of {allImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
