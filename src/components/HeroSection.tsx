import { Link } from 'react-router-dom';
import { Language, translations } from '@/data/translations';
import heroImage from '@/assets/hero.jpg';
import logoImg from '@/assets/logo.png';
import { motion } from 'framer-motion';

const HeroSection = ({ lang }: { lang: Language }) => {
  const t = translations[lang];

  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/50 to-foreground/70" />
      </div>

      {/* Ornamental top border */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center px-4 max-w-3xl"
      >
        {/* Glowing logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6 flex flex-col items-center"
        >
          <div className="relative">
            <img
              src={logoImg}
              alt="Al Mehfuz Khanqah ae Qadriyaa"
              className="h-28 md:h-36 w-auto relative z-10 drop-shadow-[0_0_25px_hsl(var(--gold)/0.6)]"
            />
            {/* Glow behind logo */}
            <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full scale-150" />
          </div>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="w-16 h-px bg-gradient-to-r from-transparent to-gold/60" />
            <span className="text-gold text-sm tracking-[0.3em] uppercase font-medium">بِسْمِ ٱللَّٰهِ</span>
            <span className="w-16 h-px bg-gradient-to-l from-transparent to-gold/60" />
          </div>
        </motion.div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
          {t.hero.title}
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          {t.hero.subtitle}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to={`/${lang}/activities`}
            className="inline-flex items-center px-6 py-3 bg-gold text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg"
          >
            {t.hero.cta1}
          </Link>
          <Link
            to={`/${lang}/teachings`}
            className="inline-flex items-center px-6 py-3 border-2 border-gold/50 text-primary-foreground rounded-lg font-medium hover:bg-gold/20 transition-colors"
          >
            {t.hero.cta2}
          </Link>
        </div>
      </motion.div>

      {/* Bottom ornamental border */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
    </section>
  );
};

export default HeroSection;
