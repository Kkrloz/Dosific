"use client"

import { useState } from "react"
import { Share2, Check, Link, MessageCircle } from "lucide-react"

interface ShareButtonProps {
  productId: string
  productName: string
}

export function ShareButton({ productId, productName }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const url = `${window.location.origin}/products/${productId}`
  const text = `Confira ${productName} no Dosific!`

  function copyLink() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted border border-border px-3 py-1.5 rounded-full transition-all cursor-pointer"
      >
        <Share2 className="size-3.5" />
        Compartilhar
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-card border border-border rounded-xl shadow-lg p-2 z-50 min-w-44 animate-in fade-in slide-in-from-top-1 duration-150">
          <button
            onClick={() => { copyLink(); setOpen(false) }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            {copied ? <Check className="size-4 text-emerald-500" /> : <Link className="size-4" />}
            {copied ? "Copiado!" : "Copiar Link"}
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <MessageCircle className="size-4 text-emerald-500" />
            WhatsApp
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text + " " + url)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <svg className="size-4 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            X / Twitter
          </a>
        </div>
      )}
    </div>
  )
}
