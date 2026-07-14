import React from 'react'
import { Card } from "@/components/ui/card"

export function MapCard() {
  const TARGET_LABEL = "TARGET"

  return (
    <Card className="border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] overflow-hidden rounded-xl h-48 relative bg-stone-800">
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="bg-[#9E3311] text-white text-[10px] font-bold px-2 py-1 rounded border border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] tracking-wider">
          {TARGET_LABEL}
        </div>
        <div className="w-3 h-3 bg-[#A8431E] border-2 border-white rounded-full mt-1 animate-ping absolute bottom-[-12px]"></div>
        <div className="w-3 h-3 bg-[#A8431E] border-2 border-stone-900 rounded-full mt-1 z-10"></div>
      </div>
    </Card>
  )
}