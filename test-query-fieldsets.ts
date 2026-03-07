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
        // Test queryPosts with fieldsets
        const result = await (wixClient.posts.queryPosts() as any)
            .eq("slug", slug)
            .limit(1)
            .find({ fieldsets: ["RICH_CONTENT", "CONTENT"] });

        console.log("queryPosts success:", result.items.length);
        if (result.items.length > 0) {
            console.log("Post keys:", Object.keys(result.items[0] || {}));
            console.log("richContent:", !!result.items[0].richContent);
        }
    } catch (err) {
        console.error("Error:", err);
    }
}
run();
