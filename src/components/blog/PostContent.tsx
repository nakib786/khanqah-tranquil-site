interface PostContentProps {
  htmlContent: string;
}

const PostContent = ({ htmlContent }: PostContentProps) => {
  return (
    <div
      className="prose prose-lg max-w-none text-foreground/80
        prose-headings:text-foreground prose-a:text-primary
        prose-img:rounded-lg prose-img:mx-auto"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default PostContent;
