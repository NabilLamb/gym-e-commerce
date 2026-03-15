import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { validateName, validateEmail } from "@/lib/validations";

// GET — admin only: fetch all messages
export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  await connectDB();
  const messages = await Message.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(messages);
}

// POST — public: submit a contact message
export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, subject, message } = await req.json();

    // Validate
    const nameError = validateName(name);
    if (nameError) return NextResponse.json({ message: nameError }, { status: 400 });

    const emailError = validateEmail(email);
    if (emailError) return NextResponse.json({ message: emailError }, { status: 400 });

    if (!subject?.trim() || subject.trim().length < 3) {
      return NextResponse.json(
        { message: "Subject must be at least 3 characters." },
        { status: 400 }
      );
    }

    if (!message?.trim() || message.trim().length < 10) {
      return NextResponse.json(
        { message: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    const saved = await Message.create({
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim().replace(/<[^>]*>/g, "").slice(0, 500),
    });

    return NextResponse.json(
      { success: true, message: "Message sent successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { message: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}

// PATCH — admin only: mark message as read/unread
export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  await connectDB();
  const { id, isRead } = await req.json();

  const updated = await Message.findByIdAndUpdate(
    id,
    { isRead },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ message: "Message not found." }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// DELETE — admin only
export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  await connectDB();
  const { id } = await req.json();
  await Message.findByIdAndDelete(id);
  return NextResponse.json({ message: "Message deleted." });
}