import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Language, languageConfig, translations } from '@/data/translations';
import { getFontClass } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';
import { Facebook, Instagram, Youtube, Twitter, Menu, X } from 'lucide-react';

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
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b" role="banner">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={`/${lang}`} className="text-lg font-bold text-primary truncate max-w-[260px] md:max-w-none">
            {t.hero.title}
          </Link>
          <nav className="hidden lg:flex items-center gap-6" role="navigation" aria-label="Main navigation">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm transition-colors ${isActive(link.to) ? 'text-primary font-medium' : 'text-foreground/60 hover:text-primary'}`}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher lang={lang} />
          </nav>
          <button
            className="lg:hidden p-2 text-foreground/70 hover:text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t bg-background p-4 flex flex-col gap-3" role="navigation" aria-label="Mobile navigation">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm py-1 ${isActive(link.to) ? 'text-primary font-medium' : 'text-foreground/60 hover:text-primary'}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t">
              <LanguageSwitcher lang={lang} />
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-secondary border-t mt-16" role="contentinfo">
        <div className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-primary mb-2">{t.hero.title}</h3>
            <p className="text-sm text-muted-foreground">{t.footer.mission}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{t.footer.quickLinks}</h4>
            <div className="flex flex-col gap-2">
              {navLinks.slice(0, 5).map(link => (
                <Link key={link.to} to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{t.footer.social}</h4>
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" aria-label="Youtube" className="text-muted-foreground hover:text-primary transition-colors"><Youtube className="w-5 h-5" /></a>
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        <div className="border-t py-4 text-center text-xs text-muted-foreground">
          {t.footer.copyright}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
