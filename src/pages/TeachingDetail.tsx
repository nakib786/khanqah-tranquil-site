import { useParams, Link } from 'react-router-dom';
import { translations } from '@/data/translations';
import { teachings as staticTeachings } from '@/data/content';
import { getLang } from '@/lib/i18n';
import Layout from '@/components/Layout';
import TeachingCard from '@/components/TeachingCard';
import PostCard from '@/components/blog/PostCard';
import PostContent from '@/components/blog/PostContent';
import { useBlogPost } from '@/hooks/blog/useBlogPost';
import { useBlogPosts } from '@/hooks/blog/useBlogPosts';
import { resolveWixImageUrl } from '@/lib/wixMedia';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';

const TeachingDetail = () => {
  const { lang: langParam, slug } = useParams<{ lang: string; slug: string }>();
  const lang = getLang(langParam);
  const t = translations[lang];

  // Try Wix first
  const { data: wixData, isLoading: wixLoading } = useBlogPost(slug);
  const { data: relatedData } = useBlogPosts({ limit: 3 });

  const wixPost = wixData?.post as Record<string, unknown> | null;

  // Fallback to static
  const allTeachings = staticTeachings[lang];
  const staticTeaching = allTeachings.find(t => t.slug === slug);

  const isLoading = wixLoading;
  const hasWixPost = !!wixPost;

  // Loading
  if (isLoading) {
    return (
      <Layout lang={lang}>
        <article className="pt-28 pb-16 px-4">
          <div className="container mx-auto max-w-3xl space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-64 w-full mt-8" />
          </div>
        </article>
      </Layout>
    );
  }

  // Wix post
  if (hasWixPost) {
    const title = (wixPost.title as string) ?? '';
    const excerpt = (wixPost.excerpt as string) ?? '';
    const coverImage = wixPost.coverImage as Record<string, unknown> | undefined;
    const imageUrl = resolveWixImageUrl(coverImage?.url as string);
    const richContent = (wixPost.richContent as string) ?? (wixPost.plainContent as string) ?? '';
    const publishedDate = wixPost.lastPublishedDate
      ? new Date(wixPost.lastPublishedDate as string).toLocaleDateString()
      : '';
    const readingTime = (wixPost.minutesToRead as number) ?? 0;
    const relatedPosts = (relatedData?.posts ?? []).filter(
      (p) => (p as Record<string, unknown>).slug !== slug
    ).slice(0, 3);

    return (
      <Layout lang={lang}>
        <SEO
          title={title}
          description={excerpt}
          article={true}
          schema={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": excerpt,
            "author": { "@type": "Organization", "name": "Al Mehfuz" },
          }}
        />
        <article className="pt-28 pb-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <Link
              to={`/${lang}/teachings`}
              className="inline-flex items-center gap-1 text-sm text-primary mb-6 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> {t.teachings.backToList}
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
                {publishedDate && (
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{publishedDate}</span>
                )}
                {readingTime > 0 && (
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{readingTime} {t.common.readingTime}</span>
                )}
              </div>

              {imageUrl && (
                <img src={imageUrl} alt={title} className="w-full rounded-lg mb-8" loading="lazy" />
              )}

              <div className="mb-16">
                <PostContent htmlContent={richContent} />
              </div>
            </motion.div>

            {relatedPosts.length > 0 && (
              <>
                <h2 className="text-2xl font-bold mb-6">{t.common.relatedTeachings}</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedPosts.map(r => (
                    <PostCard key={(r as Record<string, unknown>)._id as string} post={r as Record<string, unknown>} lang={lang} />
                  ))}
                </div>
              </>
            )}
          </div>
        </article>
      </Layout>
    );
  }

  // Fallback: static teaching
  if (!staticTeaching) {
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
      <SEO
        title={staticTeaching.title}
        description={staticTeaching.excerpt}
        article={true}
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": staticTeaching.title,
          "description": staticTeaching.excerpt,
          "datePublished": staticTeaching.date,
          "author": { "@type": "Organization", "name": "Al Mehfuz" },
        }}
      />
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
              {staticTeaching.tags.map(tag => (
                <span key={tag} className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{staticTeaching.title}</h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{staticTeaching.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{staticTeaching.readingTime} {t.common.readingTime}</span>
            </div>

            <div className="mb-16">
              {staticTeaching.content.split('\n\n').map((para, i) => (
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
