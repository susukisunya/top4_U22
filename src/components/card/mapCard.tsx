'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Card } from "@/components/ui/card"
import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps'
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

// 現在地の座標（Geolocation API で取得した緯度経度）
type CurrentLocation = {
  lat: number
  lng: number
}

// 現在地を示す「青いドット」アイコン（Google マップの現在地表示と同じ見た目）
const CURRENT_LOCATION_ICON_URL =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">' +
      '<circle cx="14" cy="14" r="12" fill="#1A73E8" fill-opacity="0.25"/>' +
      '<circle cx="14" cy="14" r="6.5" fill="#1A73E8" stroke="#FFFFFF" stroke-width="2.5"/>' +
      '</svg>'
  )

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

  // ブラウザの Geolocation API で取得した現在地（権限が拒否された場合は null のまま）
  const [currentLocation, setCurrentLocation] =
    useState<CurrentLocation | null>(null)

  // 位置情報の変化を監視して現在地を更新し続ける（アンマウント時に監視を解除）
  useEffect(() => {
    if (!navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        // 権限拒否・タイムアウトなどの場合は現在地を表示せず警告だけ出す
        console.warn(
          `現在地を取得できませんでした (code: ${error.code}, ${error.message})`
        )
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

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
              <MapCardContent
                destination={destination}
                currentLocation={currentLocation}
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

type MapCardContentProps = {
  destination: MapCardDestination
  currentLocation: CurrentLocation | null
}

// Map の子コンポーネント（useMap() で地図インスタンスを取得できる）
function MapCardContent({ destination, currentLocation }: MapCardContentProps) {
  const map = useMap()

  // 現在地を初めて取得できたときだけ、目的地と現在地が両方収まるよう表示範囲を調整する
  // （以降の位置更新では視点を動かさず、ユーザーがドラッグした視点を尊重する）
  const hasAdjustedViewRef = useRef(false)

  useEffect(() => {
    if (!map || !currentLocation || hasAdjustedViewRef.current) return
    hasAdjustedViewRef.current = true

    // 目的地と現在地を含む矩形で fitBounds する
    const latitudes = [destination.latitude, currentLocation.lat]
    const longitudes = [destination.longitude, currentLocation.lng]
    map.fitBounds(
      {
        north: Math.max(...latitudes),
        south: Math.min(...latitudes),
        east: Math.max(...longitudes),
        west: Math.min(...longitudes),
      },
      32
    )

    // 2点がほぼ重なっているときに極端にズームインしすぎないよう制限する
    const zoom = map.getZoom()
    if (zoom !== undefined && zoom > 16) {
      map.setZoom(16)
    }
  }, [map, currentLocation, destination])

  return (
    <>
      {/* 目的地のピン */}
      <Marker
        position={{
          lat: destination.latitude,
          lng: destination.longitude,
        }}
        title={destination.name}
      />

      {/* 現在地（青いドット） */}
      {currentLocation && <CurrentLocationMarker position={currentLocation} />}
    </>
  )
}

// 現在地を青いドットで表示するマーカー
function CurrentLocationMarker({ position }: { position: CurrentLocation }) {
  // SVG ドットの中心が緯度経度の位置に一致するようアンカーを画像中央に設定する
  const icon = useMemo<google.maps.Icon>(
    () => ({
      url: CURRENT_LOCATION_ICON_URL,
      anchor: new google.maps.Point(14, 14),
    }),
    []
  )

  return (
    <Marker
      position={position}
      icon={icon}
      title="現在地"
      clickable={false}
      zIndex={100}
    />
  )
}