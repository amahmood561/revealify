import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(request: NextRequest) {
  const { url } = await request.json();
  if (!url) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    // Expand the URL (follow redirects)
    const res = await fetch(url, { redirect: "follow" });
    const finalUrl = res.url;
    const html = await res.text();
    const $ = cheerio.load(html);
    const title = $("title").text();
    const description = $("meta[name='description']").attr("content") || "";
    const favicon = $("link[rel='icon']").attr("href") || "/favicon.ico";
    return NextResponse.json({
      finalUrl,
      title,
      description,
      favicon: favicon.startsWith("http") ? favicon : new URL(favicon, finalUrl).href,
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to expand or fetch metadata." }, { status: 500 });
  }
}
