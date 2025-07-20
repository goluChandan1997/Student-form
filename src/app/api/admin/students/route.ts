import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // const response = await fetch(
    //   `${process.env.BACKEND_URL}/api/admin/students`,
    const response = await fetch(
      `https://be-student-form.onrender.com/api/admin/students`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: "Failed to fetch students" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
