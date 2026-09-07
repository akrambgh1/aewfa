import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { to, subject, text } = await req.json();

    if (!to || !text) {
      return NextResponse.json(
        { error: "Les champs 'to' et 'text' sont requis." },
        { status: 400 }
      );
    }

    const user = process.env.HOSTINGER_SMTP_USER || "contact@rayenhouseimmo.com";
    const pass = process.env.HOSTINGER_SMTP_PASS;

    if (!pass) {
      return NextResponse.json(
        { error: "Le mot de passe SMTP Hostinger est manquant dans .env.local" },
        { status: 500 }
      );
    }

    // Hostinger TLS Configuration
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 587,
      secure: false, // true for 465, false for 587
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false, // Prevents local SSL verification blocks
      },
    });

    await transporter.sendMail({
      from: `"El Rayane Immobilier" <${user}>`,
      to,
      subject: subject || "Re: El Rayane Immobilier - Votre demande",
      text,
      html: text.replace(/\n/g, "<br>"),
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Nodemailer Hostinger Auth Error:", error.message || error);

    return NextResponse.json(
      { error: error.message || "Erreur d'authentification SMTP." },
      { status: 500 }
    );
  }
}