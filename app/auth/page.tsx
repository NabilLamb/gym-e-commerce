"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/AuthContext"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react"
import { validateName, validateEmail, validatePassword } from "@/lib/validations"

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null

  const checks = [
    { label: "At least 8 characters", pass: password.length >= 8 },
    { label: "One uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "One lowercase letter", pass: /[a-z]/.test(password) },
    { label: "One number", pass: /\d/.test(password) },
  ]

  const passCount = checks.filter((c) => c.pass).length
  const strength = passCount <= 1 ? "weak" : passCount <= 3 ? "medium" : "strong"
  const strengthColor = {
    weak: "bg-red-500",
    medium: "bg-yellow-500",
    strong: "bg-green-500",
  }[strength]

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1 h-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-colors duration-300 ${
              i <= passCount ? strengthColor : "bg-border"
            }`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-1.5">
            {check.pass ? (
              <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
            ) : (
              <XCircle className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
            )}
            <span className={`text-xs ${check.pass ? "text-foreground" : "text-muted-foreground/60"}`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Inner component that uses useSearchParams ──────────────────
// Must be wrapped in Suspense because useSearchParams()
// suspends during SSR without it
function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, register, user, loading } = useAuth()

  const mode = searchParams.get("mode") || "login"
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Login form
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [loginEmailError, setLoginEmailError] = useState("")
  const [loginPasswordError, setLoginPasswordError] = useState("")

  // Register form
  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [regNameError, setRegNameError] = useState("")
  const [regEmailError, setRegEmailError] = useState("")
  const [regPasswordError, setRegPasswordError] = useState("")

  // ── If already logged in, redirect immediately ──────────────
  useEffect(() => {
    if (!loading && user) {
      router.replace(callbackUrl)
    }
  }, [user, loading, callbackUrl, router])

  const validateLoginForm = (): boolean => {
    const emailErr = validateEmail(loginEmail)
    const passwordErr = !loginPassword ? "Password is required." : null
    setLoginEmailError(emailErr || "")
    setLoginPasswordError(passwordErr || "")
    return !emailErr && !passwordErr
  }

  const validateRegisterForm = (): boolean => {
    const nameErr = validateName(regName)
    const emailErr = validateEmail(regEmail)
    const passwordErr = validatePassword(regPassword)
    setRegNameError(nameErr || "")
    setRegEmailError(emailErr || "")
    setRegPasswordError(passwordErr || "")
    return !nameErr && !emailErr && !passwordErr
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!validateLoginForm()) return

    setIsLoading(true)
    try {
      await login(loginEmail, loginPassword)
      router.replace(callbackUrl)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!validateRegisterForm()) return

    setIsLoading(true)
    try {
      await register(regName, regEmail, regPassword)
      // Same — replace so user doesn't go back to register page
      router.replace(callbackUrl)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Show nothing while checking auth state to prevent flash
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    )
  }

  // If already logged in, show nothing while redirect happens
  if (user) return null

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden pt-24">
      <div className="absolute inset-0 bg-background -z-20" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] opacity-60 animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[100px] opacity-50 animate-pulse delay-700" />
      </div>

      <Card className="w-full max-w-md athletic-card shadow-2xl">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-4xl text-center tracking-tight">
            Welcome to FitHub
          </CardTitle>
          <CardDescription className="text-center text-base">
            {mode === "login" ? "Sign in to your account" : "Create a new account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue={mode} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="login"
                onClick={() => {
                  setError("")
                  router.push(`/auth?mode=login${callbackUrl !== "/" ? `&callbackUrl=${callbackUrl}` : ""}`)
                }}
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                onClick={() => {
                  setError("")
                  router.push(`/auth?mode=register${callbackUrl !== "/" ? `&callbackUrl=${callbackUrl}` : ""}`)
                }}
              >
                Register
              </TabsTrigger>
            </TabsList>

            {/* ── Login Tab ── */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4" noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value)
                      if (loginEmailError) setLoginEmailError("")
                    }}
                    className={loginEmailError ? "border-destructive focus-visible:ring-destructive" : ""}
                    autoComplete="email"
                  />
                  {loginEmailError && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> {loginEmailError}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showLoginPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value)
                        if (loginPasswordError) setLoginPasswordError("")
                      }}
                      className={`pr-10 ${loginPasswordError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {loginPasswordError && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> {loginPasswordError}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            {/* ── Register Tab ── */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 mt-4" noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={regName}
                    onChange={(e) => {
                      setRegName(e.target.value)
                      if (regNameError) setRegNameError("")
                    }}
                    className={regNameError ? "border-destructive focus-visible:ring-destructive" : ""}
                    autoComplete="name"
                  />
                  {regNameError && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> {regNameError}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="you@example.com"
                    value={regEmail}
                    onChange={(e) => {
                      setRegEmail(e.target.value)
                      if (regEmailError) setRegEmailError("")
                    }}
                    className={regEmailError ? "border-destructive focus-visible:ring-destructive" : ""}
                    autoComplete="email"
                  />
                  {regEmailError && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> {regEmailError}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showRegPassword ? "text" : "password"}
                      value={regPassword}
                      onChange={(e) => {
                        setRegPassword(e.target.value)
                        if (regPasswordError) setRegPasswordError("")
                      }}
                      className={`pr-10 ${regPasswordError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <PasswordStrength password={regPassword} />
                  {regPasswordError && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> {regPasswordError}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground text-center">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>.
          </p>
        </CardFooter>
      </Card>
    </main>
  )
}

// ── Page wrapper with Suspense ─────────────────────────────────
// Suspense is required because AuthContent uses useSearchParams()
// Without it, Next.js throws during static generation
export default function AuthPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
      }>
        <AuthContent />
      </Suspense>
      <Footer />
    </>
  )
}