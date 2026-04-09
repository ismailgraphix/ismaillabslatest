import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config();

async function check() {
    const sql = neon(process.env.DATABASE_URL!);
    const posts = await sql`SELECT id, title, published FROM blog_posts`;
    console.log("POSTS:", posts);
}

check().catch(console.error);
