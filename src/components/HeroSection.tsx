import { Link } from 'react-router-dom';
import { Language, translations } from '@/data/translations';
import heroImage from '@/assets/hero.jpg';
import { motion } from 'framer-motion';

const HeroSection = ({ lang }: { lang: Language }) => {
  const t = translations[lang];

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-foreground/55" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center px-4 max-w-3xl"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
          {t.hero.title}
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          {t.hero.subtitle}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to={`/${lang}/activities`}
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {t.hero.cta1}
          </Link>
          <Link
            to={`/${lang}/teachings`}
            className="inline-flex items-center px-6 py-3 border border-primary-foreground/30 text-primary-foreground rounded-lg font-medium hover:bg-primary-foreground/10 transition-colors"
          >
            {t.hero.cta2}
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
