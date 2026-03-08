import { useQuery } from "@tanstack/react-query";
import { wixClient } from "@/lib/wixClient";

export interface Announcement {
  _id: string;
  message: string;
  link?: string;
  active?: boolean;
  order?: number;
}

export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { items: results } = await wixClient.items
        .queryDataItems({ dataCollectionId: "Announcements" })
        .ascending("order")
        .find();

      return (results ?? [])
        .map((item) => item.data as unknown as Announcement)
        .filter((a) => a.active !== false);
    },
    staleTime: 1000 * 60 * 5,
  });
}
