import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const EMAIL_FILE = path.join(process.cwd(), "data", "subscribers.json");

export async function GET() {
  try {
    // Check if file exists
    if (!fs.existsSync(EMAIL_FILE)) {
      return NextResponse.json({ subscribers: [] }, { status: 200 });
    }

    // Read subscribers
    const data = fs.readFileSync(EMAIL_FILE, "utf-8");
    const subscribers = JSON.parse(data);

    return NextResponse.json(
      {
        subscribers,
        count: subscribers.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error reading subscribers:", error);
    return NextResponse.json(
      { error: "Failed to read subscribers" },
      { status: 500 }
    );
  }
}
