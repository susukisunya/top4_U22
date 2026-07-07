import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, Train, PhoneCall } from 'lucide-react'

// メンバーのステータス型を定義
export type MemberStatus = 
  | { type: 'arrived'; time: string }
  | { type: 'moving'; remainingTime: number }
  | { type: 'missing' }

interface MemberCardProps {
  name: string
  avatarUrl: string
  fallbackText: string
  status: MemberStatus
}

export function MemberCard({ name, avatarUrl, fallbackText, status }: MemberCardProps) {
  // 1. 到着済み (arrived) のデザイン
  if (status.type === 'arrived') {
    return (
      <Card className="border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] bg-white rounded-xl">
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border border-stone-300 rounded-lg">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback>{fallbackText}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-sm text-stone-900">{name}</p>
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                <span className="tracking-tighter">||||</span> {status.time}
              </p>
            </div>
          </div>
          <CheckCircle2 className="h-6 w-6 text-emerald-600 fill-emerald-50" />
        </CardContent>
      </Card>
    )
  }

  // 2. 移動中 (moving) のデザイン
  if (status.type === 'moving') {
    return (
      <Card className="border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] bg-white rounded-xl">
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border border-stone-300 rounded-lg">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback>{fallbackText}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-sm text-stone-900">{name}</p>
              <p className="text-xs text-amber-600 font-medium mt-0.5">
                移動中（あと {status.remainingTime}分）
              </p>
            </div>
          </div>
          <div className="bg-amber-100 p-1.5 rounded-lg border border-amber-300">
            <Train className="h-5 w-5 text-amber-700" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // 3. 消息不明 (missing) のデザイン
  return (
    <Card className="border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] bg-[#FCE8E6] rounded-xl overflow-hidden">
      <CardContent className="p-3 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 border border-stone-300 rounded-lg">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{fallbackText}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-sm text-[#CE1126]">{name}</p>
            <p className="text-xs text-[#CE1126] opacity-80 mt-0.5">
              消息不明・更新なし
            </p>
          </div>
        </div>
        <Button className="w-full bg-[#B2320A] hover:bg-[#9E2E09] border-2 border-stone-900 text-white font-bold h-10 rounded-lg flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <PhoneCall className="h-4 w-4" />
          <span className="text-xs tracking-wider">モーニングコールを送る</span>
        </Button>
      </CardContent>
    </Card>
  )
}