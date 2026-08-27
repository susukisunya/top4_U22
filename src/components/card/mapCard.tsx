'use client'

import React from 'react'
import { Card } from "@/components/ui/card"
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
import { MapPin } from 'lucide-react'

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

export function MapCard({ destination }: MapCardProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
  const hasDestination = Boolean(
    destination &&
      destination.latitude !== undefined &&
      destination.longitude !== undefined
  )

  return (
    <Card className="border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] overflow-hidden rounded-xl h-48 relative bg-stone-800">
      {hasDestination && destination ? (
        // 目的地の情報から Google マップにピンを表示する
        <APIProvider apiKey={apiKey}>
          <div className="absolute inset-0">
            <Map
              defaultCenter={{
                lat: destination.latitude,
                lng: destination.longitude,
              }}
              defaultZoom={15}
              style={{ width: '100%', height: '100%' }}
              mapTypeId="roadmap"
              mapTypeControlOptions={{ mapTypeIds: ['roadmap'] }}
              streetViewControl={false}
            >
              <Marker
                position={{
                  lat: destination.latitude,
                  lng: destination.longitude,
                }}
                title={destination.name}
              />
            </Map>
          </div>

          {/* TARGET ラベル */}
          <div className="absolute top-2 left-2 bg-[#9E3311] text-white text-[10px] font-bold px-2 py-1 rounded border border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] tracking-wider z-10">
            TARGET
          </div>

          {/* 目的地名 */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1 rounded bg-white/90 px-2 py-1 text-xs font-bold text-stone-800 z-10">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#A8431E]" />
            <span className="truncate">{destination.name}</span>
          </div>
        </APIProvider>
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