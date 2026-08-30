'use client'

import { useMemo } from 'react'
import { Marker } from '@vis.gl/react-google-maps'
import type { CurrentLocation } from '@/hooks/useCurrentLocation'

// 現在地を示す「青いドット」アイコン（Google マップの現在地表示と同じ見た目）
const CURRENT_LOCATION_ICON_URL =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">' +
      '<circle cx="14" cy="14" r="12" fill="#1A73E8" fill-opacity="0.25"/>' +
      '<circle cx="14" cy="14" r="6.5" fill="#1A73E8" stroke="#FFFFFF" stroke-width="2.5"/>' +
      '</svg>'
  )

// 現在地を青いドットで表示するマーカー
export function CurrentLocationMarker({ position }: { position: CurrentLocation }) {
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
