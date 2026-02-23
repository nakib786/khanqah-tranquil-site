import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Album } from '@/data/content';

interface Props {
  album: Album;
  onClose: () => void;
}

const gradients = [
  '158 30% 75%, 158 40% 55%',
  '38 30% 78%, 38 40% 60%',
  '200 25% 75%, 200 35% 55%',
  '280 20% 78%, 280 30% 60%',
  '20 30% 78%, 20 40% 58%',
  '120 25% 75%, 120 35% 55%',
  '45 35% 78%, 45 45% 58%',
  '170 25% 75%, 170 35% 55%',
];

const GalleryModal = ({ album, onClose }: Props) => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(c => Math.min(album.imageCount - 1, c + 1)), [album.imageCount]);
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

  const g = gradients[current % gradients.length].split(', ');

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/85 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={album.title}
    >
      <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 end-0 text-primary-foreground/80 hover:text-primary-foreground" aria-label="Close">
          <X className="w-6 h-6" />
        </button>
        <div
          className="aspect-video rounded-lg flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, hsl(${g[0]}), hsl(${g[1]}))` }}
        >
          <span className="text-primary-foreground/50 text-sm">Image {current + 1} of {album.imageCount}</span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button onClick={prev} disabled={current === 0} className="text-primary-foreground/80 disabled:opacity-30 hover:text-primary-foreground" aria-label="Previous">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <span className="text-primary-foreground/70 text-sm">{current + 1} / {album.imageCount}</span>
          <button onClick={next} disabled={current === album.imageCount - 1} className="text-primary-foreground/80 disabled:opacity-30 hover:text-primary-foreground" aria-label="Next">
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;
