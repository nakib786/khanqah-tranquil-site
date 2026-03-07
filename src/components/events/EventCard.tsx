import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { resolveWixImageUrl } from '@/lib/wixMedia';
import { Language } from '@/data/translations';

interface EventCardProps {
  event: Record<string, unknown>;
  lang: Language;
}

const EventCard = ({ event, lang }: EventCardProps) => {
  const slug = (event.slug as string) ?? '';
  const title = (event.title as string) ?? '';
  const description = (event.description as string) ?? '';
  const location = (event.location as string) ?? '';
  const coverImage = resolveWixImageUrl(event.coverImage as string);
  const eventDate = event.eventDate
    ? new Date(event.eventDate as string).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    : '';
  const dateObj = event.eventDate ? new Date(event.eventDate as string) : null;
  const day = dateObj ? dateObj.getDate().toString() : '';
  const monthYear = dateObj
    ? dateObj.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : '';

  return (
    <Link
      to={`/${lang}/activities/${slug}`}
      className="flex gap-4 items-start bg-card border rounded-lg p-5 hover:shadow-md transition-shadow group"
    >
      <div className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-center shrink-0 min-w-[70px]">
        <div className="text-lg font-bold leading-tight">{day}</div>
        <div className="text-xs opacity-80">{monthYear}</div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold group-hover:text-primary transition-colors">{title}</h3>
        {location && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" /> {location}
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
      </div>
    </Link>
  );
};

export default EventCard;
