import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Path to store email subscriptions
const EMAIL_FILE = path.join(process.cwd(), "data", "subscribers.json");

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read existing subscribers
function readSubscribers() {
  ensureDataDir();
  if (!fs.existsSync(EMAIL_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(EMAIL_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Write subscribers
function writeSubscribers(subscribers: any[]) {
  ensureDataDir();
  fs.writeFileSync(EMAIL_FILE, JSON.stringify(subscribers, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source, path: pagePath, ...payload } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Read existing subscribers
    const subscribers = readSubscribers();

    // Check if email already exists
    const existingIndex = subscribers.findIndex(
      (sub: any) => sub.email.toLowerCase() === email.toLowerCase()
    );

    const timestamp = new Date().toISOString();

    if (existingIndex !== -1) {
      // Update existing subscriber
      subscribers[existingIndex] = {
        ...subscribers[existingIndex],
        lastUpdated: timestamp,
        source,
        path: pagePath,
        ...payload,
      };
    } else {
      // Add new subscriber
      subscribers.push({
        email: email.toLowerCase(),
        subscribedAt: timestamp,
        lastUpdated: timestamp,
        source,
        path: pagePath,
        ...payload,
      });
    }

    // Save to file
    writeSubscribers(subscribers);

    return NextResponse.json(
      {
        success: true,
        message:
          existingIndex !== -1
            ? "Subscription updated"
            : "Successfully subscribed",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 }
    );
  }
}
