import { useQuery } from "@tanstack/react-query";
import { wixClient } from "@/lib/wixClient";

interface UseBlogPostsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
}

export function useBlogPosts({ page = 1, limit = 9, categoryId }: UseBlogPostsParams = {}) {
  return useQuery({
    queryKey: ["wix-blog-posts", page, limit, categoryId],
    queryFn: async () => {
      try {
        let query = wixClient.posts.queryPosts();

        if (categoryId) {
          query = query.hasSome("categoryIds", [categoryId]);
        }

        const result = await query
          .descending("lastPublishedDate")
          .limit(limit)
          .find();

        return {
          posts: result.items ?? [],
          totalCount: (result as any).totalCount ?? result.items?.length ?? 0,
          hasNext: result.hasNext?.() ?? false,
        };
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
        return { posts: [], totalCount: 0, hasNext: false };
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}
