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
        const post = await wixClient.posts.getPost("d2625ab0-6268-4b31-8fff-69a81d3b38cb");
        console.log("Post keys using getPost:");
        console.log(Object.keys(post));
        console.log("richContent:", post.richContent);
        console.log("plainContent:", post.plainContent);
        console.log("content:", post.content);
    } catch (err) {
        console.error("Error fetching getPost:", err);
    }
}
run();
