import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, company, position, phone } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email address already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create User & Profile inside a Transaction
    const newUser = await db.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role: "MEMBER", // Default registration role
        },
      });

      await tx.memberProfile.create({
        data: {
          userId: user.id,
          company: company || null,
          position: position || null,
          phone: phone || null,
        },
      });

      return user;
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration" },
      { status: 500 }
    );
  }
}
