import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { translations } from '@/data/translations';
import { teachings } from '@/data/content';
import { getLang } from '@/lib/i18n';
import Layout from '@/components/Layout';
import TeachingCard from '@/components/TeachingCard';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const TeachingsPage = () => {
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = getLang(langParam);
  const t = translations[lang];
  const allTeachings = teachings[lang];

  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allTeachings.forEach(t => t.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [allTeachings]);

  const filtered = useMemo(() => {
    return allTeachings.filter(teaching => {
      const q = search.toLowerCase();
      const matchesSearch = !search || teaching.title.toLowerCase().includes(q) || teaching.excerpt.toLowerCase().includes(q);
      const matchesTag = !activeTag || teaching.tags.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [allTeachings, search, activeTag]);

  return (
    <Layout lang={lang}>
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

          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveTag(null)}
              className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                !activeTag ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'
              }`}
            >
              {t.common.allCategories}
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                  activeTag === tag ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(teaching => (
                <TeachingCard key={teaching.slug} teaching={teaching} lang={lang} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">{t.teachings.noResults}</p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default TeachingsPage;
