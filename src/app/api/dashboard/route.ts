import { NextRequest, NextResponse } from "next/server";

// In-memory session dashboard
let expandedLinks: any[] = [];

export async function GET(request: NextRequest) {
  // Return the session's expanded links
  return NextResponse.json({ links: expandedLinks });
}

export async function POST(request: NextRequest) {
  const { url, meta } = await request.json();
  if (!url || !meta) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }
  // Add to session dashboard (in-memory for MVP)
  expandedLinks.unshift({ url, meta, timestamp: Date.now() });
  // Limit to last 20
  expandedLinks = expandedLinks.slice(0, 20);
  return NextResponse.json({ success: true });
}
