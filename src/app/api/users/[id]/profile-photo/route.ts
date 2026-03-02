import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cookieStore = cookies();
    const token = (await cookieStore).get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No auth token found" },
        { status: 401 }
      );
    }

    // Parse the incoming multipart form data
    const formData = await request.formData();
    const image = formData.get("image");

    if (!image || !(image instanceof Blob)) {
      return NextResponse.json(
        { success: false, error: "No image provided" },
        { status: 400 }
      );
    }

    // 1. Upload image to S3 via NestJS files endpoint
    const uploadFormData = new FormData();
    uploadFormData.append("image", image);
    uploadFormData.append("folder", "images/profile");

    const uploadResponse = await fetch(`${API_URL}files/upload/image/IMAGE`, {
      method: "POST",
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      console.error(
        "[profile-photo route] Upload failed:",
        uploadResponse.status,
        uploadResponse.statusText
      );
      return NextResponse.json(
        { success: false, error: `Upload failed with status: ${uploadResponse.status}` },
        { status: uploadResponse.status }
      );
    }

    const publicUrl = await uploadResponse.text();

    // 2. Save the URL in the user's profile
    const patchResponse = await fetch(`${API_URL}users/${id}/profile-images`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fotoPerfil: publicUrl }),
    });

    if (!patchResponse.ok) {
      const errorData = await patchResponse.text();
      console.error("[profile-photo route] Patch failed:", errorData);
      return NextResponse.json(
        {
          success: false,
          error: `Error saving profile photo: ${patchResponse.status}`,
        },
        { status: patchResponse.status }
      );
    }

    const userData = await patchResponse.json();

    return NextResponse.json({
      success: true,
      fotoPerfil: publicUrl,
      user: userData,
    });
  } catch (error) {
    console.error("[profile-photo route] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected server error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cookieStore = cookies();
    const token = (await cookieStore).get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No auth token found" },
        { status: 401 }
      );
    }

    const patchResponse = await fetch(`${API_URL}users/${id}/profile-images`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fotoPerfil: null }),
    });

    if (!patchResponse.ok) {
      const errorData = await patchResponse.text();
      console.error("[profile-photo route] Delete failed:", errorData);
      return NextResponse.json(
        {
          success: false,
          error: `Error removing profile photo: ${patchResponse.status}`,
        },
        { status: patchResponse.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[profile-photo route] Unexpected error on DELETE:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected server error",
      },
      { status: 500 }
    );
  }
}
