import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryImage } from '@/hooks/gallery/useGallery';

interface GalleryLightboxProps {
  images: GalleryImage[];
  startIndex: number;
  onClose: () => void;
}

const GalleryLightbox = ({ images, startIndex, onClose }: GalleryLightboxProps) => {
  const [current, setCurrent] = useState(startIndex);

  const next = useCallback(() => setCurrent(c => Math.min(images.length - 1, c + 1)), [images.length]);
  const prev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, next, prev]);

  const image = images[current];

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/85 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 end-0 text-primary-foreground/80 hover:text-primary-foreground" aria-label="Close">
          <X className="w-6 h-6" />
        </button>
        <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          <img
            src={image.imageUrl}
            alt={image.title || 'Gallery image'}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        {image.title && (
          <p className="text-center text-primary-foreground/80 text-sm mt-2">{image.title}</p>
        )}
        <div className="flex justify-between items-center mt-4">
          <button onClick={prev} disabled={current === 0} className="text-primary-foreground/80 disabled:opacity-30 hover:text-primary-foreground" aria-label="Previous">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <span className="text-primary-foreground/70 text-sm">{current + 1} / {images.length}</span>
          <button onClick={next} disabled={current === images.length - 1} className="text-primary-foreground/80 disabled:opacity-30 hover:text-primary-foreground" aria-label="Next">
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GalleryLightbox;
