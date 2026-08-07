import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body.name !== "string" ||
    !body.name.trim() ||
    typeof body.email !== "string" ||
    !body.email.trim() ||
    typeof body.message !== "string" ||
    !body.message.trim()
  ) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  // Email delivery isn't wired up yet — log for now so submissions aren't lost.
  console.log("[contact form submission]", {
    name: body.name,
    email: body.email,
    phone: body.phone ?? null,
    message: body.message,
  });

  return NextResponse.json({ ok: true });
}
