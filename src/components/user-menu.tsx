"use client"

import { useState, useRef, useEffect } from "react"
import { signOut, useSession } from "next-auth/react"
import { LogOut, LayoutDashboard, User, ChevronDown } from "lucide-react"

export function UserMenu() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!session?.user) return null

  const initials = (session.user.name ?? session.user.email ?? "U")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 p-1 rounded-full hover:bg-muted transition-colors cursor-pointer"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt="Avatar"
            className="size-7 rounded-full object-cover"
          />
        ) : (
          <div className="size-7 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              {initials}
            </span>
          </div>
        )}
        <ChevronDown className="size-3.5 text-muted-foreground hidden sm:block" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-52 bg-card border border-border rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-2 border-b border-border/40">
            <p className="text-sm font-semibold text-foreground truncate">
              {session.user.name ?? "Usuário"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session.user.email}
            </p>
          </div>
          <a
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <LayoutDashboard className="size-4" />
            Painel
          </a>
          <button
            onClick={() => {
              setOpen(false)
              signOut()
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer"
          >
            <LogOut className="size-4" />
            Sair
          </button>
        </div>
      )}
    </div>
  )
}
