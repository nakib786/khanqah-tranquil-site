import { supabase } from "@/integrations/supabase/client";

const WIX_API_BASE = "https://www.wixapis.com/wix-data/v2/collections";

async function wixProxy(url: string, method = "GET", payload?: unknown) {
  const { data, error } = await supabase.functions.invoke("wix-proxy", {
    body: { url, method, payload },
  });
  if (error) throw new Error(error.message || "Proxy call failed");
  return data;
}

export interface CollectionField {
  key: string;
  type: string;
  displayName?: string;
}

export interface CollectionDef {
  _id: string;
  displayName: string;
  fields: CollectionField[];
}

export async function checkCollectionExists(collectionId: string): Promise<boolean> {
  try {
    const data = await wixProxy(`${WIX_API_BASE}/${collectionId}`);
    return !!data?.collection;
  } catch {
    return false;
  }
}

export async function createCollection(def: CollectionDef): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      collection: {
        id: def._id,
        displayName: def.displayName,
        fields: def.fields.map((f) => ({
          key: f.key,
          type: f.type,
          displayName: f.displayName || f.key,
        })),
        permissions: {
          insert: "ADMIN",
          update: "ADMIN",
          remove: "ADMIN",
          read: "ANYONE",
        },
      },
    };

    const data = await wixProxy(WIX_API_BASE, "POST", payload);

    if (data?.message || data?.details) {
      return { success: false, error: data.message || JSON.stringify(data.details) };
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export const COLLECTIONS: CollectionDef[] = [
  {
    _id: "Announcements",
    displayName: "Announcements",
    fields: [
      { key: "message", type: "TEXT", displayName: "Message" },
      { key: "link", type: "TEXT", displayName: "Link (optional)" },
      { key: "active", type: "BOOLEAN", displayName: "Active" },
      { key: "order", type: "NUMBER", displayName: "Order" },
    ],
  },
  {
    _id: "Gallery",
    displayName: "Gallery",
    fields: [
      { key: "title", type: "TEXT", displayName: "Title" },
      { key: "image", type: "IMAGE", displayName: "Image" },
      { key: "category", type: "TEXT", displayName: "Category" },
      { key: "description", type: "TEXT", displayName: "Description" },
      { key: "order", type: "NUMBER", displayName: "Order" },
    ],
  },
  {
    _id: "Videos",
    displayName: "Videos",
    fields: [
      { key: "title", type: "TEXT", displayName: "Title" },
      { key: "videoUrl", type: "URL", displayName: "Video URL" },
      { key: "thumbnailUrl", type: "URL", displayName: "Thumbnail URL" },
      { key: "category", type: "TEXT", displayName: "Category" },
      { key: "description", type: "TEXT", displayName: "Description" },
      { key: "order", type: "NUMBER", displayName: "Order" },
    ],
  },
  {
    _id: "Events",
    displayName: "Events",
    fields: [
      { key: "title", type: "TEXT", displayName: "Title" },
      { key: "description", type: "RICH_TEXT", displayName: "Description" },
      { key: "eventDate", type: "DATE", displayName: "Event Date" },
      { key: "location", type: "TEXT", displayName: "Location" },
      { key: "coverImage", type: "IMAGE", displayName: "Cover Image" },
      { key: "slug", type: "TEXT", displayName: "Slug" },
      { key: "isUpcoming", type: "BOOLEAN", displayName: "Is Upcoming" },
    ],
  },
];
