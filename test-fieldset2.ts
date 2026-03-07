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
        const postObj = await wixClient.posts.getPost("d2625ab0-6268-4b31-8fff-69a81d3b38cb", {
            fieldsets: ["RICH_CONTENT", "CONTENT"] as any
        });
        console.log(JSON.stringify(postObj.post?.richContent, null, 2));
    } catch (err) {
        console.error("Error with getPost", err);
    }
}
run();
