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
            .limit(1)
            .find();
        console.log("Post keys:");
        console.log(Object.keys(result.items[0]));
        console.log("richContent:", result.items[0].richContent);
        console.log("plainContent:", result.items[0].plainContent);
        console.log("content:", result.items[0].content);
    } catch (err) {
        console.error("Error fetching posts:", err);
    }
}
run();
