"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useStore()

  const redirectTo = searchParams.get("redirect") || "/"

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; name?: string } = {}

    if (!email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email address"

    if (!password) newErrors.password = "Password is required"
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters"

    if (isSignUp && !name) newErrors.name = "Name is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    if (isSignUp) {
      // SIGN UP
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } } // optional, store name in metadata
      })

      if (signUpError) {
        setErrors({ email: signUpError.message })
        setIsLoading(false)
        return
      }

      const user = signUpData.user
      if (!user) {
        setErrors({ email: "Please check your email to confirm your account." })
        setIsLoading(false)
        return
      }

      // Insert into profiles table
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          email: user.email,
          name: name || email.split("@")[0],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          created_at: new Date()
        },
      ])

      if (profileError) {
        console.log("Profile insert error:", profileError.message)
      }

      // Update local store & redirect
      login({ name: name || email.split("@")[0], email, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}` })
      setShowSuccess(true)
      setTimeout(() => router.push("/"), 1500)

    } else {
      // SIGN IN
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

      if (signInError) {
        setErrors({ email: signInError.message })
        setIsLoading(false)
        return
      }

      const user = signInData.user
      if (!user) {
        setErrors({ email: "Unable to log in." })
        setIsLoading(false)
        return
      }

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError) console.log("Profile fetch error:", profileError.message)

      login(profileData)
      setShowSuccess(true)
      setTimeout(() => router.push("/"), 1000)
    }

    setIsLoading(false)
  }

  if (showSuccess) {
    return (
      <motion.div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-100 to-gray-50 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div className="text-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{isSignUp ? "Sign Up Successful!" : "Welcome back!"}</h2>
          <p className="text-gray-600">Redirecting you now...</p>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-100 to-gray-50 px-4"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1 className="mb-10 text-4xl font-bold text-gray-800 select-none" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
        TEJA
      </motion.h1>

      <motion.form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl max-w-md w-full p-10" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">{isSignUp ? "Sign Up" : "Sign In"}</h2>

        <div className="space-y-6">
          {isSignUp && (
            <div>
              <Label htmlFor="name" className="text-gray-600 font-semibold">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) setErrors(prev => ({ ...prev, name: undefined }))
                }}
                className={`mt-2 ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
              />
              {errors.name && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mt-1">{errors.name}</motion.p>}
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-gray-600 font-semibold">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
              }}
              className={`mt-2 ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
            />
            {errors.email && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mt-1">{errors.email}</motion.p>}
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-600 font-semibold">Password</Label>
            <div className="relative mt-2">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors(prev => ({ ...prev, password: undefined }))
                }}
                className={`pr-10 ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`}
              />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </button>
            </div>
            {errors.password && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mt-1">{errors.password}</motion.p>}
          </div>
        </div>

        <motion.div className="mt-8" whileTap={{ scale: 0.98 }}>
          <Button type="submit" disabled={isLoading} className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition disabled:opacity-50">
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isSignUp ? "Signing Up..." : "Signing In..."}</> : (isSignUp ? "Sign Up" : "Sign In")}
          </Button>
        </motion.div>

        <p className="mt-6 text-center text-gray-500 text-sm select-none">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button type="button" className="text-gray-800 font-semibold hover:underline" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </motion.form>
    </motion.div>
  )
}
