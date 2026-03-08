import { Play } from 'lucide-react';
import type { GalleryImage } from '@/hooks/gallery/useGallery';
import type { GalleryVideo } from '@/hooks/gallery/useVideos';

export type MediaItem =
  | (GalleryImage & { type: 'photo' })
  | (GalleryVideo & { type: 'video' });

interface GalleryGridProps {
  items: MediaItem[];
  onItemClick: (index: number) => void;
}

const GalleryGrid = ({ items, onItemClick }: GalleryGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <button
          key={item._id}
          onClick={() => onItemClick(index)}
          className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
        >
          <img
            src={item.type === 'photo' ? item.imageUrl : item.thumbnailUrl}
            alt={item.title || 'Gallery item'}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-foreground/60 flex items-center justify-center">
                <Play className="w-6 h-6 text-background fill-background" />
              </div>
            </div>
          )}
          {item.title && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm truncate">{item.title}</p>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default GalleryGrid;
