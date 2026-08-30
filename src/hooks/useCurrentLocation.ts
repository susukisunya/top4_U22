'use client'

import { useEffect, useState } from 'react'

// 現在地の座標（Geolocation API で取得した緯度経度）
export type CurrentLocation = {
  lat: number
  lng: number
}

/**
 * ブラウザの Geolocation API で現在地を取得し続けるフック。
 *
 * 位置情報の変化を監視して現在地を更新する（アンマウント時に監視を解除）。
 * 権限が拒否された場合などは null のまま。
 */
export function useCurrentLocation(): CurrentLocation | null {
  const [currentLocation, setCurrentLocation] =
    useState<CurrentLocation | null>(null)

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

  return currentLocation
}
