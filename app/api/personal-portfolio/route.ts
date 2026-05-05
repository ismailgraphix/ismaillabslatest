import { NextResponse } from "next/server";
import { db } from "@/db";
import { personalPortfolio } from "@/db/schema";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
    try {
        const data = await db.select().from(personalPortfolio).limit(1);
        console.log("NEXTJS API FETCH from personalPortfolio:", data);
        if (data && data.length > 0) {
            return NextResponse.json(data[0]);
        }
        return NextResponse.json(null);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
