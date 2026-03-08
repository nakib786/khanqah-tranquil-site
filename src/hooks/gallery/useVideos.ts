import { useQuery } from "@tanstack/react-query";
import { wixClient } from "@/lib/wixClient";

interface UseVideosParams {
  category?: string;
}

export interface GalleryVideo {
  _id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  category?: string;
  description?: string;
  order?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dataItems = () => (wixClient as any).items;

export function useVideos({ category }: UseVideosParams = {}) {
  return useQuery({
    queryKey: ["wix-videos", category],
    queryFn: async () => {
      try {
        const api = dataItems();
        const queryFn = api.query ?? api.queryDataItems;
        let builder = typeof queryFn === "function"
          ? queryFn.call(api, "Videos")
          : null;

        if (!builder) return { videos: [] };

        if (category) {
          builder = builder.eq("category", category);
        }

        const result = await builder.ascending("order").find();

        const videos: GalleryVideo[] = (result.items ?? []).map((item: Record<string, unknown>) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const d = (item as any).data ?? item;
          return {
            _id: d._id ?? "",
            title: d.title ?? "",
            videoUrl: d.videoUrl ?? d.video ?? "",
            thumbnailUrl: d.thumbnailUrl ?? d.thumbnail ?? "",
            category: d.category ?? undefined,
            description: d.description ?? undefined,
            order: d.order ?? 0,
          };
        });

        return { videos };
      } catch (error) {
        console.error("Failed to fetch videos:", error);
        return { videos: [] };
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}
