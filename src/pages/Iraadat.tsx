import { useParams, Link } from 'react-router-dom';
import { getLang } from '@/lib/i18n';
import { translations } from '@/data/translations';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import {
  Compass, Heart, Sparkles, Scale, BookOpen,
  ShieldCheck, Users, Star, RefreshCw, ScrollText
} from 'lucide-react';

const benefitIcons = [Compass, Heart, Sparkles, Scale, BookOpen, ShieldCheck, Users, Star, RefreshCw, ScrollText];

const Iraadat = () => {
  const { lang: paramLang } = useParams();
  const lang = getLang(paramLang);
  const t = translations[lang];
  const ir = t.iraadat;

  // Parse intro text with <gold> tags
  const renderIntro = (text: string) => {
    const parts = text.split(/<gold>(.*?)<\/gold>/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <span key={i} className="text-gold font-semibold">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <Layout lang={lang}>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 islamic-pattern opacity-30" />

        {/* Animated light rays */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-[2px] origin-bottom"
              style={{
                height: '120%',
                background: `linear-gradient(to top, transparent, hsl(var(--gold) / ${0.08 + i * 0.02}))`,
                rotate: `${i * 60}deg`,
                transformOrigin: 'bottom center',
              }}
              animate={{ opacity: [0.3, 0.7, 0.3], scaleY: [0.9, 1.1, 0.9] }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            />
          ))}
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`p-${i}`}
              className="absolute w-1 h-1 rounded-full bg-gold/40"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, -30, 0], opacity: [0, 0.8, 0] }}
              transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-3xl pt-28 pb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6"
          >
            <span className="text-gold text-sm tracking-[0.3em] font-medium uppercase">
              {ir.subtitle}
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 leading-tight hero-title-fancy">
            {ir.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            {ir.heroDescription}
          </p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <span className="w-16 h-px bg-gradient-to-r from-transparent to-gold/60" />
            <span className="text-gold text-xl">☪</span>
            <span className="w-16 h-px bg-gradient-to-l from-transparent to-gold/60" />
          </div>
        </motion.div>

        <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <p className="text-muted-foreground text-lg leading-relaxed">
              {renderIntro(ir.intro)}
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {ir.benefits.map((benefit, index) => {
              const Icon = benefitIcons[index];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
                  className="group relative"
                >
                  <div className="relative bg-card border border-border rounded-xl p-6 h-full transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_30px_-8px_hsl(var(--gold)/0.2)] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/0 via-gold/0 to-gold/0 group-hover:from-gold/5 group-hover:via-transparent group-hover:to-gold/3 transition-all duration-500 rounded-xl" />

                    <div className="relative flex gap-4">
                      <motion.div
                        className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-gold/15 transition-colors duration-300"
                        whileHover={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.4 }}
                      >
                        <Icon className="w-6 h-6 text-gold" />
                      </motion.div>

                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-1.5 group-hover:text-gold transition-colors duration-300">
                          {benefit.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>

                    <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/0 to-transparent group-hover:via-gold/40 transition-all duration-500" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mt-16"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="w-16 h-px bg-gradient-to-r from-transparent to-gold/60" />
              <span className="text-gold text-xl">☪</span>
              <span className="w-16 h-px bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              {ir.ctaText}
            </p>
            <Link
              to={`/${lang}/contact`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
              className="inline-flex items-center justify-center px-6 py-3 bg-gold text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg shadow-gold/20"
            >
              {t.nav.contact}
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Iraadat;
