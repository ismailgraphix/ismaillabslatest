import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.formData();
    const file = data.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const formData = new FormData();
    formData.append("file", dataUri);
    formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET!);
    formData.append("folder", "ismaillabs");

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
    );
    const result = await res.json();

    if (!res.ok) return NextResponse.json({ error: result.error?.message || "Upload failed" }, { status: 500 });
    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
}