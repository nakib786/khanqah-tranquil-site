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
    try {
        const result = await wixClient.posts.queryPosts()
            .descending("lastPublishedDate")
            .limit(9)
            .find();
        console.log("Success with OAuthStrategy:", result.items.length);
    } catch (err) {
        console.error("Error fetching posts:", err);
    }
}
run();
