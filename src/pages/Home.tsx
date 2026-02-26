import { useParams, Link } from 'react-router-dom';
import { translations } from '@/data/translations';
import { schedule, teachings } from '@/data/content';
import { getLang } from '@/lib/i18n';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import TeachingCard from '@/components/TeachingCard';
import { motion } from 'framer-motion';
import { BookOpen, Heart, Users, Clock, MapPin } from 'lucide-react';

const Home = () => {
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = getLang(langParam);
  const t = translations[lang];
  const scheduleItems = schedule[lang];
  const latestTeachings = teachings[lang].slice(0, 3);

  const purposeIcons = [Heart, BookOpen, Users];

  return (
    <Layout lang={lang}>
      <HeroSection lang={lang} />

      {/* Purpose */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="ornamental-divider">
            <span className="text-gold text-lg">✦</span>
          </div>
          <h2 className="text-3xl font-bold text-center mb-12">{t.purpose.title}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {t.purpose.cards.map((card, i) => {
              const Icon = purposeIcons[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="bg-card border rounded-lg p-6 text-center relative overflow-hidden group hover:border-gold/40 transition-colors"
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                  <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-16 px-4 bg-secondary islamic-pattern">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-8">{t.schedule.title}</h2>
          <div className="space-y-3">
            {scheduleItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex justify-between items-center bg-card rounded-lg px-4 py-3 border"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground ms-2 hidden sm:inline">— {item.description}</span>
                </div>
                <span className="text-sm text-primary font-medium flex items-center gap-1 shrink-0 ms-3">
                  <Clock className="w-3 h-3" />{item.time}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Teachings */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">{t.latestTeachings.title}</h2>
            <Link to={`/${lang}/teachings`} className="text-sm text-primary hover:underline">
              {t.latestTeachings.viewAll} →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {latestTeachings.map(teaching => (
              <TeachingCard key={teaching.slug} teaching={teaching} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* Sajjada Nashin */}
      <section className="py-16 px-4 bg-secondary islamic-pattern">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="ornamental-divider">
            <span className="text-gold text-lg">✦</span>
          </div>
          <p className="text-sm text-primary font-medium uppercase tracking-widest mb-2">{t.hero.sajjadaNashin}</p>
          <h2 className="text-3xl font-bold mb-3">{t.hero.sajjadaNashinName}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t.hero.sajjadaNashinDesc}</p>
        </div>
      </section>

      {/* Visit Us */}
      <section className="py-16 px-4 bg-primary text-primary-foreground islamic-pattern">
        <div className="container mx-auto max-w-2xl text-center">
          <span className="text-gold text-2xl">☪</span>
          <h2 className="text-3xl font-bold mb-4 mt-2">{t.visitUs.title}</h2>
          <div className="flex items-center justify-center gap-2 text-primary-foreground/70 mb-2">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{t.visitUs.address}</span>
          </div>
          <p className="text-primary-foreground/70">{t.visitUs.timings}</p>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
