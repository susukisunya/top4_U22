'use client'

import { Card } from "@/components/ui/card"
import { MapPin } from 'lucide-react'
import { useCurrentLocation } from '@/hooks/useCurrentLocation'
import { DestinationMap } from '@/components/map/destinationMap'

// イベントAPIの destination に合わせた型
export type MapCardDestination = {
  id: string
  name: string
  address: string | null
  latitude: number
  longitude: number
  placeId: string | null
}

type MapCardProps = {
  destination?: MapCardDestination | null
}

// 目的地と現在地を表示するマップカード。
// 現在地の取得は useCurrentLocation フック、地図の描画は DestinationMap に責務を分離している。
export function MapCard({ destination }: MapCardProps) {
  const currentLocation = useCurrentLocation()
  const hasDestination = Boolean(
    destination &&
      destination.latitude !== undefined &&
      destination.longitude !== undefined
  )

  return (
    <Card className="border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] overflow-hidden rounded-xl h-48 relative bg-stone-800">
      {hasDestination && destination ? (
        <>
          {/* 目的地と現在地を Google マップで表示する（API読み込み・描画は DestinationMap が担う） */}
          <DestinationMap
            destination={destination}
            currentLocation={currentLocation}
          />

          {/* TARGET ラベル */}
          <div className="absolute top-2 left-2 bg-[#9E3311] text-white text-[10px] font-bold px-2 py-1 rounded border border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] tracking-wider z-10">
            TARGET
          </div>

          {/* 目的地名 */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1 rounded bg-white/90 px-2 py-1 text-xs font-bold text-stone-800 z-10">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#A8431E]" />
            <span className="truncate">{destination.name}</span>
          </div>
        </>
      ) : (
        // 目的地が未設定の場合は従来のプレースホルダー
        <>
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="bg-[#9E3311] text-white text-[10px] font-bold px-2 py-1 rounded border border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] tracking-wider">
              TARGET
            </div>
            <div className="w-3 h-3 bg-[#A8431E] border-2 border-white rounded-full mt-1 animate-ping absolute bottom-[-12px]"></div>
            <div className="w-3 h-3 bg-[#A8431E] border-2 border-stone-900 rounded-full mt-1 z-10"></div>
          </div>
        </>
      )}
    </Card>
  )
}
