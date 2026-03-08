import { Link } from 'react-router-dom';
import { Language } from '@/data/translations';
import { Megaphone } from 'lucide-react';

interface AnnouncementMarqueeProps {
  lang: Language;
}

const AnnouncementMarquee = ({ lang }: AnnouncementMarqueeProps) => {
  // Mock announcement — will be replaced with Wix CMS fetch
  const announcement = {
    message: "🌙 Ramadan Mubarak! May this blessed month bring peace and blessings to all. Join us for Taraweeh prayers daily.",
    link: `/${lang}/contact`,
  };

  if (!announcement.message) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[70] bg-gold text-primary overflow-hidden h-8 flex items-center">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-8 min-w-full">
        {[...Array(3)].map((_, i) => (
          <Link
            key={i}
            to={announcement.link}
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline px-4"
          >
            <Megaphone className="w-3.5 h-3.5 shrink-0" />
            {announcement.message}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementMarquee;
