import { useQuery } from "@tanstack/react-query";
import { wixClient } from "@/lib/wixClient";

export function useEvent(slug: string | undefined) {
  return useQuery({
    queryKey: ["wix-event", slug],
    queryFn: async () => {
      if (!slug) return { event: null };
      try {
        const result = await wixClient.items
          .queryDataItems({ dataCollectionId: "Events" })
          .eq("slug", slug)
          .limit(1)
          .find();

        const item = result.items?.[0];
        return { event: item?.data ?? item ?? null };
      } catch (error) {
        console.error("Failed to fetch event:", error);
        return { event: null };
      }
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}
