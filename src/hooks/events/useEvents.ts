import { useQuery } from "@tanstack/react-query";
import { items as dataItems } from "@wix/data";
import { wixClient } from "@/lib/wixClient";

interface UseEventsParams {
  upcomingOnly?: boolean;
}

export function useEvents({ upcomingOnly = false }: UseEventsParams = {}) {
  return useQuery({
    queryKey: ["wix-events", upcomingOnly],
    queryFn: async () => {
      try {
        const result = await (wixClient.items as typeof dataItems).queryDataItems({
          dataCollectionId: "Events",
        }).find();

        let events = (result.items ?? []).map((item) => item.data ?? item);

        if (upcomingOnly) {
          const now = new Date().toISOString();
          events = events.filter((e) => e.eventDate && e.eventDate >= now);
        }

        events.sort((a, b) => {
          const da = a.eventDate ?? "";
          const db = b.eventDate ?? "";
          return db.localeCompare(da);
        });

        return { events };
      } catch (error) {
        console.error("Failed to fetch events:", error);
        return { events: [] };
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}
