import React from 'react';

interface PostContentProps {
  htmlContent: any;
}

const renderNode = (node: any): React.ReactNode => {
  if (!node) return null;

  const key = node.id || Math.random().toString(36).substr(2, 9);

  switch (node.type) {
    case 'PARAGRAPH': {
      return (
        <p key={key} className="mb-5 leading-relaxed">
          {node.nodes?.map((child: any) => renderNode(child))}
        </p>
      );
    }
    case 'TEXT': {
      const text = node.textData?.text || '';
      let element: React.ReactNode = text;

      // Handle decorations (bold, italic, etc.)
      node.textData?.decorations?.forEach((dec: any) => {
        if (dec.type === 'BOLD') element = <strong key={`${key}-bold`}>{element}</strong>;
        if (dec.type === 'ITALIC') element = <em key={`${key}-italic`}>{element}</em>;
        if (dec.type === 'UNDERLINE') element = <span key={`${key}-under`} style={{ textDecoration: 'underline' }}>{element}</span>;
        if (dec.type === 'STRIKETHROUGH') element = <span key={`${key}-strike`} style={{ textDecoration: 'line-through' }}>{element}</span>;
        if (dec.type === 'LINK') {
          element = (
            <a
              key={`${key}-link`}
              href={dec.linkData?.link?.url}
              className="text-primary hover:underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {element}
            </a>
          );
        }
      });
      return element;
    }
    case 'HEADING': {
      const level = node.headingData?.level || 2;
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
      const fontSizeClass = level === 1 ? 'text-3xl' : level === 2 ? 'text-2xl' : 'text-xl';
      return (
        <HeadingTag key={key} className={`${fontSizeClass} font-bold my-6 text-foreground tracking-tight`}>
          {node.nodes?.map((child: any) => renderNode(child))}
        </HeadingTag>
      );
    }
    case 'IMAGE': {
      const imageData = node.imageData?.containerData?.componentData || node.imageData;
      const url = imageData?.image?.src?.url || imageData?.image?.url;
      if (!url) return null;

      const resolvedUrl = url.startsWith('wix:image')
        ? `https://static.wixstatic.com/media/${url.split('/')[2]}`
        : url;

      return (
        <figure key={key} className="my-8">
          <img
            src={resolvedUrl}
            alt={imageData?.altText || ''}
            className="rounded-xl w-full h-auto shadow-lg"
          />
          {imageData?.caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-3 italic">
              {imageData.caption}
            </figcaption>
          )}
        </figure>
      );
    }
    case 'VIDEO': {
      const videoData = node.videoData?.containerData?.componentData || node.videoData;
      const url = videoData?.video?.src?.url || videoData?.video?.url;
      if (!url) return null;
      return (
        <div key={key} className="my-8 aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
          <iframe
            src={url}
            className="w-full h-full"
            allowFullScreen
            title="Video content"
          />
        </div>
      );
    }
    case 'BULLETED_LIST': {
      return (
        <ul key={key} className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
          {node.nodes?.map((child: any) => (
            <li key={child.id || Math.random().toString(36)}>{renderNode(child)}</li>
          ))}
        </ul>
      );
    }
    case 'ORDERED_LIST': {
      return (
        <ol key={key} className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
          {node.nodes?.map((child: any) => (
            <li key={child.id || Math.random().toString(36)}>{renderNode(child)}</li>
          ))}
        </ol>
      );
    }
    case 'LIST_ITEM': {
      return (
        <span key={key}>
          {node.nodes?.map((child: any) => renderNode(child))}
        </span>
      );
    }
    case 'DIVIDER': {
      return <hr key={key} className="my-10 border-t border-border/50" />;
    }
    case 'BLOCKQUOTE': {
      return (
        <blockquote key={key} className="border-l-4 border-primary/50 pl-6 my-8 italic text-lg text-foreground/70">
          {node.nodes?.map((child: any) => renderNode(child))}
        </blockquote>
      );
    }
    default: {
      if (node.nodes && node.nodes.length > 0) {
        return (
          <React.Fragment key={key}>
            {node.nodes.map((child: any) => renderNode(child))}
          </React.Fragment>
        );
      }
      return null;
    }
  }
};

const PostContent = ({ htmlContent }: PostContentProps) => {
  if (!htmlContent) return null;

  // Detect structure
  let content = null;
  if (typeof htmlContent === 'object') {
    if (htmlContent.nodes) {
      content = htmlContent;
    } else if (htmlContent.richContent && htmlContent.richContent.nodes) {
      content = htmlContent.richContent;
    }
  }

  if (content && content.nodes) {
    return (
      <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 leading-relaxed">
        {content.nodes.map((node: any) => renderNode(node))}
      </div>
    );
  }

  // Fallback to HTML string
  const html = typeof htmlContent === 'string' ? htmlContent : (htmlContent.content || htmlContent.plainContent || '');

  if (!html && typeof htmlContent === 'object') {
    // Debug fallback for development
    return (
      <div className="text-xs opacity-50 overflow-auto max-h-60 p-4 bg-muted/30 rounded-lg border border-dashed">
        <p className="font-semibold mb-2">No standard nodes found. Raw data:</p>
        <pre>{JSON.stringify(htmlContent, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div
      className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default PostContent;
