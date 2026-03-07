import { createClient, OAuthStrategy } from "@wix/sdk";
import { posts, categories } from "@wix/blog";
import { items } from "@wix/data";
import dotenv from "dotenv";

dotenv.config();

const wixClient = createClient({
    modules: { posts, categories, items },
    auth: OAuthStrategy({
        clientId: process.env.VITE_WIX_CLIENT_ID || "",
    }),
});

async function run() {
    const slug = "finding-peace-in-patience-sabr";
    try {
        // Try to find if getPostBySlug exists
        if (typeof wixClient.posts.getPostBySlug === 'function') {
            const response = await (wixClient.posts as any).getPostBySlug(slug, {
                fieldsets: ["RICH_CONTENT", "CONTENT"]
            });
            console.log("getPostBySlug success:", Object.keys(response.post || {}));
            console.log("richContent:", !!response.post?.richContent);
        } else {
            console.log("getPostBySlug NOT found in SDK");
            // Fallback to query
            const result = await wixClient.posts.queryPosts()
                .eq("slug", slug)
                .limit(1)
                .find();
            console.log("queryPosts find success:", result.items.length);
            console.log("Post keys:", Object.keys(result.items[0] || {}));
            console.log("richContent:", !!result.items[0]?.richContent);
        }
    } catch (err) {
        console.error("Error:", err);
    }
}
run();
