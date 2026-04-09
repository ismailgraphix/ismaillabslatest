import { db, services } from "./db/index";

async function testServices() {
    const all = await db.select().from(services);
    console.log(JSON.stringify(all, null, 2));
}

testServices().catch(console.error);
