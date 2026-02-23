import { Link } from 'react-router-dom';
import { Language, translations } from '@/data/translations';
import { Teaching } from '@/data/content';
import { Calendar, Clock } from 'lucide-react';

interface Props {
  teaching: Teaching;
  lang: Language;
}

const TeachingCard = ({ teaching, lang }: Props) => {
  const t = translations[lang];
  return (
    <Link
      to={`/${lang}/teachings/${teaching.slug}`}
      className="bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow group block"
    >
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {teaching.tags.map(tag => (
            <span key={tag} className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {teaching.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{teaching.excerpt}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{teaching.date}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{teaching.readingTime} {t.common.readingTime}</span>
        </div>
      </div>
    </Link>
  );
};

export default TeachingCard;
