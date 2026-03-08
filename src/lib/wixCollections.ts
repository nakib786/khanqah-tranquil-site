const WIX_API_BASE = "https://www.wixapis.com/wix-data/v2/collections";

function getHeaders() {
  const apiKey = import.meta.env.VITE_WIX_API_TOKEN;
  const siteId = import.meta.env.VITE_WIX_SITE_ID;
  if (!apiKey || !siteId) throw new Error("Missing Wix credentials in .env");
  return {
    Authorization: apiKey,
    "wix-site-id": siteId,
    "Content-Type": "application/json",
  };
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
    const res = await fetch(`${WIX_API_BASE}/${collectionId}`, {
      headers: getHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function createCollection(def: CollectionDef): Promise<{ success: boolean; error?: string }> {
  try {
    const body = {
      collection: {
        _id: def._id,
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

    const res = await fetch(WIX_API_BASE, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || `HTTP ${res.status}` };
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/** Pre-defined collection schemas */
export const COLLECTIONS: CollectionDef[] = [
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
