import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Language, languageConfig, translations } from '@/data/translations';
import { getFontClass } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';
import BackgroundMusic from './BackgroundMusic';
import { Facebook, Instagram, Menu, X, ChevronUp, Globe, Mail, Phone } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import logoImg from '@/assets/logo.png';

interface LayoutProps {
  lang: Language;
  children: ReactNode;
}

const Layout = ({ lang, children }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 400);
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const t = translations[lang];
  const config = languageConfig[lang];
  const fontClass = getFontClass(lang);

  const navLinks = [
    { to: `/${lang}`, label: t.nav.home },
    { to: `/${lang}/about`, label: t.nav.about },
    { to: `/${lang}/activities`, label: t.nav.activities },
    { to: `/${lang}/teachings`, label: t.nav.teachings },
    { to: `/${lang}/gallery`, label: t.nav.gallery },
    { to: `/${lang}/contact`, label: t.nav.contact },
  ];

  const location = useLocation();
  const isActive = (to: string) => {
    if (to === `/${lang}`) return location.pathname === `/${lang}` || location.pathname === `/${lang}/`;
    return location.pathname.startsWith(to);
  };

  return (
    <div dir={config.dir} className={`${fontClass} min-h-screen flex flex-col`}>
      {/* Premium scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-[3px]"
        style={{ background: 'transparent' }}
      >
        <motion.div
          className="h-full origin-left"
          style={{
            scaleX: scrollProgress / 100,
            background: 'linear-gradient(90deg, hsl(var(--gold) / 0.6), hsl(var(--gold)), hsl(var(--gold-light)))',
            boxShadow: '0 0 12px hsl(var(--gold) / 0.5), 0 0 4px hsl(var(--gold) / 0.3)',
          }}
        />
      </motion.div>

      {/* Floating tubelight header */}
      <header className="fixed top-4 inset-x-4 z-50 mx-auto max-w-6xl" role="banner">
        <div className="relative bg-background/80 backdrop-blur-xl border border-gold/30 rounded-2xl shadow-[0_4px_30px_-4px_hsl(var(--gold)/0.25),0_0_80px_-20px_hsl(var(--gold)/0.15)] px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Tubelight glow effect - top edge */}
          <div className="absolute -top-px inset-x-8 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          <div className="absolute -top-1 inset-x-16 h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent blur-sm" />
          {/* Tubelight glow effect - bottom edge */}
          <div className="absolute -bottom-px inset-x-8 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

          <Link to={`/${lang}`} className="flex items-center gap-2 shrink-0">
            <img src={logoImg} alt="Al Mehfuz Khanqah ae Qadriyaa" className="h-11 w-auto" />
            <span className="text-base font-bold text-primary truncate max-w-[140px] sm:max-w-[200px] md:max-w-none">
              <span className="sm:hidden hero-title-fancy">{t.hero.title}</span>
              <span className="hidden sm:inline">{t.hero.title} — {t.hero.fullTitle}</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5" role="navigation" aria-label="Main navigation">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm transition-colors ${isActive(link.to) ? 'text-gold font-medium' : 'text-foreground/60 hover:text-gold'}`}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher lang={lang} />
          </nav>
          <button
            className="lg:hidden p-2 text-foreground/70 hover:text-gold"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="lg:hidden mt-2 bg-background/95 backdrop-blur-xl border border-gold/20 rounded-xl shadow-[0_8px_40px_-8px_hsl(var(--gold)/0.2)] p-4 flex flex-col gap-1 overflow-hidden"
              role="navigation"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, type: 'spring', stiffness: 300, damping: 24 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-sm py-2.5 px-3 rounded-lg transition-all ${isActive(link.to) ? 'text-gold font-medium bg-gold/10' : 'text-foreground/60 hover:text-gold hover:bg-gold/5'}`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="pt-2 mt-1 border-t border-gold/10"
              >
                <div className="flex items-center gap-2 px-3 py-2">
                  <Globe className="w-4 h-4 text-foreground/40 shrink-0" />
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(languageConfig) as Language[]).map(l => (
                      <button
                        key={l}
                        onClick={() => {
                          const newPath = location.pathname.replace(`/${lang}`, `/${l}`);
                          window.location.href = newPath || `/${l}`;
                        }}
                        className={`text-sm px-3 py-1 rounded-lg transition-all ${l === lang
                          ? 'bg-gold/20 text-gold font-medium'
                          : 'text-foreground/60 hover:text-gold hover:bg-gold/10'
                          }`}
                      >
                        {languageConfig[l].nativeName}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10 islamic-pattern" role="contentinfo">
        <div className="container mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-gold mb-2 flex items-center gap-2">
              <img src={logoImg} alt="" className="h-16 w-auto" /> {t.hero.title}
            </h3>
            <p className="text-sm text-primary-foreground/70">{t.footer.mission}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gold-light">{t.footer.quickLinks}</h4>
            <div className="flex flex-col gap-2">
              {navLinks.slice(0, 5).map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                  className="text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gold-light">{t.footer.social}</h4>
            <div className="flex gap-3 mb-6">
              <a href="https://www.facebook.com/profile.php?id=100081794237656#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-primary-foreground/60 hover:text-gold transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="https://www.instagram.com/almehfuz92/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-primary-foreground/60 hover:text-gold transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>

            <h4 className="font-semibold mb-3 text-gold-light">{t.nav.contact}</h4>
            <div className="space-y-3">
              <a
                href={`mailto:${t.contact.email}`}
                className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-gold transition-colors"
              >
                <Mail className="w-4 h-4 text-gold/60" />
                {t.contact.email}
              </a>
              <div className="flex gap-2">
                <a
                  href={`tel:${t.contact.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 px-2.5 py-1.5 bg-primary-foreground/5 text-xs text-primary-foreground/80 rounded-lg hover:bg-gold hover:text-primary transition-all font-medium border border-primary-foreground/10"
                  title={t.common.call}
                >
                  <Phone className="w-3.5 h-3.5" />
                  {t.common.call}
                </a>
                <a
                  href={`https://wa.me/${t.contact.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-2.5 py-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition-all font-medium border border-green-500/20"
                  title={t.common.whatsApp}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                  </svg>
                  {t.common.whatsApp}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 py-4 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} Al Mehfuz Khanqah ae Qadriyaa. All rights reserved.
        </div>
      </footer>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full bg-gold text-primary flex items-center justify-center shadow-lg hover:bg-gold-light transition-colors"
            aria-label="Back to top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
