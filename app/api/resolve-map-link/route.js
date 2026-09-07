import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL non fournie" }, { status: 400 });
    }

    // Follow redirects on the server to get the final Google Maps URL
    const response = await fetch(url, { method: "HEAD", redirect: "follow" });
    const finalUrl = response.url || url;

    // Parse coordinates from the final URL
    // Matches @lat,lng or ?q=lat,lng or !3dlat!4dlng
    let lat = null;
    let lng = null;

    const atMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    const qMatch = finalUrl.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    const embedMatch = finalUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);

    if (atMatch) {
      lat = parseFloat(atMatch[1]);
      lng = parseFloat(atMatch[2]);
    } else if (qMatch) {
      lat = parseFloat(qMatch[1]);
      lng = parseFloat(qMatch[2]);
    } else if (embedMatch) {
      lat = parseFloat(embedMatch[1]);
      lng = parseFloat(embedMatch[2]);
    }

    if (lat !== null && lng !== null) {
      return NextResponse.json({ lat, lng, finalUrl });
    }

    return NextResponse.json(
      { error: "Impossible de trouver les coordonnées dans ce lien." },
      { status: 422 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur lors de la résolution du lien." },
      { status: 500 }
    );
  }
}