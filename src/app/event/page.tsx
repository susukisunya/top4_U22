import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Lock, 
  Footprints 
} from 'lucide-react'
import { MemberCard, MemberStatus } from '@/components/member/memberCard'

interface Member {
  id: string
  name: string
  avatarUrl: string
  fallbackText: string
  status: MemberStatus
}

// メンバーのモックデータは外部、またはAPI等から渡される想定
const membersData: Member[] = [
  {
    id: '1',
    name: 'Kenji M.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
    fallbackText: 'KM',
    status: { type: 'arrived', time: '18:40' }
  },
  {
    id: '2',
    name: 'Yumi T.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
    fallbackText: 'YT',
    status: { type: 'moving', remainingTime: 10 }
  },
  {
    id: '3',
    name: 'Taro S.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
    fallbackText: 'TS',
    status: { type: 'missing' }
  }
]

export default function LateGuardApp() {
  // === functionの中で各定数を定義 ===
  const MISSION_DATA = {
    label: "次回のミッション",
    title: "新宿ナイト",
    location: "Shinjuku East Exit",
    timeLabel: "集合時間",
    meetTime: "19:00",
    targetLabel: "TARGET",
  }

  const ROUTE_DATA = {
    durationLabel: "移動時間",
    duration: "45分",
    deadlineLabel: "出発デッドライン",
    deadlineTime: "18:15",
    badgeText: "要注意",
  }

  const DISTANCE_DATA = {
    checkLabel: "距離チェック",
    distance: "5.2 km",
    textBefore: "現在地から集合場所まで",
    textAfter: "離れています。到着報告はロックされています。",
    buttonTextTop: "到着を報告",
    buttonTextBottom: "する",
  }

  const SECTION_TITLE = "メンバーの状況"
  const TOTAL_MEMBER_COUNT = 5

  // 到着済みの人数を動的にカウント
  const arrivedCount = membersData.filter(m => m.status.type === 'arrived').length

  return (
    <div className="max-w-md mx-auto bg-[#FBF9F6] min-h-screen text-stone-800 font-sans p-4 space-y-4 pb-8 shadow-md">
      
      {/* 次回のミッション カード */}
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
            <div className="text-xs text-stone-400 font-bold tracking-widest">{MISSION_DATA.timeLabel}</div>
            <div className="text-6xl font-black text-[#A8431E] tracking-tight">{MISSION_DATA.meetTime}</div>
          </div>
        </CardContent>
      </Card>

      {/* マップエリア（ダミー） */}
      <Card className="border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] overflow-hidden rounded-xl h-48 relative bg-stone-800">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="bg-[#9E3311] text-white text-[10px] font-bold px-2 py-1 rounded border border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] tracking-wider">
            {MISSION_DATA.targetLabel}
          </div>
          <div className="w-3 h-3 bg-[#A8431E] border-2 border-white rounded-full mt-1 animate-ping absolute bottom-[-12px]"></div>
          <div className="w-3 h-3 bg-[#A8431E] border-2 border-stone-900 rounded-full mt-1 z-10"></div>
        </div>
      </Card>

      {/* 移動時間・出発デッドライン */}
      <Card className="border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] bg-[#FFD500] rounded-xl overflow-hidden">
        <CardContent className="p-5 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-stone-800 text-xs font-bold">
              <Footprints className="h-3.5 w-3.5" />
              <div>{ROUTE_DATA.durationLabel}</div>
            </div>
            <div className="text-4xl font-black text-stone-900">{ROUTE_DATA.duration}</div>
          </div>

          <hr className="border-stone-900 opacity-30" />

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-stone-700 text-xs font-bold">
              <Clock className="h-3.5 w-3.5" />
              <div>{ROUTE_DATA.deadlineLabel}</div>
            </div>
            <div className="flex items-baseline gap-3">
              <div className="text-3xl font-black text-[#CE1126]">{ROUTE_DATA.deadlineTime}</div>
              <Badge className="bg-[#FFB0B0] hover:bg-[#FFB0B0] text-[#CE1126] border border-[#CE1126] font-bold px-2 py-0 rounded text-xs">
                {ROUTE_DATA.badgeText}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 距離チェック・到着報告エリア */}
      <div className="border-2 border-dashed border-stone-400 bg-stone-50 rounded-xl p-4 text-center space-y-4">
        <div className="flex items-center justify-center gap-1 text-xs font-bold text-stone-500">
          <AlertTriangle className="h-3.5 w-3.5" />
          <div>{DISTANCE_DATA.checkLabel}</div>
        </div>
        <div className="text-xs text-stone-600 leading-relaxed px-2 flex justify-center gap-1">
          <div>{DISTANCE_DATA.textBefore}</div>
          <div className="font-bold text-stone-950">{DISTANCE_DATA.distance}</div>
          <div>{DISTANCE_DATA.textAfter}</div>
        </div>
        <Button 
          disabled 
          className="w-full bg-stone-200 border-2 border-stone-400 text-stone-400 font-bold h-14 rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-not-allowed shadow-none"
        >
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <div className="text-base font-black">{DISTANCE_DATA.buttonTextTop}</div>
          </div>
          <div className="text-xs font-normal">{DISTANCE_DATA.buttonTextBottom}</div>
        </Button>
      </div>

      {/* メンバーの状況セクション */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center">
          <div className="font-black text-lg text-stone-900">{SECTION_TITLE}</div>
          <div className="bg-[#9E3311] text-white font-mono text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <div>{arrivedCount} / {TOTAL_MEMBER_COUNT}</div>
            <div className="opacity-60">|||||</div>
          </div>
        </div>

        <div className="space-y-2.5">
          {membersData.map((member) => (
            <MemberCard
              key={member.id}
              name={member.name}
              avatarUrl={member.avatarUrl}
              fallbackText={member.fallbackText}
              status={member.status}
            />
          ))}
        </div>
      </div>

    </div>
  )
}