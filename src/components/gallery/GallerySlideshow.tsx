import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play as PlayIcon, Maximize2 } from 'lucide-react';
import type { MediaItem } from './GalleryGrid';

interface GallerySlideshowProps {
  items: MediaItem[];
  onOpenLightbox: (index: number) => void;
}

/** Extract originWidth/originHeight from wix image URI hash */
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

/** Convert Google Drive share links to a direct thumbnail URL */
function resolveThumbUrl(url: string | undefined): string {
  if (!url) return '';
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w800`;
  }
  return url;
}

const GallerySlideshow = ({ items, onOpenLightbox }: GallerySlideshowProps) => {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);

  const next = useCallback(() => setCurrent(c => (c + 1) % items.length), [items.length]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (!playing || items.length <= 1) return;
    if (items[current]?.type === 'video') return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [playing, current, next, items]);

  const orientation = useMemo(() => getOrientation(items[current]), [items, current]);

  if (items.length === 0) return null;

  const item = items[current];
  const isVideo = item.type === 'video';
  const isPortrait = orientation === 'portrait';

  return (
    <div className="space-y-4">
      {/* Main slide — adapts to content orientation */}
      <div className={`relative mx-auto rounded-xl overflow-hidden bg-black group cursor-pointer transition-all duration-300 ${
        isPortrait ? 'max-w-sm aspect-[3/4]' : 'w-full aspect-video'
      }`} onClick={() => onOpenLightbox(current)}>
        {isVideo ? (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={resolveThumbUrl(item.thumbnailUrl)}
              alt={item.title || 'Video'}
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-foreground/60 flex items-center justify-center">
                <PlayIcon className="w-8 h-8 text-background fill-background" />
              </div>
            </div>
          </div>
        ) : (
          <img
            src={item.imageUrl}
            alt={item.title || 'Gallery image'}
            className="w-full h-full object-contain"
          />
        )}

        {item.title && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-white text-lg font-medium">{item.title}</p>
          </div>
        )}

        <div className="absolute top-3 end-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-5 h-5 text-white drop-shadow-lg" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={prev} className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Previous">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setPlaying(p => !p)}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
        </button>
        <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
          {current + 1} / {items.length}
        </span>
        <button onClick={next} className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Next">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {items.map((it, i) => (
          <button
            key={it._id}
            onClick={() => setCurrent(i)}
            className={`flex-shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-all ${
              i === current ? 'border-primary ring-1 ring-primary' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={it.type === 'photo' ? it.imageUrl : resolveThumbUrl(it.thumbnailUrl)}
              alt={it.title || ''}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default GallerySlideshow;
