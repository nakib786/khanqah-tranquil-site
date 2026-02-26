import { useParams, Link } from 'react-router-dom';
import { translations } from '@/data/translations';
import { teachings } from '@/data/content';
import { getLang } from '@/lib/i18n';
import Layout from '@/components/Layout';
import TeachingCard from '@/components/TeachingCard';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const TeachingDetail = () => {
  const { lang: langParam, slug } = useParams<{ lang: string; slug: string }>();
  const lang = getLang(langParam);
  const t = translations[lang];
  const allTeachings = teachings[lang];
  const teaching = allTeachings.find(t => t.slug === slug);

  if (!teaching) {
    return (
      <Layout lang={lang}>
        <div className="py-16 px-4 text-center">
          <p className="text-muted-foreground mb-4">Teaching not found.</p>
          <Link to={`/${lang}/teachings`} className="text-primary hover:underline">
            ← {t.teachings.backToList}
          </Link>
        </div>
      </Layout>
    );
  }

  const related = allTeachings.filter(t => t.slug !== slug).slice(0, 3);

  return (
    <Layout lang={lang}>
      <article className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <Link
            to={`/${lang}/teachings`}
            className="inline-flex items-center gap-1 text-sm text-primary mb-6 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> {t.teachings.backToList}
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap gap-2 mb-4">
              {teaching.tags.map(tag => (
                <span key={tag} className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{teaching.title}</h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{teaching.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{teaching.readingTime} {t.common.readingTime}</span>
            </div>

            <div className="mb-16">
              {teaching.content.split('\n\n').map((para, i) => (
                <p key={i} className="text-foreground/80 leading-relaxed mb-5 text-lg">{para}</p>
              ))}
            </div>
          </motion.div>

          {related.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mb-6">{t.common.relatedTeachings}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {related.map(r => (
                  <TeachingCard key={r.slug} teaching={r} lang={lang} />
                ))}
              </div>
            </>
          )}
        </div>
      </article>
    </Layout>
  );
};

export default TeachingDetail;
