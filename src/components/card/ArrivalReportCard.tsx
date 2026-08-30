'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from "@/components/ui/button"
import { AlertTriangle, Lock, CheckCircle2, Loader2 } from 'lucide-react'
import { useCurrentLocation } from '@/hooks/useCurrentLocation'
import { calculateDistanceMeters } from '@/lib/geo'

// 到着報告が可能になる距離のしきい値（メートル）
const ARRIVAL_THRESHOLD_METERS = 100

// 距離の表示用フォーマット（1000m 以上は km 表記）
function formatDistance(meters: number): string {
  if (meters >= 1000) return `約 ${(meters / 1000).toFixed(1)} km`
  return `約 ${Math.round(meters)} m`
}

export type ArrivalDestination = {
  name: string
  latitude: number
  longitude: number
}

export type ArrivalReportResult = {
  arrivedAt: string
  isLate: boolean
  lateCount: number | null
}

interface ArrivalReportCardProps {
  eventId: string
  // 集合時刻（ISO文字列）。この時刻を過ぎて報告すると遅刻として記録される
  meetingTime: string
  destination: ArrivalDestination | null
  // 自分の到着報告状態（未報告なら null。親コンポーネントが管理する）
  arrivedAt: string | null
  // 到着報告が成功したときに親コンポーネントへ通知する（ページ表示の更新に使う）
  onArrived?: (result: ArrivalReportResult) => void
}

// 目的地付近にいるときだけ押せる「到着報告」カード。
// 現在地の取得は useCurrentLocation フック、遅刻判定はサーバー側（API）が行う。
export function ArrivalReportCard({
  eventId,
  meetingTime,
  destination,
  arrivedAt,
  onArrived,
}: ArrivalReportCardProps) {
  const currentLocation = useCurrentLocation()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [reportedResult, setReportedResult] = useState<ArrivalReportResult | null>(null)

  // 集合時間の経過を判定するため、未報告の間は1秒ごとに現在時刻を更新する
  const [now, setNow] = useState(() => Date.now())
  const arrived = arrivedAt !== null || reportedResult !== null

  useEffect(() => {
    if (arrived) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [arrived])

  const isPastMeetingTime = now > new Date(meetingTime).getTime()

  // 目的地までの距離（現在地か目的地が不明な場合は null）
  const distanceMeters = useMemo(() => {
    if (!destination || !currentLocation) return null
    return calculateDistanceMeters(currentLocation, {
      lat: destination.latitude,
      lng: destination.longitude,
    })
  }, [destination, currentLocation])

  const isNearDestination =
    distanceMeters !== null && distanceMeters <= ARRIVAL_THRESHOLD_METERS

  // 到着を報告する（遅刻かどうかの最終判定はサーバー時刻で行われる）
  const reportArrival = async () => {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(`/api/events/${eventId}/arrival`, { method: 'POST' })
      if (!res.ok) {
        throw new Error(`到着報告に失敗しました (${res.status})`)
      }

      const data = (await res.json()) as {
        alreadyReported: boolean
        arrivedAt: string | null
        isLate: boolean
        lateCount: number | null
      }
      if (!data.arrivedAt) {
        throw new Error('到着報告の結果を取得できませんでした')
      }

      const result: ArrivalReportResult = {
        arrivedAt: data.arrivedAt,
        isLate: data.isLate,
        lateCount: data.lateCount,
      }
      setReportedResult(result)
      onArrived?.(result)
    } catch (e) {
      console.error(e)
      setError(e instanceof Error ? e.message : '到着報告に失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  // 表示用の到着状態（報告直後はAPIの結果、それ以外は親から渡された状態を使う）
  const effectiveArrivedAt = reportedResult?.arrivedAt ?? arrivedAt
  const isLateArrival =
    effectiveArrivedAt !== null &&
    new Date(effectiveArrivedAt).getTime() > new Date(meetingTime).getTime()

  return (
    <div className="border-2 border-dashed border-stone-400 bg-stone-50 rounded-xl p-4 text-center space-y-4">
      <div className="flex items-center justify-center gap-1 text-xs font-bold text-stone-500">
        <AlertTriangle className="h-3.5 w-3.5" />
        <div>距離チェック</div>
      </div>

      {/* 到着報告済みのとき */}
      {effectiveArrivedAt ? (
        <div className="space-y-1">
          <p className="text-sm font-bold text-emerald-600 flex items-center justify-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            到着を報告しました
          </p>
          <p className="text-xs text-stone-600">
            報告時刻:{' '}
            {new Date(effectiveArrivedAt).toLocaleTimeString('ja-JP', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          {isLateArrival && (
            <p className="text-xs font-bold text-[#CE1126]">
              遅刻として記録されました
              {reportedResult?.lateCount != null
                ? `（遅刻回数: ${reportedResult.lateCount}回）`
                : ''}
            </p>
          )}
        </div>
      ) : (
        <>
          {/* 距離の表示 */}
          <div className="text-xs text-stone-600 leading-relaxed px-2 flex justify-center gap-1">
            {destination === null ? (
              <div>このイベントには目的地が設定されていません。</div>
            ) : distanceMeters === null ? (
              <div>現在地を取得しています…（位置情報の利用を許可してください）</div>
            ) : (
              <>
                <div>現在地から集合場所まで</div>
                <div className="font-bold text-stone-950">
                  {formatDistance(distanceMeters)}
                </div>
                <div>離れています。</div>
              </>
            )}
          </div>

          {/* 集合時間の経過警告 */}
          {isPastMeetingTime && destination !== null && (
            <p className="text-xs font-bold text-[#CE1126] flex items-center justify-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              集合時間を過ぎています。このまま報告すると遅刻として記録されます。
            </p>
          )}

          {/* ボタン（目的地が近くにあるときだけ押せる） */}
          {!destination || !isNearDestination ? (
            <Button
              disabled
              className="w-full bg-stone-200 border-2 border-stone-400 text-stone-400 font-bold h-14 rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-not-allowed shadow-none"
            >
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <div className="text-base font-black">到着を報告</div>
              </div>
              <div className="text-xs font-normal">
                {destination === null
                  ? 'する（目的地が未設定です）'
                  : distanceMeters === null
                    ? 'する（現在地を取得中…）'
                    : `する（${ARRIVAL_THRESHOLD_METERS}m 以内で押せます）`}
              </div>
            </Button>
          ) : (
            <Button
              onClick={reportArrival}
              disabled={submitting}
              className="w-full bg-[#10B981] hover:bg-[#059669] border-2 border-stone-900 text-white font-bold h-14 rounded-xl flex flex-col items-center justify-center gap-0.5 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_rgba(28,25,23,1)] transition-all disabled:opacity-60"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <div className="text-base font-black">送信中…</div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <div className="text-base font-black">
                      {isPastMeetingTime ? '遅刻で到着を報告' : '到着を報告'}
                    </div>
                  </div>
                  <div className="text-xs font-normal">する</div>
                </>
              )}
            </Button>
          )}
        </>
      )}

      {error && <p className="text-xs font-bold text-[#CE1126]">{error}</p>}
    </div>
  )
}