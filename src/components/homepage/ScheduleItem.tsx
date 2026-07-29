type Props = {
  date: string;
  time: string;
  title: string;
};

export default function ScheduleItem({
  date,
  time,
  title,
}: Props) {
  return (
    <div className="border-[2px] border-black rounded p-3 bg-white">
      <div className="text-xs text-gray-500">
        {date}　{time}
      </div>

      <h3 className="font-semibold mt-1">
        {title}
      </h3>
    </div>
  );
}