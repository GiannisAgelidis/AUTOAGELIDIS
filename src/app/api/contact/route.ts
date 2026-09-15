import { NextResponse } from "next/server";
import { Resend } from "resend";

// Sandbox sender that works before a custom domain is verified in Resend.
// Swap for a verified "name@autoagelidis.gr" address once one is set up —
// see resend.com/docs/dashboard/domains/introduction.
const FROM_ADDRESS = "Auto Agelidis <onboarding@resend.dev>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Loose caps only — real phone-format validation is a separate, later task.
const MAX_NAME = 200;
const MAX_PHONE = 50;
const MAX_EMAIL = 320; // RFC 5321 upper bound
const MAX_MESSAGE = 5000;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (
    !name ||
    !email ||
    !message ||
    !EMAIL_RE.test(email) ||
    name.length > MAX_NAME ||
    email.length > MAX_EMAIL ||
    phone.length > MAX_PHONE ||
    message.length > MAX_MESSAGE
  ) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;

  if (!apiKey || !to) {
    // Missing server config — not the visitor's fault, but we still can't
    // deliver the message. No personal data in this log line.
    console.error("[contact] RESEND_API_KEY or CONTACT_EMAIL_TO not set");
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  const text = [
    message,
    "",
    "—",
    `Name: ${name}`,
    `Phone: ${phone || "Not provided"}`,
    `Email: ${email}`,
  ].join("\n");

  const html = `
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    <hr>
    <p>
      <strong>Name:</strong> ${escapeHtml(name)}<br>
      <strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}<br>
      <strong>Email:</strong> ${escapeHtml(email)}
    </p>
  `;

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    replyTo: email,
    subject: "Message from Auto Agelidis",
    text,
    html,
  });

  if (error) {
    // Delivery failure only — again, no submitted personal data logged.
    console.error("[contact] send failed:", error.message);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
