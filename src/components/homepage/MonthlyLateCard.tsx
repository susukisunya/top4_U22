
export default function MonthlyLateCard() {
  return (
    <div className="w-32 rounded border-[3px] border-black p-3 shadow">
      <p className="text-xs text-gray-500">
        今月の遅刻回数
      </p>

      <div className="mt-2 flex items-end gap-1">
        <span className="text-5xl font-bold text-orange-700">
          2
        </span>

        <span className="mb-1">回</span>
      </div>
    </div>
  );
}