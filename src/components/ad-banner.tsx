"use client"

import { useEffect, useRef } from "react"
import { ADSENSE_PUBLISHER_ID, ADSENSE_ENABLED } from "@/lib/adsense"
import { cn } from "@/lib/utils"

type AdFormat = "auto" | "rectangle" | "horizontal" | "vertical"

interface AdBannerProps {
  slot: string
  format?: AdFormat
  className?: string
  show?: boolean
}

const formatConfig: Record<AdFormat, { style: React.CSSProperties; "data-ad-format": string }> = {
  auto: { style: { display: "block" }, "data-ad-format": "auto" },
  rectangle: { style: { width: "300px", height: "250px" }, "data-ad-format": "rectangle" },
  horizontal: { style: { display: "block" }, "data-ad-format": "horizontal" },
  vertical: { style: { display: "block" }, "data-ad-format": "vertical" },
}

export function AdBanner({ slot, format = "auto", className, show = true }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (!ADSENSE_ENABLED || !show || !slot || initialized.current) return

    try {
      const w = window as unknown as { adsbygoogle?: object[] }
      ;(w.adsbygoogle = w.adsbygoogle || []).push({})
      initialized.current = true
    } catch {
      // Ad blocker or AdSense not loaded yet
    }
  }, [slot, show])

  if (!ADSENSE_ENABLED || !show || !slot) return null

  const config = formatConfig[format]

  return (
    <div className={cn("flex justify-center overflow-hidden", className)}>
      <div ref={adRef}>
        <ins
          className="adsbygoogle"
          style={config.style}
          data-ad-client={ADSENSE_PUBLISHER_ID}
          data-ad-slot={slot}
          data-ad-format={config["data-ad-format"]}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  )
}
