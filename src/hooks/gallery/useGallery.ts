import { useQuery } from "@tanstack/react-query";
import { items as dataItems } from "@wix/data";
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

export function useGallery({ category }: UseGalleryParams = {}) {
  return useQuery({
    queryKey: ["wix-gallery", category],
    queryFn: async () => {
      try {
        let query = (wixClient.items as typeof dataItems).queryDataItems({
          dataCollectionId: "Gallery",
        });

        if (category) {
          query = query.eq("category", category);
        }

        const result = await query.ascending("order").find();

        const images: GalleryImage[] = (result.items ?? []).map((item) => {
          const d = item.data ?? item;
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
