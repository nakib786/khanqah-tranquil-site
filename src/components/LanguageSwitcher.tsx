import { useLocation, useNavigate } from 'react-router-dom';
import { Language, languageConfig } from '@/data/translations';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const LanguageSwitcher = ({ lang }: { lang: Language }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const switchLang = (newLang: Language) => {
    const newPath = location.pathname.replace(`/${lang}`, `/${newLang}`);
    navigate(newPath || `/${newLang}`);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-foreground/60 hover:text-primary transition-colors"
        aria-label="Switch language"
        aria-expanded={open}
      >
        <Globe className="w-4 h-4" />
        <span>{languageConfig[lang].nativeName}</span>
      </button>
      {open && (
        <div className="absolute top-full mt-2 end-0 bg-card border rounded-lg shadow-lg py-1 min-w-[150px] z-50">
          {(Object.keys(languageConfig) as Language[]).map(l => (
            <button
              key={l}
              onClick={() => switchLang(l)}
              className={`w-full text-start px-4 py-2 text-sm transition-colors ${
                l === lang ? 'text-primary font-medium bg-accent' : 'text-foreground/70 hover:bg-accent'
              }`}
            >
              {languageConfig[l].nativeName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
