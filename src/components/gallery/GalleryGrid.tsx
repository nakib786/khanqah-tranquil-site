import type { GalleryImage } from '@/hooks/gallery/useGallery';

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
}

const GalleryGrid = ({ images, onImageClick }: GalleryGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <button
          key={image._id}
          onClick={() => onImageClick(index)}
          className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
        >
          <img
            src={image.imageUrl}
            alt={image.title || 'Gallery image'}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {image.title && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm truncate">{image.title}</p>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default GalleryGrid;
