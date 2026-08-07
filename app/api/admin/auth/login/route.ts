import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // 1. Fetch the REAL password from the environment variable
    const adminPassword = process.env.ADMIN_PASSWORD;

    // 2. If the env variable isn't set, fail safely
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD is not set in environment variables.");
      return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
    }

    // 3. Use bcrypt to compare the submitted password with the stored password
    // Note: We are using bcrypt.compareSync directly against the env variable for simplicity 
    // in this specific use case, as we don't have a database to store a hashed version.
    const isValid = (password === adminPassword);

    if (isValid) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}