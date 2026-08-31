import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from 'lucide-react'

// イベントカードに表示するデータ（次回のイベント情報）
export type EventCardData = {
  title?: string
  location?: string
  meetDate?: string
  meetTime?: string
}

type EventCardProps = {
  // 次回のイベント情報。イベントが無い場合は undefined / null を渡し「イベント無し」と表示する
  event?: EventCardData | null
}

export function EventCard({ event }: EventCardProps) {
  // イベントの基本ラベル
  const MISSION_DATA = {
    label: "次回の待ち合わせ",
    timeLabel: "集合時間",
  }

  // イベントが存在しない場合は「イベント無し」と表示する
  if (!event) {
    return (
      <Card className="border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] bg-white rounded-xl overflow-hidden">
        <CardContent className="p-6 text-center space-y-4">
          <div className="inline-block bg-[#9E3311] text-white text-xs px-3 py-1 font-bold tracking-wider rounded-sm">
            {MISSION_DATA.label}
          </div>
          <div className="text-3xl font-black tracking-tight text-stone-400 pt-2">
            イベント無し
          </div>
        </CardContent>
      </Card>
    )
  }

  const { title, location, meetDate, meetTime } = event

  return (
    <Card className="border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] bg-white rounded-xl overflow-hidden">
      <CardContent className="p-6 text-center space-y-4">
        <div className="inline-block bg-[#9E3311] text-white text-xs px-3 py-1 font-bold tracking-wider rounded-sm">
          {MISSION_DATA.label}
        </div>
        <div className="text-4xl font-black tracking-tight text-stone-900 pt-2">
          {title || "予定なし"}
        </div>
        <div className="flex items-center justify-center gap-1 text-stone-500 font-medium">
          <MapPin className="h-4 w-4" />
          <div>{location || "地点未設定"}</div>
        </div>
        <div className="space-y-1 pt-2">
          <div className="text-xs text-stone-400 font-bold tracking-widest">
            {MISSION_DATA.timeLabel}
          </div>
          {meetDate && (
            <div className="text-sm font-bold text-stone-500">
              {meetDate}
            </div>
          )}
          <div className="text-6xl font-black text-[#A8431E] tracking-tight">
            {meetTime || "--:--"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}