"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { LogIn } from "lucide-react"
import { AuthModal } from "./auth-modal"
import { UserMenu } from "./user-menu"

export function HeaderAuth() {
  const { data: session, status } = useSession()
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    function handleOpenAuth() { setShowAuth(true) }
    document.addEventListener("open-auth", handleOpenAuth)
    return () => document.removeEventListener("open-auth", handleOpenAuth)
  }, [])

  if (status === "loading") {
    return <div className="size-7 rounded-full bg-muted animate-pulse" />
  }

  if (session?.user) {
    return <UserMenu />
  }

  return (
    <>
      <button
        onClick={() => setShowAuth(true)}
        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted border border-border px-3 py-1.5 rounded-full transition-all cursor-pointer"
      >
        <LogIn className="size-3.5" />
        <span className="hidden sm:inline">Entrar</span>
      </button>
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  )
}
