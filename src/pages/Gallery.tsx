import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { translations } from '@/data/translations';
import { albums } from '@/data/content';
import { getLang } from '@/lib/i18n';
import Layout from '@/components/Layout';
import GalleryModal from '@/components/GalleryModal';
import GallerySlideshow from '@/components/gallery/GallerySlideshow';
import GalleryLightbox from '@/components/gallery/GalleryLightbox';
import { useGallery } from '@/hooks/gallery/useGallery';
import { useVideos } from '@/hooks/gallery/useVideos';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Image, Video } from 'lucide-react';
import type { MediaItem } from '@/components/gallery/GalleryGrid';

const albumGradients = [
  ['158 30% 75%', '158 40% 55%'],
  ['38 35% 78%', '38 45% 58%'],
  ['200 25% 75%', '200 35% 55%'],
  ['280 20% 78%', '280 30% 60%'],
];

type FolderType = 'photos' | 'videos';

const GalleryPage = () => {
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = getLang(langParam);
  const t = translations[lang];
  const albumsData = albums[lang];

  const [openAlbum, setOpenAlbum] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);

  const { data: galleryData, isLoading: loadingPhotos } = useGallery();
  const { data: videosData, isLoading: loadingVideos } = useVideos();

  const allPhotos = galleryData?.images ?? [];
  const allVideos = videosData?.videos ?? [];
  const isLoading = loadingPhotos || loadingVideos;
  const hasWixData = allPhotos.length > 0 || allVideos.length > 0;

  const photoItems: MediaItem[] = useMemo(
    () => allPhotos.map(p => ({ ...p, type: 'photo' as const })),
    [allPhotos]
  );

  const videoItems: MediaItem[] = useMemo(
    () => allVideos.map(v => ({ ...v, type: 'video' as const })),
    [allVideos]
  );

  const currentMedia = selectedFolder === 'photos' ? photoItems : selectedFolder === 'videos' ? videoItems : [];

  const folders = useMemo(() => {
    const list: { key: FolderType; label: string; count: number; cover?: string; icon: typeof Image }[] = [];
    if (allPhotos.length > 0) {
      list.push({
        key: 'photos',
        label: t.gallery.photos,
        count: allPhotos.length,
        cover: allPhotos[0]?.imageUrl,
        icon: Image,
      });
    }
    if (allVideos.length > 0) {
      list.push({
        key: 'videos',
        label: t.gallery.videos,
        count: allVideos.length,
        cover: allVideos[0]?.thumbnailUrl,
        icon: Video,
      });
    }
    return list;
  }, [allPhotos, allVideos, t]);

  return (
    <Layout lang={lang}>
      <SEO title={t.gallery.title} />
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-8">
            {t.gallery.title}
          </motion.h1>

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
              ))}
            </div>
          )}

          {/* Folder view */}
          {!isLoading && hasWixData && !selectedFolder && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {folders.map((folder, i) => {
                const gradIdx = i % albumGradients.length;
                const Icon = folder.icon;
                return (
                  <motion.button
                    key={folder.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setSelectedFolder(folder.key)}
                    className="text-start group"
                  >
                    <div
                      className="aspect-[4/3] rounded-lg overflow-hidden mb-3 relative"
                      style={
                        folder.cover
                          ? undefined
                          : { background: `linear-gradient(135deg, hsl(${albumGradients[gradIdx]?.[0]}), hsl(${albumGradients[gradIdx]?.[1]}))` }
                      }
                    >
                      {folder.cover ? (
                        <img
                          src={folder.cover}
                          alt={folder.label}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, hsl(${albumGradients[gradIdx]?.[0]}), hsl(${albumGradients[gradIdx]?.[1]}))` }}
                        >
                          <Icon className="w-12 h-12 text-primary-foreground/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 start-3 end-3">
                        <h3 className="text-white font-semibold text-lg capitalize">{folder.label}</h3>
                        <div className="flex items-center gap-2 text-white/70 text-xs mt-1">
                          <Icon className="w-3 h-3" /> {folder.count}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Inside a folder — slideshow */}
          {!isLoading && hasWixData && selectedFolder && (
            <>
              <button
                onClick={() => { setSelectedFolder(null); setLightboxIndex(null); }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> {t.gallery.backToAlbums}
              </button>
              <h2 className="text-2xl font-semibold mb-6 capitalize">
                {selectedFolder === 'photos' ? t.gallery.photos : t.gallery.videos}
              </h2>

              {currentMedia.length === 0 ? (
                <p className="text-muted-foreground">{t.gallery.noMedia}</p>
              ) : (
                <GallerySlideshow items={currentMedia} onOpenLightbox={setLightboxIndex} />
              )}

              {lightboxIndex !== null && (
                <GalleryLightbox
                  items={currentMedia}
                  startIndex={lightboxIndex}
                  onClose={() => setLightboxIndex(null)}
                />
              )}
            </>
          )}

          {/* Empty / fallback */}
          {!isLoading && !hasWixData && (
            <div className="grid md:grid-cols-3 gap-6">
              {albumsData.map((album, i) => (
                <motion.button
                  key={album.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setOpenAlbum(i)}
                  className="text-start group"
                >
                  <div
                    className="aspect-[4/3] rounded-lg overflow-hidden mb-3 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, hsl(${albumGradients[i % albumGradients.length]?.[0]}), hsl(${albumGradients[i % albumGradients.length]?.[1]}))` }}
                  >
                    <span className="text-primary-foreground/40 text-sm">{album.imageCount} {t.gallery.photos}</span>
                  </div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{album.title}</h3>
                  <p className="text-sm text-muted-foreground">{album.imageCount} {t.gallery.photos}</p>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {openAlbum !== null && (
        <GalleryModal album={albumsData[openAlbum]} onClose={() => setOpenAlbum(null)} />
      )}
    </Layout>
  );
};

export default GalleryPage;
