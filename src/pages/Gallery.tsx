import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { translations } from '@/data/translations';
import { albums } from '@/data/content';
import { getLang } from '@/lib/i18n';
import Layout from '@/components/Layout';
import GalleryModal from '@/components/GalleryModal';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

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

  return (
    <Layout lang={lang}>
      <SEO title={t.gallery.title} />
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-8">
            {t.gallery.title}
          </motion.h1>

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
                  style={{ background: `linear-gradient(135deg, hsl(${albumGradients[i][0]}), hsl(${albumGradients[i][1]}))` }}
                >
                  <span className="text-primary-foreground/40 text-sm">{album.imageCount} {t.gallery.photos}</span>
                </div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">{album.title}</h3>
                <p className="text-sm text-muted-foreground">{album.imageCount} {t.gallery.photos}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {openAlbum !== null && (
        <GalleryModal album={albumsData[openAlbum]} onClose={() => setOpenAlbum(null)} />
      )}
    </Layout>
  );
};

export default GalleryPage;
