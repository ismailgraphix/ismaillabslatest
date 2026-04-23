import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { personalPortfolio } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const data = await db.select().from(personalPortfolio).limit(1);
        return NextResponse.json(data[0] || null);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
        const body = await req.json();
        
        const existing = await db.select().from(personalPortfolio).limit(1);
        
        if (existing.length > 0) {
            const result = await db.update(personalPortfolio)
            .set({ 
                hero: body.hero, 
                skills: body.skills, 
                otherSkills: body.otherSkills, 
                experiences: body.experiences, 
                education: body.education, 
                updatedAt: new Date() 
            })
            .returning();
            return NextResponse.json(result[0]);
        } else {
            const result = await db.insert(personalPortfolio)
            .values({
                hero: body.hero,
                skills: body.skills,
                otherSkills: body.otherSkills,
                experiences: body.experiences,
                education: body.education
            })
            .returning();
            return NextResponse.json(result[0]);
        }
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
