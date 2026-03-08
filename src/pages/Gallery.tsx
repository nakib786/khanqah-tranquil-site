import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { translations } from '@/data/translations';
import { getLang } from '@/lib/i18n';
import Layout from '@/components/Layout';
import GallerySlideshow from '@/components/gallery/GallerySlideshow';
import GalleryLightbox from '@/components/gallery/GalleryLightbox';
import { useGallery } from '@/hooks/gallery/useGallery';
import { useVideos } from '@/hooks/gallery/useVideos';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';
import type { MediaItem } from '@/components/gallery/GalleryGrid';

const GalleryPage = () => {
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = getLang(langParam);
  const t = translations[lang];

  const [lightboxItems, setLightboxItems] = useState<MediaItem[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { data: galleryData, isLoading: loadingPhotos } = useGallery();
  const { data: videosData, isLoading: loadingVideos } = useVideos();

  const isLoading = loadingPhotos || loadingVideos;

  const photoItems: MediaItem[] = useMemo(
    () => (galleryData?.images ?? []).map(p => ({ ...p, type: 'photo' as const })),
    [galleryData]
  );

  const videoItems: MediaItem[] = useMemo(
    () => (videosData?.videos ?? []).map(v => ({ ...v, type: 'video' as const })),
    [videosData]
  );

  const openLightbox = (items: MediaItem[], index: number) => {
    setLightboxItems(items);
    setLightboxIndex(index);
  };

  return (
    <Layout lang={lang}>
      <SEO title={t.gallery.title} />
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-5xl space-y-12">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold">
            {t.gallery.title}
          </motion.h1>

          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="aspect-video rounded-lg" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-20 h-14 rounded-md" />
                ))}
              </div>
            </div>
          )}

          {/* Photos section */}
          {!isLoading && photoItems.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 capitalize">{t.gallery.photos}</h2>
              <GallerySlideshow items={photoItems} onOpenLightbox={(i) => openLightbox(photoItems, i)} />
            </div>
          )}

          {/* Videos section */}
          {!isLoading && videoItems.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 capitalize">{t.gallery.videos}</h2>
              <GallerySlideshow items={videoItems} onOpenLightbox={(i) => openLightbox(videoItems, i)} />
            </div>
          )}

          {/* Empty state */}
          {!isLoading && photoItems.length === 0 && videoItems.length === 0 && (
            <p className="text-muted-foreground">{t.gallery.noMedia}</p>
          )}
        </div>
      </section>

      {lightboxItems && (
        <GalleryLightbox
          items={lightboxItems}
          startIndex={lightboxIndex}
          onClose={() => setLightboxItems(null)}
        />
      )}
    </Layout>
  );
};

export default GalleryPage;
