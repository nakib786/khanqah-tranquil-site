import { Link } from 'react-router-dom';
import { Language, translations } from '@/data/translations';
import heroImage from '@/assets/hero.jpg';
import logoImg from '@/assets/logo.png';
import { motion } from 'framer-motion';

const HeroSection = ({ lang }: { lang: Language; }) => {
  const t = translations[lang];

  return (
    <section className="relative min-h-[75vh] flex items-start md:items-center justify-center overflow-hidden pt-28 md:pt-32">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-[10%] md:object-center"
          poster={heroImage}>

          <source src="https://videos.pexels.com/video-files/27411350/12138101_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      {/* Ornamental top border */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center px-4 max-w-3xl pt-4 pb-10 md:pt-0 md:pb-0">

        {/* Glowing logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6 flex flex-col items-center">

          <div className="relative">
            <img
              src={logoImg}
              alt="Al Mehfuz Khanqah ae Qadriyaa"
              className="h-28 md:h-36 w-auto relative z-10 drop-shadow-[0_0_25px_hsl(var(--gold)/0.6)]" />

            {/* Glow behind logo */}
            <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full scale-150" />
          </div>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="w-16 h-px bg-gradient-to-r from-transparent to-gold/60" />
            <span className="text-gold text-sm tracking-[0.3em] font-medium">بِسْمِ ٱللَّٰهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            <span className="w-16 h-px bg-gradient-to-l from-transparent to-gold/60" />
          </div>
        </motion.div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[hsl(42,30%,96%)] mb-2 leading-tight hero-title-fancy">
          {t.hero.title}
        </h1>
        <p className="text-lg md:text-2xl text-gold font-semibold mb-3 tracking-wide">
          {t.hero.fullTitle}{' '}
          <span className="hero-title-fancy text-white font-extrabold drop-shadow-[0_0_10px_hsl(var(--gold))] tracking-widest">
            MEHFUZ BAUGH
          </span>
        </p>
        <p className="text-base md:text-lg text-[hsl(42,30%,96%)]/80 mb-8 max-w-2xl mx-auto">
          {t.hero.subtitle}
        </p>
        <div className="flex flex-row gap-3 items-center justify-center">
          <Link
            to={`/${lang}/iraadat`}
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm bg-gold text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-all shadow-[0_0_20px_hsl(var(--gold)/0.4)] hover:shadow-[0_0_30px_hsl(var(--gold)/0.6)] ring-1 ring-gold-light/30 animate-pulse-slow">

            ✦ {t.hero.cta1}
          </Link>
          <Link
            to={`/${lang}/teachings`}
            className="inline-flex items-center justify-center px-4 py-2 text-sm border-2 border-gold/50 text-primary-foreground rounded-lg font-medium hover:bg-gold/20 transition-colors">

            {t.hero.cta2}
          </Link>
        </div>
      </motion.div>

      {/* Bottom ornamental border */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
    </section>);

};

export default HeroSection;