import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { translations } from '@/data/translations';
import { albums } from '@/data/content';
import { getLang } from '@/lib/i18n';
import Layout from '@/components/Layout';
import GalleryModal from '@/components/GalleryModal';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import GalleryLightbox from '@/components/gallery/GalleryLightbox';
import { useGallery } from '@/hooks/gallery/useGallery';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';

const albumGradients = [
  ['158 30% 75%', '158 40% 55%'],
  ['38 35% 78%', '38 45% 58%'],
  ['200 25% 75%', '200 35% 55%'],
];

const GalleryPage = () => {
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = getLang(langParam);
  const t = translations[lang];
  const albumsData = albums[lang];

  const [openAlbum, setOpenAlbum] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);

  const { data: galleryData, isLoading } = useGallery({ category: activeCategory });
  const wixImages = galleryData?.images ?? [];
  const hasWixImages = wixImages.length > 0;

  // Extract unique categories from Wix data
  const categories = useMemo(() => {
    const cats = new Set<string>();
    wixImages.forEach((img) => {
      if (img.category) cats.add(img.category);
    });
    return Array.from(cats);
  }, [wixImages]);

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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          )}

          {/* Wix Gallery */}
          {!isLoading && hasWixImages && (
            <>
              {categories.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setActiveCategory(undefined)}
                    className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                      !activeCategory ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'
                    }`}
                  >
                    {t.common.allCategories}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat === activeCategory ? undefined : cat)}
                      className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                        activeCategory === cat ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              <GalleryGrid images={wixImages} onImageClick={setLightboxIndex} />

              {lightboxIndex !== null && (
                <GalleryLightbox
                  images={wixImages}
                  startIndex={lightboxIndex}
                  onClose={() => setLightboxIndex(null)}
                />
              )}
            </>
          )}

          {/* Fallback: static albums */}
          {!isLoading && !hasWixImages && (
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
