import { useQuery } from "@tanstack/react-query";
import { wixClient } from "@/lib/wixClient";

interface UseEventsParams {
  upcomingOnly?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dataItems = () => (wixClient as any).items;

export function useEvents({ upcomingOnly = false }: UseEventsParams = {}) {
  return useQuery({
    queryKey: ["wix-events", upcomingOnly],
    queryFn: async () => {
      try {
        const api = dataItems();
        // Try new API (query) first, fall back to queryDataItems
        const queryFn = api.query ?? api.queryDataItems;
        const builder = typeof queryFn === "function"
          ? queryFn.call(api, "Events")
          : null;

        if (!builder) {
          console.error("Wix Data items API not available");
          return { events: [] };
        }

        const result = await builder.descending("eventDate").find();
        let events = (result.items ?? []).map((item: Record<string, unknown>) => (item as any).data ?? item);

        if (upcomingOnly) {
          const now = new Date().toISOString();
          events = events.filter((e: Record<string, unknown>) => e.eventDate && (e.eventDate as string) >= now);
        }

        return { events };
      } catch (error) {
        console.error("Failed to fetch events:", error);
        return { events: [] };
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}
