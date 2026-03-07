import { useQuery } from "@tanstack/react-query";
import { wixClient } from "@/lib/wixClient";
import { resolveWixImageUrl } from "@/lib/wixMedia";

interface UseGalleryParams {
  category?: string;
}

export interface GalleryImage {
  _id: string;
  title: string;
  imageUrl: string;
  category?: string;
  description?: string;
  order?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dataItems = () => (wixClient as any).items;

export function useGallery({ category }: UseGalleryParams = {}) {
  return useQuery({
    queryKey: ["wix-gallery", category],
    queryFn: async () => {
      try {
        const api = dataItems();
        const queryFn = api.query ?? api.queryDataItems;
        let builder = typeof queryFn === "function"
          ? queryFn.call(api, "Gallery")
          : null;

        if (!builder) return { images: [] };

        if (category) {
          builder = builder.eq("category", category);
        }

        const result = await builder.ascending("order").find();

        const images: GalleryImage[] = (result.items ?? []).map((item: Record<string, unknown>) => {
          const d = (item as any).data ?? item;
          return {
            _id: d._id ?? "",
            title: d.title ?? "",
            imageUrl: resolveWixImageUrl(d.image),
            category: d.category ?? undefined,
            description: d.description ?? undefined,
            order: d.order ?? 0,
          };
        });

        return { images };
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
        return { images: [] };
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}
