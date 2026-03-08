import { Link } from 'react-router-dom';
import { Language } from '@/data/translations';
import { Megaphone } from 'lucide-react';
import { useAnnouncements } from '@/hooks/useAnnouncements';

interface AnnouncementMarqueeProps {
  lang: Language;
}

const FALLBACK_MESSAGE = "🌙 Ramadan Mubarak! May this blessed month bring peace and blessings to all. Join us for Taraweeh prayers daily.";

const AnnouncementMarquee = ({ lang }: AnnouncementMarqueeProps) => {
  const { data: announcements } = useAnnouncements();

  const messages = announcements && announcements.length > 0
    ? announcements
    : [{ _id: 'fallback', message: FALLBACK_MESSAGE, link: `/${lang}/contact` }];

  return (
    <div className="fixed top-0 inset-x-0 z-[70] bg-gold text-primary overflow-hidden h-8 flex items-center">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-8 min-w-full">
        {[...Array(3)].flatMap((_, repeat) =>
          messages.map((ann) => {
            const content = (
              <span className="inline-flex items-center gap-2 text-sm font-medium px-4">
                <Megaphone className="w-3.5 h-3.5 shrink-0" />
                {ann.message}
              </span>
            );
            const key = `${ann._id}-${repeat}`;
            return ann.link ? (
              <Link key={key} to={ann.link} className="hover:underline">
                {content}
              </Link>
            ) : (
              <span key={key}>{content}</span>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AnnouncementMarquee;
