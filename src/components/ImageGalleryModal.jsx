import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageGalleryModal = ({ isOpen, onClose, onNext, onPrev, hasNext, hasPrev, imageSrc, imageTitle }) => {
  // Efek untuk menangani navigasi keyboard (panah kiri/kanan dan Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowRight' && hasNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        onPrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Membersihkan event listener saat komponen di-unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onNext, onPrev, onClose, hasNext, hasPrev]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center"
      onClick={onClose} // Menutup modal saat mengklik area latar belakang
    >
      {/* Tombol Tutup (X) */}
      <button 
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-50"
        onClick={onClose}
      >
        <X size={32} />
      </button>

      {/* Tombol Navigasi "Previous" */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }} // Mencegah penutupan modal
        disabled={!hasPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-opacity z-50 p-2 bg-black/20 rounded-full"
      >
        <ChevronLeft size={40} />
      </button>

      {/* Kontainer Gambar */}
      <div 
        className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Mencegah penutupan modal saat mengklik gambar
      >
        <img 
          src={imageSrc} 
          alt={imageTitle}
          className="object-contain w-full h-full" 
        />
        <p className="text-white text-lg mt-4">{imageTitle}</p>
      </div>

      {/* Tombol Navigasi "Next" */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }} // Mencegah penutupan modal
        disabled={!hasNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-opacity z-50 p-2 bg-black/20 rounded-full"
      >
        <ChevronRight size={40} />
      </button>
    </div>
  );
};

export default ImageGalleryModal;
