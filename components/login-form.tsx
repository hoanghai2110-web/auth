
"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Chrome } from "lucide-react"

export function LoginForm() {
  const { signInWithGoogle, loading } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-orange-100 flex flex-col justify-center items-center px-8">
      {/* Title */}
      <div className="text-left w-full max-w-sm mb-12">
        <h1 className="text-5xl font-light text-pink-400 mb-2">Create</h1>
        <h2 className="text-5xl font-light text-red-500 mb-2">Join</h2>
        <h3 className="text-5xl font-light text-orange-600">Collaborate</h3>
      </div>

      {/* Illustration */}
      <div className="w-80 h-64 mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-orange-50 rounded-3xl">
          {/* Simple illustration placeholder */}
          <div className="absolute bottom-8 left-8">
            {/* Person */}
            <div className="w-16 h-16 bg-pink-300 rounded-full mb-4"></div>
            <div className="w-12 h-20 bg-orange-400 rounded-t-full"></div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-8 right-12 w-12 h-8 bg-red-400 rounded"></div>
          <div className="absolute top-16 left-20 w-8 h-8 bg-green-400 rounded-full"></div>
          <div className="absolute bottom-16 right-8 w-10 h-10 bg-pink-400 rounded-full"></div>
          
          {/* Connected dots */}
          <div className="absolute top-12 right-20">
            <div className="w-6 h-6 bg-orange-300 rounded-full mb-2"></div>
            <div className="w-1 h-8 bg-gray-300 mx-auto"></div>
            <div className="w-6 h-6 bg-pink-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Login Button */}
      <div className="w-full max-w-sm space-y-4">
        <Button
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full h-14 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl"
          variant="outline"
        >
          {loading ? (
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="font-medium">Đang đăng nhập...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-3">
              <Chrome className="w-6 h-6 text-blue-500" />
              <span className="font-medium text-lg">Sign in with Google</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}
