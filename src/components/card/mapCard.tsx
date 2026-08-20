import React from 'react'
import { Card } from "@/components/ui/card"

interface MapCardProps {
  /** 地図の中心にする住所・地名（例: "Shinjuku East Exit, Tokyo"） */
  location?: string
  /** 地図上に重ねて表示するラベル */
  label?: string
}

export function MapCard({
  location = "Shinjuku East Exit, Tokyo",
  label = "TARGET",
}: MapCardProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const encodedLocation = encodeURIComponent(location)

  // APIキーが設定されていれば公式の Google Maps Embed API を使用し、
  // 未設定の場合はキー不要の埋め込みURLにフォールバックする
  const mapSrc = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedLocation}`
    : `https://www.google.com/maps?q=${encodedLocation}&output=embed`

  return (
    <Card className="border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] overflow-hidden rounded-xl h-48 relative bg-stone-800">
      <iframe
        title={`Google Map - ${label}`}
        src={mapSrc}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />

      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
        <div className="bg-[#9E3311] text-white text-[10px] font-bold px-2 py-1 rounded border border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] tracking-wider">
          {label}
        </div>
      </div>
    </Card>
  )
}
