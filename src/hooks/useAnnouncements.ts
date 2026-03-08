import { useQuery } from "@tanstack/react-query";
import { wixClient } from "@/lib/wixClient";

export interface Announcement {
  _id: string;
  message: string;
  link?: string;
  active?: boolean;
  order?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dataItems = () => (wixClient as any).items;

export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      try {
        const api = dataItems();
        const queryFn = api.query ?? api.queryDataItems;
        const builder = typeof queryFn === "function"
          ? queryFn.call(api, "Announcements")
          : null;

        if (!builder) return [];

        const result = await builder.find();

        return (result.items ?? [])
          .map((item: Record<string, unknown>) => {
            const d = (item as any).data ?? item;
            return {
              _id: d._id ?? "",
              message: d.message ?? "",
              link: d.link ?? undefined,
              active: d.active ?? true,
              order: d.order ?? 0,
            } as Announcement;
          })
          .filter((a: Announcement) => a.active !== false);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}
