import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { translations } from '@/data/translations';
import { albums } from '@/data/content';
import { getLang } from '@/lib/i18n';
import Layout from '@/components/Layout';
import GalleryModal from '@/components/GalleryModal';
import GalleryGrid, { type MediaItem } from '@/components/gallery/GalleryGrid';
import GalleryLightbox from '@/components/gallery/GalleryLightbox';
import { useGallery } from '@/hooks/gallery/useGallery';
import { useVideos } from '@/hooks/gallery/useVideos';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, FolderOpen, Image, Video } from 'lucide-react';

const albumGradients = [
  ['158 30% 75%', '158 40% 55%'],
  ['38 35% 78%', '38 45% 58%'],
  ['200 25% 75%', '200 35% 55%'],
  ['280 20% 78%', '280 30% 60%'],
  ['20 30% 78%', '20 40% 58%'],
  ['340 25% 75%', '340 35% 55%'],
];

const GalleryPage = () => {
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = getLang(langParam);
  const t = translations[lang];
  const albumsData = albums[lang];

  const [openAlbum, setOpenAlbum] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const { data: galleryData, isLoading: loadingPhotos } = useGallery();
  const { data: videosData, isLoading: loadingVideos } = useVideos();

  const allPhotos = galleryData?.images ?? [];
  const allVideos = videosData?.videos ?? [];
  const isLoading = loadingPhotos || loadingVideos;
  const hasWixData = allPhotos.length > 0 || allVideos.length > 0;

  // Build event-based folders
  const folders = useMemo(() => {
    const map = new Map<string, { photos: typeof allPhotos; videos: typeof allVideos }>();

    allPhotos.forEach((img) => {
      const cat = img.category || 'General';
      if (!map.has(cat)) map.set(cat, { photos: [], videos: [] });
      map.get(cat)!.photos.push(img);
    });

    allVideos.forEach((vid) => {
      const cat = vid.category || 'General';
      if (!map.has(cat)) map.set(cat, { photos: [], videos: [] });
      map.get(cat)!.videos.push(vid);
    });

    return Array.from(map.entries()).map(([name, data]) => ({
      name,
      photoCount: data.photos.length,
      videoCount: data.videos.length,
      totalCount: data.photos.length + data.videos.length,
      photos: data.photos,
      videos: data.videos,
    }));
  }, [allPhotos, allVideos]);

  // Media items for the selected folder
  const currentMedia: MediaItem[] = useMemo(() => {
    if (!selectedFolder) return [];
    const folder = folders.find(f => f.name === selectedFolder);
    if (!folder) return [];
    const photos: MediaItem[] = folder.photos.map(p => ({ ...p, type: 'photo' as const }));
    const videos: MediaItem[] = folder.videos.map(v => ({ ...v, type: 'video' as const }));
    return [...photos, ...videos];
  }, [selectedFolder, folders]);

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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
              ))}
            </div>
          )}

          {/* Wix-powered folder view */}
          {!isLoading && hasWixData && !selectedFolder && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {folders.map((folder, i) => {
                const gradIdx = i % albumGradients.length;
                const coverPhoto = folder.photos[0];
                return (
                  <motion.button
                    key={folder.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setSelectedFolder(folder.name)}
                    className="text-start group"
                  >
                    <div
                      className="aspect-[4/3] rounded-lg overflow-hidden mb-3 relative"
                      style={
                        coverPhoto
                          ? undefined
                          : { background: `linear-gradient(135deg, hsl(${albumGradients[gradIdx]?.[0]}), hsl(${albumGradients[gradIdx]?.[1]}))` }
                      }
                    >
                      {coverPhoto ? (
                        <img
                          src={coverPhoto.imageUrl}
                          alt={folder.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FolderOpen className="w-12 h-12 text-primary-foreground/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 start-3 end-3">
                        <h3 className="text-white font-semibold text-lg truncate">{folder.name}</h3>
                        <div className="flex items-center gap-3 text-white/70 text-xs mt-1">
                          {folder.photoCount > 0 && (
                            <span className="flex items-center gap-1">
                              <Image className="w-3 h-3" /> {folder.photoCount} {t.gallery.photos}
                            </span>
                          )}
                          {folder.videoCount > 0 && (
                            <span className="flex items-center gap-1">
                              <Video className="w-3 h-3" /> {folder.videoCount} {t.gallery.videos}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Inside a folder */}
          {!isLoading && hasWixData && selectedFolder && (
            <>
              <button
                onClick={() => { setSelectedFolder(null); setLightboxIndex(null); }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> {t.gallery.backToAlbums}
              </button>
              <h2 className="text-2xl font-semibold mb-6">{selectedFolder}</h2>

              {currentMedia.length === 0 ? (
                <p className="text-muted-foreground">{t.gallery.noMedia}</p>
              ) : (
                <GalleryGrid items={currentMedia} onItemClick={setLightboxIndex} />
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

          {/* Empty state */}
          {!isLoading && !hasWixData && folders.length === 0 && (
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
                    style={{ background: `linear-gradient(135deg, hsl(${albumGradients[i]?.[0]}), hsl(${albumGradients[i]?.[1]}))` }}
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
