import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Language, languageConfig, translations } from '@/data/translations';
import { getFontClass } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';
import { Facebook, Instagram, Youtube, Twitter, Menu, X } from 'lucide-react';
import logoImg from '@/assets/logo.png';

interface LayoutProps {
  lang: Language;
  children: ReactNode;
}

const Layout = ({ lang, children }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
            <span className="text-base font-bold text-primary truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
              <span className="sm:hidden">Al Mehfuz</span>
              <span className="hidden sm:inline">{t.hero.title}</span>
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
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-2 bg-background/95 backdrop-blur-xl border border-gold/20 rounded-xl shadow-lg p-4 flex flex-col gap-3" role="navigation" aria-label="Mobile navigation">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm py-1 ${isActive(link.to) ? 'text-gold font-medium' : 'text-foreground/60 hover:text-gold'}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gold/10">
              <LanguageSwitcher lang={lang} />
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-primary text-primary-foreground border-t mt-16 islamic-pattern" role="contentinfo">
        <div className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-gold mb-2 flex items-center gap-2">
              <img src={logoImg} alt="" className="h-8 w-auto" /> {t.hero.title}
            </h3>
            <p className="text-sm text-primary-foreground/70">{t.footer.mission}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gold-light">{t.footer.quickLinks}</h4>
            <div className="flex flex-col gap-2">
              {navLinks.slice(0, 5).map(link => (
                <Link key={link.to} to={link.to} className="text-sm text-primary-foreground/70 hover:text-gold transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gold-light">{t.footer.social}</h4>
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className="text-primary-foreground/60 hover:text-gold transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" aria-label="Instagram" className="text-primary-foreground/60 hover:text-gold transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" aria-label="Youtube" className="text-primary-foreground/60 hover:text-gold transition-colors"><Youtube className="w-5 h-5" /></a>
              <a href="#" aria-label="Twitter" className="text-primary-foreground/60 hover:text-gold transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 py-4 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} Al Mehfuz Khanqah ae Qadriyaa. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
