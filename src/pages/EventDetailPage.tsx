import { useParams, Link } from 'react-router-dom';
import { translations } from '@/data/translations';
import { getLang } from '@/lib/i18n';
import Layout from '@/components/Layout';
import { useEvent } from '@/hooks/events/useEvent';
import { resolveWixImageUrl } from '@/lib/wixMedia';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';

const EventDetailPage = () => {
  const { lang: langParam, slug } = useParams<{ lang: string; slug: string }>();
  const lang = getLang(langParam);
  const t = translations[lang];

  const { data, isLoading } = useEvent(slug);
  const event = data?.event;

  if (isLoading) {
    return (
      <Layout lang={lang}>
        <article className="pt-28 pb-16 px-4">
          <div className="container mx-auto max-w-3xl space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </article>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout lang={lang}>
        <div className="py-16 px-4 text-center">
          <p className="text-muted-foreground mb-4">Event not found.</p>
          <Link to={`/${lang}/activities`} className="text-primary hover:underline">
            ← {t.activities.title}
          </Link>
        </div>
      </Layout>
    );
  }

  const title = (event.title as string) ?? '';
  const description = (event.description as string) ?? '';
  const location = (event.location as string) ?? '';
  const coverImage = resolveWixImageUrl(event.coverImage as string);
  const eventDate = event.eventDate
    ? new Date(event.eventDate as string).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : '';

  return (
    <Layout lang={lang}>
      <SEO title={title} description={description} />
      <article className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <Link
            to={`/${lang}/activities`}
            className="inline-flex items-center gap-1 text-sm text-primary mb-6 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> {t.activities.title}
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
              {eventDate && (
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{eventDate}</span>
              )}
              {location && (
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{location}</span>
              )}
            </div>

            {coverImage && (
              <img src={coverImage} alt={title} className="w-full rounded-lg mb-8" loading="lazy" />
            )}

            <div
              className="prose prose-lg max-w-none text-foreground/80"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </motion.div>
        </div>
      </article>
    </Layout>
  );
};

export default EventDetailPage;
