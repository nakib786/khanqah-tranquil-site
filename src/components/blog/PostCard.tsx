import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { resolveWixImageUrl } from '@/lib/wixMedia';
import { Language } from '@/data/translations';

interface PostCardProps {
  post: Record<string, unknown>;
  lang: Language;
}

const PostCard = ({ post, lang }: PostCardProps) => {
  const slug = (post.slug as string) ?? '';
  const title = (post.title as string) ?? '';
  const excerpt = (post.excerpt as string) ?? '';
  const coverImage = post.coverImage as Record<string, unknown> | undefined;
  const imageUrl = resolveWixImageUrl(coverImage?.url as string);
  const publishedDate = post.lastPublishedDate
    ? new Date(post.lastPublishedDate as string).toLocaleDateString()
    : '';
  const readingTime = (post.minutesToRead as number) ?? 0;

  return (
    <Link
      to={`/${lang}/teachings/${slug}`}
      className="bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow group block h-full"
    >
      {imageUrl && (
        <div className="aspect-video overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5 h-full flex flex-col">
        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-grow">{excerpt}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
          {publishedDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />{publishedDate}
            </span>
          )}
          {readingTime > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />{readingTime} min read
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
