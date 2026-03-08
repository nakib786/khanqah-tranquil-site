import { useState, useEffect, useCallback, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { MediaItem } from './GalleryGrid';

interface GalleryLightboxProps {
  items: MediaItem[];
  startIndex: number;
  onClose: () => void;
}

function getEmbedUrl(url: string): { type: 'iframe' | 'video'; src: string } {
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) {
    return { type: 'iframe', src: `https://drive.google.com/file/d/${driveMatch[1]}/preview` };
  }
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/);
  if (ytMatch) {
    return { type: 'iframe', src: `https://www.youtube.com/embed/${ytMatch[1]}` };
  }
  return { type: 'video', src: url };
}

function getOrientation(item: MediaItem): 'portrait' | 'landscape' {
  if (item.type === 'photo') {
    const match = item.imageUrl?.match(/originWidth=(\d+)&originHeight=(\d+)/);
    if (match) {
      const w = parseInt(match[1], 10);
      const h = parseInt(match[2], 10);
      if (h > w) return 'portrait';
    }
  }
  return 'landscape';
}

const GalleryLightbox = ({ items, startIndex, onClose }: GalleryLightboxProps) => {
  const [current, setCurrent] = useState(startIndex);

  const next = useCallback(() => setCurrent(c => Math.min(items.length - 1, c + 1)), [items.length]);
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

  const item = items[current];
  const embed = item.type === 'video' ? getEmbedUrl(item.videoUrl || '') : null;
  const orientation = useMemo(() => getOrientation(item), [item]);
  const isPortrait = orientation === 'portrait';

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/85 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={`relative ${isPortrait ? 'max-w-md' : 'max-w-4xl'} w-full`} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 end-0 text-primary-foreground/80 hover:text-primary-foreground" aria-label="Close">
          <X className="w-6 h-6" />
        </button>

        <div className={`rounded-lg overflow-hidden bg-muted flex items-center justify-center ${
          isPortrait ? 'aspect-[3/4]' : 'aspect-video'
        }`}>
          {item.type === 'photo' ? (
            <img
              src={item.imageUrl}
              alt={item.title || 'Gallery image'}
              className="max-w-full max-h-full object-contain"
            />
          ) : embed?.type === 'iframe' ? (
            <iframe
              src={embed.src}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={item.title || 'Video'}
            />
          ) : (
            <video
              src={embed?.src}
              controls
              autoPlay
              className="max-w-full max-h-full"
              poster={item.thumbnailUrl}
            >
              Your browser does not support video playback.
            </video>
          )}
        </div>

        {item.title && (
          <p className="text-center text-primary-foreground/80 text-sm mt-2">{item.title}</p>
        )}
        <div className="flex justify-between items-center mt-4">
          <button onClick={prev} disabled={current === 0} className="text-primary-foreground/80 disabled:opacity-30 hover:text-primary-foreground" aria-label="Previous">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <span className="text-primary-foreground/70 text-sm">{current + 1} / {items.length}</span>
          <button onClick={next} disabled={current === items.length - 1} className="text-primary-foreground/80 disabled:opacity-30 hover:text-primary-foreground" aria-label="Next">
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GalleryLightbox;
