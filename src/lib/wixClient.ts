import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { posts, categories } from "@wix/blog";
import { items } from "@wix/data";

export const wixClient = createClient({
  modules: { posts, categories, items },
  auth: ApiKeyStrategy({
    siteId: import.meta.env.VITE_WIX_SITE_ID,
    apiKey: import.meta.env.VITE_WIX_API_TOKEN,
  }),
});
