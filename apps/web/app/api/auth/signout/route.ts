import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const response = await authFetch(`${BACKEND_URL}/auth/signout`, {
    method: "POST",
  });
  if (response.ok) {
    await deleteSession();
  }

  revalidatePath("/", "layout");
  revalidatePath("/", "page");
  return NextResponse.redirect(new URL("/", req.nextUrl));
}
