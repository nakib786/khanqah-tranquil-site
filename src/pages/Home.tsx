import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { translations } from '@/data/translations';
import { teachings } from '@/data/content';
import { getLang } from '@/lib/i18n';
import { getLocalizedSchedule, getNextPrayer, getIslamicDate, getIslamicDateArabic, getIslamicDateFromAladhan, DEFAULT_ISLAMIC_OFFSET } from '@/lib/prayer-times';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import TeachingCard from '@/components/TeachingCard';
import { motion } from 'framer-motion';
import { Clock, MapPin, Timer } from 'lucide-react';
import { TasbihIcon, DuaIcon, MosqueIcon } from '@/components/PurposeIcons';
import abrarImg from '@/assets/abrar.webp';
import nakibImg from '@/assets/nakib.webp';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ScheduleItem } from '@/lib/prayer-times';

const formatCountdown = (diff: number) => {
  const totalSec = Math.floor(diff / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const PrayerTimesSection = ({ lang, t, scheduleItems }: { lang: string; t: any; scheduleItems: ScheduleItem[] }) => {
  const [now, setNow] = useState(Date.now());
  // apply default offset configured for the region; you can override this by
  // passing a custom number (e.g. -1, -2) if your local sighting differs.
  const islamicDate = getIslamicDate(undefined, DEFAULT_ISLAMIC_OFFSET);
  const islamicDateAr = getIslamicDateArabic(undefined, DEFAULT_ISLAMIC_OFFSET);

  const [apiIslamicDate, setApiIslamicDate] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getIslamicDateFromAladhan(undefined, DEFAULT_ISLAMIC_OFFSET)
      .then((d) => {
        if (!cancelled) setApiIslamicDate(d);
      })
      .catch(() => {
        // ignore; fallback will show computed date
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Find next prayer
  const nextIdx = scheduleItems.findIndex(item => item.prayerDate.getTime() > now);

  return (
    <section className="py-16 px-4 bg-secondary islamic-pattern">
      <div className="container mx-auto max-w-4xl">
        {(apiIslamicDate || islamicDate) && (
          <div className="text-center mb-6">
            <p className="text-gold font-semibold text-lg">
              {islamicDateAr}
            </p>
            <p className="text-muted-foreground text-sm">
              {apiIslamicDate || islamicDate}
            </p>
          </div>
        )}

        <h2 className="text-3xl font-bold text-center mb-8">{t.schedule.title}</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {scheduleItems.map((item, i) => {
            const isNext = i === nextIdx;
            const isPast = nextIdx === -1 || i < nextIdx;
            const diff = item.prayerDate.getTime() - now;
            const isFuture = diff > 0;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-xl p-4 border text-center flex flex-col items-center justify-center min-h-[130px] transition-all ${isNext
                    ? 'bg-gold/10 border-gold/50 shadow-[0_0_20px_-5px_hsl(var(--gold)/0.2)] ring-1 ring-gold/20'
                    : isPast
                      ? 'bg-card/50 border-border/50 opacity-60 grayscale'
                      : 'bg-card border-border'
                  }`}
              >
                {isNext && (
                  <span className="absolute -top-2.5 inset-x-0 mx-auto w-fit px-2 py-0.5 bg-gold text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {lang === 'ur' ? 'اگلی' : lang === 'ar' ? 'القادمة' : lang === 'hi' ? 'अगली' : 'Next'}
                  </span>
                )}
                <span className={`text-lg font-bold mb-1 ${isNext ? 'text-gold' : 'text-foreground'}`}>{item.name}</span>
                <span className={`text-sm flex items-center gap-1 ${isNext ? 'text-gold' : 'text-primary'}`}>
                  <Clock className="w-3 h-3" />{item.time}
                </span>
                {isFuture ? (
                  <span className={`mt-2 font-mono text-xs tabular-nums ${isNext ? 'text-gold font-semibold' : 'text-muted-foreground'}`}>
                    <Timer className="w-3 h-3 inline-block me-1 -mt-0.5" />
                    {formatCountdown(diff)}
                  </span>
                ) : (
                  <span className="mt-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {lang === 'ur'
                      ? 'ادا ہو چکی'
                      : lang === 'ar'
                        ? 'انتهت'
                        : lang === 'hi'
                          ? 'पूरा हो चुका'
                          : 'Completed'}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const SajjadaNashinCard = ({ title, subtitle, description, image }: { title: string; subtitle: string; description: string; image: string }) => {
  const [showImage, setShowImage] = useState(false);
  const isMobile = useIsMobile();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTeased = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTap = () => {
    if (!isMobile || showImage) return;
    setShowImage(true);
    timerRef.current = setTimeout(() => setShowImage(false), 3000);
  };

  // Scroll-triggered peek: show image for 1 sec when card enters viewport
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTeased.current) {
          hasTeased.current = true;
          setTimeout(() => {
            setShowImage(true);
            timerRef.current = setTimeout(() => setShowImage(false), 1000);
          }, 300);
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div
      ref={cardRef}
      className="text-center p-8 rounded-2xl bg-background border border-gold/10 shadow-sm relative group overflow-hidden cursor-pointer"
      onMouseEnter={() => !isMobile && setShowImage(true)}
      onMouseLeave={() => !isMobile && setShowImage(false)}
      onClick={handleTap}
    >
      <div className="absolute inset-0 bg-gold/[0.02] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
      {/* Image overlay */}
      <motion.div
        className="absolute inset-0 z-10 rounded-2xl overflow-hidden"
        initial={false}
        animate={{ opacity: showImage ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ pointerEvents: showImage ? 'auto' : 'none' }}
      >
        <img src={image} alt={title} className="w-full h-full object-cover" style={{ objectPosition: 'center 35%' }} loading="lazy" decoding="async" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
          <p className="text-white font-bold text-xl font-serif">{title}</p>
          <p className="text-white/70 text-xs uppercase tracking-wider">{subtitle}</p>
        </div>
      </motion.div>
      {/* Original card content */}
      <p className="text-xs text-primary font-bold uppercase tracking-[0.2em] mb-4 opacity-70 italic">{subtitle}</p>
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary leading-tight drop-shadow-sm font-serif">{title}</h2>
      <div className="w-12 h-px bg-gold/30 mx-auto my-4" />
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

const SajjadaNashinSection = ({ lang, t }: { lang: string; t: any }) => (
  <section className="py-20 px-4 bg-secondary/50 islamic-pattern border-y border-gold/10">
    <div className="container mx-auto max-w-5xl">
      <div className="ornamental-divider mb-12">
        <span className="text-gold text-2xl">✦</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-stretch">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SajjadaNashinCard
            title={t.hero.sajjadaNashinName}
            subtitle={t.hero.sajjadaNashin}
            description="Blessed Sajjada Nashin continuing the noble path of spiritual guidance."
            image={abrarImg}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <SajjadaNashinCard
            title={t.hero.sajjadaNashinName2}
            subtitle={t.hero.sajjadaNashin2}
            description="Prominent seat of authority, serving the community with devotion."
            image={nakibImg}
          />
        </motion.div>
      </div>

      <p className="text-center mt-12 text-muted-foreground max-w-2xl mx-auto italic text-sm border-t border-gold/5 pt-8">
        {t.hero.sajjadaNashinDesc}
      </p>
    </div>
  </section>
);

const Home = () => {
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = getLang(langParam);
  const t = translations[lang];
  const scheduleItems = getLocalizedSchedule(lang);
  const latestTeachings = teachings[lang].slice(0, 3);

  const purposeIcons = [TasbihIcon, DuaIcon, MosqueIcon];

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
                    <Icon className="w-8 h-8 text-primary" />
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
      <PrayerTimesSection lang={lang} t={t} scheduleItems={scheduleItems} />

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

      {/* Sajjada Nashin Section */}
      <SajjadaNashinSection lang={lang} t={t} />

      {/* Visit Us */}
      <section className="pt-20 pb-10 px-4 bg-primary text-primary-foreground islamic-pattern relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center lg:text-start"
            >
              <span className="text-gold text-2xl">☪</span>
              <h2 className="text-4xl font-bold mb-6 mt-2">{t.visitUs.title}</h2>

              <div className="space-y-8 max-w-md mx-auto lg:mx-0">
                <div className="flex items-start gap-4 justify-center lg:justify-start">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div className="text-start">
                    <p className="font-semibold text-gold mb-1">{t.common.contactInfo}</p>
                    <p className="text-primary-foreground/70 text-sm leading-relaxed">{t.visitUs.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 justify-center lg:justify-start">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-gold" />
                  </div>
                  <div className="text-start">
                    <p className="font-semibold text-gold mb-1">{t.common.visitingHours}</p>
                    <p className="text-primary-foreground/70 text-sm mb-3">{t.visitUs.timings}</p>
                    <div className="grid grid-cols-1 gap-1 text-xs text-primary-foreground/50">
                      {t.contact.hours.map((h, i) => (
                        <p key={i} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-gold/40 rounded-full" /> {h}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    to={`/${lang}/contact`}
                    className="inline-flex items-center gap-2 bg-gold text-primary font-bold px-8 py-3.5 rounded-xl hover:bg-gold-light transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-95"
                  >
                    {t.nav.contact} <MapPin className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden border border-gold/30 shadow-2xl aspect-video lg:aspect-[4/3] bg-muted relative"
            >
              <div className="absolute inset-0 bg-gold/5 pointer-events-none" />
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2212.391064109656!2d73.06278859838102!3d20.78228114052743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0ed158806d347%3A0x55cc4ceb9ed2ef98!2sMehfuz%20Baugh%2C%20Thala%2C%20Chikhli%2C%20Gujarat%20396521%2C%20India!5e1!3m2!1sen!2sca!4v1772161842171!5m2!1sen!2sca"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Al Mehfuz Location"
                className="relative z-10"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
