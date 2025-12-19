import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("t");

  if (!title) {
    return NextResponse.json({ error: "Missing title" }, { status: 400 });
  }

  const apiKey =
    process.env.OMDB_API_KEY || process.env.NEXT_PUBLIC_OMDB_API_KEY;
  const apiUrl = "https://www.omdbapi.com/";

  try {
    const response = await axios.get(apiUrl, {
      params: {
        t: title,
        apikey: apiKey,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error in Poster Proxy:", error.message);
    }
    return NextResponse.json(
      { error: "Failed to fetch from OMDb" },
      { status: 500 }
    );
  }
}
