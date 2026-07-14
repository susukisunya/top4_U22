import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from 'lucide-react'

export function MissionCard() {
  // テキストデータをコンポーネント内に集約
  const MISSION_DATA = {
    label: "次回のミッション",
    title: "新宿ナイト",
    location: "Shinjuku East Exit",
    timeLabel: "集合時間",
    meetTime: "19:00",
  }

  return (
    <Card className="border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] bg-white rounded-xl overflow-hidden">
      <CardContent className="p-6 text-center space-y-4">
        <div className="inline-block bg-[#9E3311] text-white text-xs px-3 py-1 font-bold tracking-wider rounded-sm">
          {MISSION_DATA.label}
        </div>
        <div className="text-4xl font-black tracking-tight text-stone-900 pt-2">
          {MISSION_DATA.title}
        </div>
        <div className="flex items-center justify-center gap-1 text-stone-500 font-medium">
          <MapPin className="h-4 w-4" />
          <div>{MISSION_DATA.location}</div>
        </div>
        <div className="space-y-1 pt-2">
          <div className="text-xs text-stone-400 font-bold tracking-widest">
            {MISSION_DATA.timeLabel}
          </div>
          <div className="text-6xl font-black text-[#A8431E] tracking-tight">
            {MISSION_DATA.meetTime}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}