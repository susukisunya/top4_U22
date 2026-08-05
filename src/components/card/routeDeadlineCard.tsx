import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Footprints } from 'lucide-react'

export function RouteDeadlineCard() {
  const ROUTE_DATA = {
    durationLabel: "移動時間",
    duration: "45分",
    deadlineLabel: "出発デッドライン",
    deadlineTime: "18:15",
    badgeText: "要注意",
  }

  return (
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
  )
}