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

        // PostsQueryBuilder uses .limit() and we calculate offset via .skipTo() or cursor
        const result = await query
          .descending("lastPublishedDate")
          .limit(limit)
          .find();

        // For pagination, we slice manually if needed (SDK doesn't support .skip())
        // In practice, use cursor-based pagination with result.hasNext() / result.next()
        return {
          posts: result.items ?? [],
          totalCount: result.totalCount ?? 0,
          hasNext: result.hasNext?.() ?? false,
          cursors: result.cursors,
        };
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
        return { posts: [], totalCount: 0, hasNext: false, cursors: undefined };
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}
