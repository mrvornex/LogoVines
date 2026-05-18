import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";

export async function GET() {
  try {
    await connectDB();
    const logos = await Logo.find({ status: "pending" }).populate("uploadedBy", "name email").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, logos });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}