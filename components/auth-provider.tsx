"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Save session if exists
      if (session) {
        saveSessionToDatabase(session)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Save session data to database when user signs in
      if (event === "SIGNED_IN" && session) {
        await saveSessionToDatabase(session)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const saveSessionToDatabase = async (session: Session) => {
    try {
      const sessionData = {
        user_id: session.user.id,
        email: session.user.email || "",
        access_token: session.provider_token || session.access_token,
        refresh_token: session.provider_refresh_token || session.refresh_token || null,
        expires_at: new Date(session.expires_at! * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from("sessions")
        .upsert(sessionData, {
          onConflict: "user_id",
        })

      if (error) {
        console.error("Error saving session:", error.message)
      }
    } catch (error) {
      console.error("Error saving session:", error)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          scopes: [
            "openid",
            "email", 
            "profile",
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/drive.readonly",
            "https://www.googleapis.com/auth/contacts.readonly",
            "https://www.googleapis.com/auth/calendar.readonly"
          ].join(" "),
          queryParams: {
            access_type: "offline",
            prompt: "consent",
            include_granted_scopes: "true",
            response_type: "code",
          },
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("Error signing in:", error)
      }
    } catch (error) {
      console.error("Error signing in:", error)
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
