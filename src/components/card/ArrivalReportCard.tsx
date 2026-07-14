import React from 'react'
import { Button } from "@/components/ui/button"
import { AlertTriangle, Lock, CheckCircle2 } from 'lucide-react'

interface ArrivalReportCardProps {
  isLocked?: boolean // ロック状態だけは外部制御（検証用等）できるようにオプショナルで残しています
}

export function ArrivalReportCard({ isLocked = true }: ArrivalReportCardProps) {
  // テキスト定数を内包
  const DISTANCE_DATA = {
    checkLabel: "距離チェック",
    distance: "5.2 km",
    textBefore: "現在地から集合場所まで",
    textAfter: "離れています。到着報告はロックされています。",
    buttonTextTop: "到着を報告",
    buttonTextBottom: "する",
  }

  // ボタンが押されたときの処理を内包
  const handleArrivalReport = () => {
    console.log("到着が報告されました！")
    alert("到着を報告しました。")
  }

  return (
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

      {isLocked ? (
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
      ) : (
        <Button
          onClick={handleArrivalReport}
          className="w-full bg-[#10B981] hover:bg-[#059669] border-2 border-stone-900 text-white font-bold h-14 rounded-xl flex flex-col items-center justify-center gap-0.5 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_rgba(28,25,23,1)] transition-all"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <div className="text-base font-black">{DISTANCE_DATA.buttonTextTop}</div>
          </div>
          <div className="text-xs font-normal">{DISTANCE_DATA.buttonTextBottom}</div>
        </Button>
      )}
    </div>
  )
}