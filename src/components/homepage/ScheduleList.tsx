import ScheduleItem from "./ScheduleItem";

const schedules = [
  {
    date: "今日",
    time: "19:00",
    title: "新宿焼肉ディナー会",
  },
  {
    date: "10/24",
    time: "13:30",
    title: "プロジェクトMTG",
  },
  {
    date: "10/28",
    time: "10:00",
    title: "サウナ合宿集合",
  },
];

export default function ScheduleList() {
  return (
    <section>
      <h2 className="mb-3 border-b-2 border-orange-600 inline-block text-lg font-bold">
        予定一覧
      </h2>

      <div className="space-y-3">
        {schedules.map((schedule) => (
          <ScheduleItem
            key={`${schedule.date}-${schedule.time}-${schedule.title}`}
            {...schedule}
          />
        ))}
      </div>
    </section>
  );
}