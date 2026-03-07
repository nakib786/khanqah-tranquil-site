import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { posts, categories } from "@wix/blog";
import { items } from "@wix/data";
import dotenv from "dotenv";

dotenv.config();

const wixClient = createClient({
    modules: { posts, categories, items },
    auth: ApiKeyStrategy({
        siteId: process.env.VITE_WIX_SITE_ID,
        apiKey: process.env.VITE_WIX_API_TOKEN,
    }),
});

async function run() {
    try {
        const result = await wixClient.posts.queryPosts()
            .descending("lastPublishedDate")
            .limit(9)
            .find();
        console.log("Success:", result.items.length);
    } catch (err) {
        console.error("Error fetching posts:", err);
    }
}
run();
