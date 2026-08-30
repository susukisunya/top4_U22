'use client'

import { useEffect, useRef } from 'react'
import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps'
import type { CurrentLocation } from '@/hooks/useCurrentLocation'
import { CurrentLocationMarker } from '@/components/map/currentLocationMarker'

type DestinationMapProps = {
  // name / latitude / longitude だけを使う（MapCardDestination など構造的に互換な型であればよい）
  destination: {
    name: string
    latitude: number
    longitude: number
  }
  currentLocation: CurrentLocation | null
}

// 目的地と現在地を Google マップ上に表示するコンポーネント。
// Maps JavaScript API の読み込み（APIProvider）もここで行い、
// 親要素いっぱいに地図を広げて表示する。
export function DestinationMap({ destination, currentLocation }: DestinationMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  return (
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
          <MapContent destination={destination} currentLocation={currentLocation} />
        </Map>
      </div>
    </APIProvider>
  )
}

type MapContentProps = {
  destination: DestinationMapProps['destination']
  currentLocation: CurrentLocation | null
}

// Map の子コンポーネント（useMap() で地図インスタンスを取得できる）
function MapContent({ destination, currentLocation }: MapContentProps) {
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
