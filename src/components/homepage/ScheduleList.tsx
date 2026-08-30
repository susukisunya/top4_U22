"use client";

import { useEffect, useState } from "react";
import ScheduleItem from "./ScheduleItem";

// GET /api/events のレスポンス型（src/app/api/routes/events.ts の select 句に対応）
type EventMember = {
  userId: string;
  isAttending: boolean;
  meetingTime: string | null;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

type Event = {
  id: string;
  groupId: string;
  title: string;
  description: string | null;
  location: string | null;
  meetingTime: string;
  createdAt: string;
  updatedAt: string;
  group: {
    id: string;
    name: string;
    iconUrl: string;
  };
  members: EventMember[];
};

type Schedule = {
  id: string;
  date: string;
  meetingTime: string;
  title: string;
};

// Props は不要になった（ログインユーザーの予定はAPI側で絞り込まれる）
type Props = Record<string, never>;

// ISO形式の meetingTime を表示用の Schedule に変換する
function toSchedule(event: Event): Schedule {
  const date = new Date(event.meetingTime);
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  return {
    id: event.id,
    date: isToday ? "今日" : `${date.getMonth() + 1}/${date.getDate()}`,
    meetingTime: `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`,
    title: event.title,
  };
}

export default function ScheduleList(_props: Props) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 予定一覧を取得（APIがログイン中ユーザーの参加イベントを返す）
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setError(null);
        setIsLoading(true);

        const res = await fetch("/api/events");
        if (!res.ok) {
          throw new Error(`/api/events の取得に失敗しました: ${res.status}`);
        }

        const events: Event[] = await res.json();

        setSchedules(events.map(toSchedule));
      } catch (e) {
        console.error("予定一覧の取得に失敗しました:", e);
        setError("予定一覧を取得できませんでした");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const renderContent = () => {
    if (isLoading) return <p className="text-sm text-gray-500">読み込み中...</p>;
    if (error) return <p className="text-sm text-red-500">{error}</p>;
    if (schedules.length === 0) return <p className="text-sm text-gray-500">予定はありません</p>;

    return (
      <div className="space-y-3">
        {schedules.map((schedule) => (
          <ScheduleItem
            key={schedule.id}
            date={schedule.date}
            meetingTime={schedule.meetingTime}
            title={schedule.title}
          />
        ))}
      </div>
    );
  };

  // JSX部分
  return (
    <section>
      <h2 className="mb-3 border-b-2 border-orange-600 inline-block text-lg font-bold">
        予定一覧
      </h2>
      {renderContent()}
    </section>
  );
}
