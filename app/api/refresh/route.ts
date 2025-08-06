import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { refresh_token } = await request.json()

    if (!refresh_token) {
      return NextResponse.json({ error: "Refresh token is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Refresh the session using the refresh token
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refresh_token,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data.session) {
      return NextResponse.json({ error: "Failed to refresh session" }, { status: 400 })
    }

    // Update the session in the database
    const { error: updateError } = await supabase
      .from("sessions")
      .update({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: new Date(data.session.expires_at! * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", data.session.user.id)

    if (updateError) {
      console.error("Error updating session in database:", updateError)
    }

    return NextResponse.json({
      message: "Token refreshed successfully",
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    })
  } catch (error) {
    console.error("Error in refresh API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
