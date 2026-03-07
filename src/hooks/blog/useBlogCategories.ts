import { useQuery } from "@tanstack/react-query";
import { wixClient } from "@/lib/wixClient";

export function useBlogCategories() {
  return useQuery({
    queryKey: ["wix-blog-categories"],
    queryFn: async () => {
      try {
        const result = await wixClient.categories.queryCategories().find();
        return { categories: result.items ?? [] };
      } catch (error) {
        console.error("Failed to fetch blog categories:", error);
        return { categories: [] };
      }
    },
    staleTime: 1000 * 60 * 10,
  });
}
