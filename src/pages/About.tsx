import { useParams } from 'react-router-dom';
import { translations } from '@/data/translations';
import { lineage } from '@/data/content';
import { getLang } from '@/lib/i18n';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

const About = () => {
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = getLang(langParam);
  const t = translations[lang];
  const lineageData = lineage[lang];

  return (
    <Layout lang={lang}>
      <SEO title={t.about.title} description={t.about.history} />
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-8"
          >
            {t.about.title}
          </motion.h1>

          <p className="text-muted-foreground leading-relaxed text-lg mb-12">{t.about.history}</p>

          <h2 className="text-2xl font-bold mb-4">{t.about.missionTitle}</h2>
          <ul className="space-y-3 mb-12">
            {t.about.mission.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-muted-foreground">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mb-8">{t.about.lineageTitle}</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-16 p-8 bg-secondary/30 rounded-2xl border border-gold/10">
            <div className="text-center border-b md:border-b-0 md:border-e border-gold/10 pb-6 md:pb-0">
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-2 italic">{t.hero.sajjadaNashin}</p>
              <h3 className="text-xl font-bold text-primary mb-1">{t.hero.sajjadaNashinName}</h3>
            </div>
            <div className="text-center pt-6 md:pt-0">
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-2 italic">{t.hero.sajjadaNashin2}</p>
              <h3 className="text-xl font-bold text-primary mb-1">{t.hero.sajjadaNashinName2}</h3>
            </div>
          </div>

          <div className="space-y-0 mb-12">
            {lineageData.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-primary shrink-0 mt-1" />
                  {i < lineageData.length - 1 && <div className="w-0.5 bg-primary/20 flex-1 min-h-[40px]" />}
                </div>
                <div className="pb-8">
                  <h3 className="font-semibold">{entry.name}</h3>
                  <span className="text-sm text-primary">{entry.period}</span>
                  <p className="text-sm text-muted-foreground mt-1">{entry.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Decorative Closing Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-primary rounded-2xl p-12 text-center overflow-hidden"
          >
            {/* Animated Islamic pattern overlay */}
            <div className="absolute inset-0 islamic-pattern opacity-20" />

            {/* Animated light rays */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-[1px]"
                  style={{
                    height: '140%',
                    background: `linear-gradient(to top, transparent, hsl(var(--gold) / ${0.06 + i * 0.015}))`,
                    rotate: `${i * 45}deg`,
                    transformOrigin: 'bottom center',
                  }}
                  animate={{ opacity: [0.2, 0.6, 0.2], scaleY: [0.85, 1.1, 0.85] }}
                  transition={{ duration: 5 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                />
              ))}
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`p-${i}`}
                  className="absolute w-1 h-1 rounded-full bg-gold/30"
                  style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%` }}
                  animate={{ y: [0, -20, 0], opacity: [0, 0.7, 0] }}
                  transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3, ease: 'easeInOut' }}
                />
              ))}
            </div>

            <div className="relative z-10 space-y-4">
              {/* Animated crescent */}
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="text-gold text-5xl mb-2"
              >
                ☪
              </motion.div>

              <div className="flex items-center justify-center gap-3">
                <motion.span
                  animate={{ scaleX: [0.6, 1, 0.6] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-px bg-gradient-to-r from-transparent to-gold/60"
                />
                <span className="text-gold text-sm tracking-[0.3em] font-medium uppercase">
                  {lang === 'ur' ? 'بسم اللہ الرحمن الرحیم' : lang === 'ar' ? 'بسم الله الرحمن الرحيم' : 'Bismillahir Rahmanir Raheem'}
                </span>
                <motion.span
                  animate={{ scaleX: [0.6, 1, 0.6] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  className="w-16 h-px bg-gradient-to-l from-transparent to-gold/60"
                />
              </div>

              <p className="text-primary-foreground/70 text-sm max-w-md mx-auto italic leading-relaxed">
                {t.hero.sajjadaNashinDesc}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
