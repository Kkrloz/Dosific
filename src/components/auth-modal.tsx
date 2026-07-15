"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Eye, EyeOff, Loader2 } from "lucide-react"

interface AuthModalProps {
  open: boolean
  onClose: () => void
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!open) return null

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      toast.error("Email ou senha inválidos")
    } else {
      toast.success("Login realizado com sucesso!")
      onClose()
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirm = formData.get("confirmPassword") as string

    if (password !== confirm) {
      toast.error("Senhas não conferem")
      setLoading(false)
      return
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    setLoading(false)

    if (res.ok) {
      toast.success("Conta criada! Faça login para continuar.")
      setTab("login")
    } else {
      const data = await res.json()
      toast.error(data.error || "Erro ao criar conta")
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-popover dark:bg-zinc-900 border border-border dark:border-zinc-700 rounded-2xl shadow-2xl shadow-black/30 w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted transition-colors cursor-pointer text-muted-foreground"
        >
          <X className="size-4" />
        </button>

        <div className="flex gap-1 bg-muted/50 rounded-lg p-1 mb-6">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer ${
              tab === "login"
                ? "bg-background dark:bg-zinc-800 text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer ${
              tab === "register"
                ? "bg-background dark:bg-zinc-800 text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Cadastrar
          </button>
        </div>

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-xs font-medium text-muted-foreground">Email</Label>
              <Input id="login-email" name="email" type="email" placeholder="seu@email.com" required className="bg-background/50" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-password" className="text-xs font-medium text-muted-foreground">Senha</Label>
              <div className="relative">
                <Input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="bg-background/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold h-9">
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Entrar"}
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-popover dark:bg-zinc-900 px-2 text-muted-foreground">ou</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setLoading(true)
                signIn("google", { callbackUrl: window.location.href })
              }}
              disabled={loading}
              className="w-full h-9 font-semibold"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="reg-name" className="text-xs font-medium text-muted-foreground">Nome</Label>
              <Input id="reg-name" name="name" placeholder="Seu nome" className="bg-background/50" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-email" className="text-xs font-medium text-muted-foreground">Email</Label>
              <Input id="reg-email" name="email" type="email" placeholder="seu@email.com" required className="bg-background/50" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-password" className="text-xs font-medium text-muted-foreground">Senha</Label>
              <Input id="reg-password" name="password" type="password" placeholder="Mínimo 6 caracteres" required minLength={6} className="bg-background/50" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-confirm" className="text-xs font-medium text-muted-foreground">Confirmar Senha</Label>
              <Input id="reg-confirm" name="confirmPassword" type="password" placeholder="Repita a senha" required minLength={6} className="bg-background/50" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold h-9">
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Criar Conta"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
