import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { translations } from '@/data/translations';
import { teachings as staticTeachings } from '@/data/content';
import { getLang } from '@/lib/i18n';
import Layout from '@/components/Layout';
import TeachingCard from '@/components/TeachingCard';
import PostCard from '@/components/blog/PostCard';
import CategoryFilter from '@/components/blog/CategoryFilter';
import BlogPagination from '@/components/blog/BlogPagination';
import { useBlogPosts } from '@/hooks/blog/useBlogPosts';
import { useBlogCategories } from '@/hooks/blog/useBlogCategories';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';

const POSTS_PER_PAGE = 9;

const TeachingsPage = () => {
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = getLang(langParam);
  const t = translations[lang];
  const staticData = staticTeachings[lang];

  const [search, setSearch] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: postsData, isLoading: postsLoading } = useBlogPosts({
    page,
    limit: POSTS_PER_PAGE,
    categoryId: activeCategoryId ?? undefined,
  });
  const { data: categoriesData } = useBlogCategories();

  const wixPosts = postsData?.posts ?? [];
  const totalCount = postsData?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);
  const wixCategories = categoriesData?.categories ?? [];
  const hasWixData = wixPosts.length > 0;

  // Filter static data for search (fallback)
  const filteredStatic = staticData.filter(teaching => {
    const q = search.toLowerCase();
    return !search || teaching.title.toLowerCase().includes(q) || teaching.excerpt.toLowerCase().includes(q);
  });

  return (
    <Layout lang={lang}>
      <SEO title={t.teachings.title} />
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-8">
            {t.teachings.title}
          </motion.h1>

          <div className="relative mb-6 max-w-md">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.common.search}
              className="w-full ps-10 pe-4 py-2.5 border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
              aria-label={t.common.search}
            />
          </div>

          {/* Wix Categories */}
          {wixCategories.length > 0 && (
            <CategoryFilter
              categories={wixCategories}
              activeCategoryId={activeCategoryId}
              onSelect={(id) => { setActiveCategoryId(id); setPage(1); }}
              allLabel={t.common.allCategories}
            />
          )}

          {/* Loading state */}
          {postsLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card border rounded-lg overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Wix blog posts */}
          {!postsLoading && hasWixData && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wixPosts.map((post) => (
                  <PostCard key={(post as Record<string, unknown>)._id as string} post={post as Record<string, unknown>} lang={lang} />
                ))}
              </div>
              <BlogPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}

          {/* Fallback: static teachings if no Wix data */}
          {!postsLoading && !hasWixData && (
            <>
              {filteredStatic.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStatic.map(teaching => (
                    <TeachingCard key={teaching.slug} teaching={teaching} lang={lang} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-12">{t.teachings.noResults}</p>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default TeachingsPage;
