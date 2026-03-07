import { media } from "@wix/sdk";

/**
 * Resolves a Wix media URI (wix:image://...) to a usable image URL.
 * Returns the original string if it's already a regular URL or if resolution fails.
 */
export function resolveWixImageUrl(wixMediaUri: string | undefined | null): string {
  if (!wixMediaUri) return "";
  if (!wixMediaUri.startsWith("wix:image://") && !wixMediaUri.startsWith("image://")) {
    return wixMediaUri;
  }
  try {
    return media.getImageUrl(wixMediaUri).url;
  } catch {
    return wixMediaUri;
  }
}
