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
    name: string;
    icon: string;
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

type Props = {
  /** 予定を表示するユーザーのID。未指定の場合は暫定的に最新のユーザーを対象にする */
  userId?: string;
};

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

export default function ScheduleList({ userId }: Props) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setError(null);
        setIsLoading(true);

        // 表示対象ユーザーを決定する。
        // TODO: ログイン機能と連携したらログイン中ユーザーのIDを使う。
        let targetUserId = userId;
        if (!targetUserId) {
          // 未指定の場合は暫定的に /api/users の先頭（最新）ユーザーを対象にする
          const usersRes = await fetch("/api/users");
          if (!usersRes.ok) {
            throw new Error(
              `/api/users の取得に失敗しました: ${usersRes.status}`
            );
          }
          const users: { id: string }[] = await usersRes.json();
          targetUserId = users[0]?.id ?? "";
        }

        if (!targetUserId) {
          setSchedules([]);
          return;
        }

        const res = await fetch("/api/events");
        if (!res.ok) {
          throw new Error(`/api/events の取得に失敗しました: ${res.status}`);
        }

        const events: Event[] = await res.json();

        // 特定のユーザーがメンバーとして含まれるイベントのみ表示する
        const selectedUserId = targetUserId;
        setSchedules(
          events
            .filter((event) =>
              event.members.some((member) => member.userId === selectedUserId)
            )
            .map(toSchedule)
        );
      } catch (e) {
        console.error("予定一覧の取得に失敗しました:", e);
        setError("予定一覧を取得できませんでした");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, [userId]);

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
