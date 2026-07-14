"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Home, BarChart3, Plus, LogIn, LayoutDashboard, X, Menu } from "lucide-react"
import { AuthModal } from "./auth-modal"

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 hover:bg-muted rounded-full transition-colors cursor-pointer text-foreground/80 hover:text-foreground"
      >
        <Menu className="size-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100]">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-72 bg-muted border-r border-border shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-border/40">
              <span className="font-bold text-foreground">Dosific</span>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-full hover:bg-muted transition-colors cursor-pointer text-muted-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-3 space-y-1">
              <a
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-foreground bg-muted/60 transition-colors"
              >
                <Home className="size-5 text-emerald-500" />
                Início
              </a>
              <a
                href="/#compare"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <BarChart3 className="size-5 text-muted-foreground" />
                Comparar
              </a>
              <a
                href="/#new-product"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Plus className="size-5 text-muted-foreground" />
                Adicionar
              </a>
            </div>

            <div className="border-t border-border/40 mx-3" />

            <div className="p-3 space-y-1">
              {session?.user ? (
                <>
                  <a
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <LayoutDashboard className="size-5 text-muted-foreground" />
                    Painel
                  </a>
                  {session.user.role === "ADMIN" && (
                    <a
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <LayoutDashboard className="size-5 text-muted-foreground" />
                      Admin
                    </a>
                  )}
                </>
              ) : (
                <button
                  onClick={() => { setOpen(false); setShowAuth(true) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <LogIn className="size-5 text-muted-foreground" />
                  Entrar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  )
}
