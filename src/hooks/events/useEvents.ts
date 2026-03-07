import { useQuery } from "@tanstack/react-query";
import { wixClient } from "@/lib/wixClient";

interface UseEventsParams {
  upcomingOnly?: boolean;
}

export function useEvents({ upcomingOnly = false }: UseEventsParams = {}) {
  return useQuery({
    queryKey: ["wix-events", upcomingOnly],
    queryFn: async () => {
      try {
        let query = wixClient.items.queryDataItems({
          dataCollectionId: "Events",
        });

        if (upcomingOnly) {
          query = query.ge("eventDate", new Date().toISOString());
        }

        const result = await query
          .descending("eventDate")
          .find();

        const events = (result.items ?? []).map((item) => item.data ?? item);
        return { events };
      } catch (error) {
        console.error("Failed to fetch events:", error);
        return { events: [] };
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}
