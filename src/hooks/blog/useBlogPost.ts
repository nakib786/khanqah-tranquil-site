import { useQuery } from "@tanstack/react-query";
import { wixClient } from "@/lib/wixClient";

export function useBlogPost(slug: string | undefined) {
  return useQuery({
    queryKey: ["wix-blog-post", slug],
    queryFn: async () => {
      if (!slug) return { post: null };
      try {
        const result = await wixClient.posts.queryPosts()
          .eq("slug", slug)
          .limit(1)
          .find();

        return { post: result.items?.[0] ?? null };
      } catch (error) {
        console.error("Failed to fetch blog post:", error);
        return { post: null };
      }
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}
