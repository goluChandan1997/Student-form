import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Forward to Node.js backend
    const backendFormData = new FormData();

    // Copy all form fields
    for (const [key, value] of formData.entries()) {
      backendFormData.append(key, value);
    }

    // const response = await fetch(`${process.env.BACKEND_URL}/api/students`, {
    const response = await fetch(
      `https://be-student-form.onrender.com/api/students`,
      {
        method: "POST",
        body: backendFormData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: 201 });
    } else {
      return NextResponse.json(
        { error: "Failed to submit form" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
