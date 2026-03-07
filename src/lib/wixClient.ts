import { createClient, OAuthStrategy } from "@wix/sdk";
import { posts, categories } from "@wix/blog";
import { items } from "@wix/data";

export const wixClient = createClient({
  modules: { posts, categories, items },
  auth: OAuthStrategy({
    clientId: import.meta.env.VITE_WIX_CLIENT_ID || "",
  }),
});
