import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    // Validate required fields
    const { firstName, email, subject, message } = formData;
    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Send data to Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_KEY, // Ensure this is set in .env.local
        name: firstName,
        email,
        subject,
        message,
        to_email: "santhisridinesh@gmail.com", // Recipient email
      }),
    });

    const result = await response.json();

    if (result.success) {
      return NextResponse.json(
        { message: "Email sent successfully!" },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: result.message || "Failed to send email." },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
