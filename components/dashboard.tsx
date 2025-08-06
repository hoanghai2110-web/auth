
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { LogOut, RefreshCw, User, Clock, Copy, CheckCircle, AlertCircle, Shield } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function Dashboard() {
  const { user, signOut } = useAuth()
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const fetchSessions = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSessions(data || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [user])

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const getStatusBadge = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const isExpired = now > expiry

    if (isExpired) {
      return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Expired</Badge>
    } else {
      return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-orange-100">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardContent className="p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">Bạn chưa đăng nhập</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-orange-100">
      {/* Beautiful Header with Navigation */}
      <header className="bg-white/90 backdrop-blur-md border-b border-pink-200/50 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-4">
              <div className="text-left">
                <h1 className="text-3xl font-light text-pink-400">Create</h1>
                <h2 className="text-2xl font-light text-red-500">Join</h2>
                <h3 className="text-xl font-light text-orange-600">Collaborate</h3>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                <Button variant="ghost" className="text-gray-600 hover:text-pink-500 transition-colors">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button variant="ghost" className="text-gray-600 hover:text-orange-500 transition-colors">
                  <Clock className="w-4 h-4 mr-2" />
                  Sessions
                </Button>
                <Button variant="ghost" className="text-gray-600 hover:text-red-500 transition-colors">
                  <Shield className="w-4 h-4 mr-2" />
                  Security
                </Button>
              </div>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              {/* User Info & Logout */}
              <div className="flex items-center space-x-3">
                {user.user_metadata?.avatar_url && (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full border-2 border-pink-200"
                  />
                )}
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{user.user_metadata?.full_name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Button 
                  onClick={signOut} 
                  variant="outline" 
                  size="sm"
                  className="bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button 
                onClick={signOut} 
                variant="outline" 
                size="sm"
                className="bg-white hover:bg-red-50 text-red-600 border-red-200"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <User className="w-5 h-5 mr-2 text-pink-500" />
                Thông tin tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                {user.user_metadata?.avatar_url && (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Avatar" 
                    className="w-12 h-12 rounded-full border-2 border-pink-200"
                  />
                )}
                <div>
                  <p className="font-semibold text-lg text-gray-800">{user.user_metadata?.full_name || 'Người dùng'}</p>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="bg-pink-50 rounded-lg p-3 border border-pink-100">
                  <p className="text-pink-600 text-sm font-medium">User ID</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-mono text-sm truncate text-gray-700">{user.id}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-pink-500 hover:bg-pink-100"
                      onClick={() => copyToClipboard(user.id, 'id')}
                    >
                      {copied === 'id' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                  <p className="text-orange-600 text-sm font-medium">Nhà cung cấp</p>
                  <p className="font-semibold capitalize text-gray-700">{user.app_metadata?.provider || 'Unknown'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <Shield className="w-5 h-5 mr-2 text-green-500" />
                Trạng thái
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="font-semibold text-green-800">Đã xác thực</p>
                <p className="text-sm text-gray-600">Tài khoản hoạt động bình thường</p>
              </div>
              {user.email_confirmed_at && (
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-blue-800 text-sm font-medium">Email đã xác nhận</p>
                  <p className="text-blue-600 text-xs">
                    {new Date(user.email_confirmed_at).toLocaleString('vi-VN')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sessions Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center text-gray-800">
                <Clock className="w-5 h-5 mr-2 text-orange-500" />
                Phiên đăng nhập ({sessions.length})
              </CardTitle>
              <Button 
                onClick={fetchSessions} 
                disabled={loading}
                variant="outline"
                size="sm"
                className="bg-white hover:bg-gray-50 border-gray-200"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-pink-500" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">Không có phiên đăng nhập nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session, index) => (
                  <div key={session.id} className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-4 hover:shadow-md transition-all duration-200 border border-pink-100">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="bg-white text-pink-600 border-pink-200">
                            #{index + 1}
                          </Badge>
                          {getStatusBadge(session.expires_at)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600 font-medium">Access Token:</p>
                            <div className="flex items-center space-x-2">
                              <code className="bg-white px-2 py-1 rounded-lg border border-pink-100 text-xs font-mono truncate max-w-xs">
                                {session.access_token?.substring(0, 30) + '...'}
                              </code>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-pink-500 hover:bg-pink-100"
                                onClick={() => copyToClipboard(session.access_token, `token-${session.user_id}`)}
                              >
                                {copied === `token-${session.user_id}` ? 
                                  <CheckCircle className="w-3 h-3 text-green-600" /> : 
                                  <Copy className="w-3 h-3" />
                                }
                              </Button>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">Refresh Token:</p>
                            <div className="flex items-center space-x-2">
                              <code className="bg-white px-2 py-1 rounded-lg border border-orange-100 text-xs font-mono truncate max-w-xs">
                                {session.refresh_token ? session.refresh_token.substring(0, 30) + '...' : 'N/A'}
                              </code>
                              {session.refresh_token && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-orange-500 hover:bg-orange-100"
                                  onClick={() => copyToClipboard(session.refresh_token, `refresh-${session.user_id}`)}
                                >
                                  {copied === `refresh-${session.user_id}` ? 
                                    <CheckCircle className="w-3 h-3 text-green-600" /> : 
                                    <Copy className="w-3 h-3" />
                                  }
                                </Button>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">Email:</p>
                            <p className="font-medium text-gray-800">{session.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">Expires At:</p>
                            <p className="font-medium text-gray-800">
                              {new Date(session.expires_at).toLocaleString('vi-VN')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
