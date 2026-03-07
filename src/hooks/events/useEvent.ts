import { useQuery } from "@tanstack/react-query";
import { wixClient } from "@/lib/wixClient";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dataItems = () => (wixClient as any).items;

export function useEvent(slug: string | undefined) {
  return useQuery({
    queryKey: ["wix-event", slug],
    queryFn: async () => {
      if (!slug) return { event: null };
      try {
        const api = dataItems();
        const queryFn = api.query ?? api.queryDataItems;
        const builder = typeof queryFn === "function"
          ? queryFn.call(api, "Events")
          : null;

        if (!builder) return { event: null };

        const result = await builder.eq("slug", slug).limit(1).find();
        const item = result.items?.[0];
        return { event: (item as any)?.data ?? item ?? null };
      } catch (error) {
        console.error("Failed to fetch event:", error);
        return { event: null };
      }
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}
