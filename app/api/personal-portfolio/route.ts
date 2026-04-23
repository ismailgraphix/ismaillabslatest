import { NextResponse } from "next/server";
import { db } from "@/db";
import { personalPortfolio } from "@/db/schema";

export async function GET() {
    try {
        const data = await db.select().from(personalPortfolio).limit(1);
        if (data.length > 0) {
            return NextResponse.json(data[0]);
        }
        return NextResponse.json(null);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
