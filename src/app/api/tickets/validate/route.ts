import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ticketCode } = body;

    if (!ticketCode) {
      return NextResponse.json(
        { error: "Ticket code is required for validation" },
        { status: 400 }
      );
    }

    // Find the ticket and retrieve relations
    const ticket = await db.ticket.findUnique({
      where: { ticketCode },
      include: {
        user: true,
        course: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({
        status: "invalid",
        message: "This ticket code does not exist in our database. Verification failed.",
      });
    }

    if (ticket.status === "USED") {
      return NextResponse.json({
        status: "already_used",
        message: `Pass has already been scanned. Duplicate check-in blocked.`,
        student: ticket.user.email,
        course: ticket.course.titleEn,
        date: ticket.checkedInAt ? new Date(ticket.checkedInAt).toLocaleString() : "N/A",
      });
    }

    // Process check-in by updating ticket status to USED
    await db.ticket.update({
      where: { id: ticket.id },
      data: {
        status: "USED",
        checkedInAt: new Date(),
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Check-in validated successfully. Admitted to physical workshop.",
      student: ticket.user.email,
      course: ticket.course.titleEn,
    });
  } catch (error) {
    console.error("Ticket validation API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during ticket validation" },
      { status: 500 }
    );
  }
}
