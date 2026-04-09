import { db, blogPosts, users, blogCategories } from "./db/index";
import { eq, desc } from "drizzle-orm";

async function test() {
    const posts = await db
      .select({
          post: blogPosts,
          author: { name: users.name },
          category: { name: blogCategories.name }
      })
      .from(blogPosts)
      .leftJoin(users, eq(users.id, blogPosts.authorId))
      .leftJoin(blogCategories, eq(blogCategories.id, blogPosts.categoryId))
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.createdAt))
      .limit(3);
    
    console.log(JSON.stringify(posts, null, 2));
}
test().catch(console.error);
