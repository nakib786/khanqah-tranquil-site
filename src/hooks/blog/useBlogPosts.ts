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
          .ascending("lastPublishedDate")
          .skip((page - 1) * limit)
          .limit(limit)
          .find();

        return {
          posts: result.items ?? [],
          totalCount: result.totalCount ?? 0,
        };
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
        return { posts: [], totalCount: 0 };
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}
