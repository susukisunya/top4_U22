"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MemberCard, MemberStatus } from "@/components/card/memberCard";
import { EventCard } from "@/components/card/eventCard";
import { MapCard, type MapCardDestination } from "@/components/card/mapCard";
import { ArrivalReportCard } from "@/components/card/ArrivalReportCard";
import Header from "@/components/homepage/Header";
import Footer from "@/components/homepage/Footer";

// GET /api/events/:id のレスポンス型
type ApiEvent = {
  id: string;
  groupId: string;
  title: string;
  description: string | null;
  meetingTime: string;
  destination: MapCardDestination | null;
  group: {
    id: string;
    name: string;
    iconUrl: string;
  };
  members: {
    userId: string;
    isAttending: boolean;
    meetingTime: string | null;
    arrivedAt: string | null;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }[];
};

// 到着報告していないメンバーのステータス（従来のダミー）
const DEFAULT_STATUS: MemberStatus = { type: "missing" };

export default function EventPage() {
  const params = useParams<{ groupId: string; eventId: string }>();
  const { groupId, eventId } = params;

  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [myUserId, setMyUserId] = useState<string | null>(null);
  // 到着報告後にイベント情報を再取得するためのキー（値を更新すると再取得が走る）
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);

        if (!response.ok) {
          throw new Error("イベントの取得に失敗しました");
        }

        const data: ApiEvent = await response.json();
        setEvent(data);
      } catch (error) {
        console.error(error);
        setError("イベントの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    void fetchEvent();
  }, [eventId, refreshKey]);

  // 自分のユーザーIDを取得する（到着報告の状態を「自分の分」だけ判定するため）
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await fetch("/api/users/me");
        if (!response.ok) return;
        const me: { id: string } = await response.json();
        setMyUserId(me.id);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchMe();
  }, []);

  // 読み込み中
  if (loading) {
    return (
      <main className="mx-auto w-full max-w-md p-4 pt-20 pb-20">
        <Header />
        <p className="text-center text-gray-500">
          イベントを読み込んでいます...
        </p>
        <Footer />
      </main>
    );
  }

  // 取得失敗 or イベントなし
  if (error || !event) {
    return (
      <main className="mx-auto w-full max-w-md p-4 pt-20 pb-20">
        <Header />
        <h1 className="text-2xl font-bold">イベントが見つかりません</h1>
        <Button variant="outline" asChild className="mt-6">
          <Link href={`/group/${groupId}`}>グループページに戻る</Link>
        </Button>
        <Footer />
      </main>
    );
  }

  // 集合日時を表示用に整形（例: 8月24日(月) 19:00）
  const meetingDate = new Date(event.meetingTime);
  const meetDateLabel = meetingDate.toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
  const meetTimeLabel = meetingDate.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // 自分の到着報告状態（未報告なら null）
  const myArrivedAt =
    myUserId !== null
      ? (event.members ?? []).find((member) => member.userId === myUserId)
        ?.arrivedAt ?? null
      : null;

  // 参加メンバーを画面表示用の形に変換
  const members: {
    id: string;
    name: string;
    avatarUrl: string;
    fallbackText: string;
    status: MemberStatus;
  }[] = (event.members ?? []).map((member) => {
    const userName = member.user.name ?? "名前未設定";
    return {
      id: member.user.id,
      name: userName,
      avatarUrl: member.user.image ?? "",
      fallbackText: userName.slice(0, 2),
      // 到着報告済みのメンバーは到着時刻を表示し、未報告は従来のダミー（missing）
      status: member.arrivedAt
        ? {
          type: "arrived",
          time: new Date(member.arrivedAt).toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }
        : DEFAULT_STATUS,
    };
  });

  return (
    <div className="max-w-md mx-auto bg-[#FBF9F6] min-h-screen text-stone-800 font-sans p-4 space-y-4 pb-8 shadow-md pt-20">
      <Header />

      {/* イベントの基本情報 */}
      <EventCard
        event={{
          title: event.title,
          location:
            event.destination?.name ??
            event.destination?.address ??
            "目的地未設定",
          meetDate: meetDateLabel,
          meetTime: meetTimeLabel,
        }}
      />

      {/* 目的地の地図（destination からピンを表示） */}
      <MapCard destination={event.destination} />


      {/* 到着報告（目的地付近でのみ押せる。集合時間を過ぎての報告は遅刻として記録される） */}
      <ArrivalReportCard
        eventId={event.id}
        meetingTime={event.meetingTime}
        destination={event.destination}
        arrivedAt={myArrivedAt}
        onArrived={() => {
          // 報告後にイベント情報を再取得してメンバーの到着状態を更新する
          setRefreshKey((key) => key + 1);
        }}
      />

      {members.length > 0 && (
        <div className="space-y-2.5">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              name={member.name}
              avatarUrl={member.avatarUrl}
              fallbackText={member.fallbackText}
              status={member.status}
            />
          ))}
        </div>
      )}

      <Button variant="outline" asChild>
        <Link href={`/group/${groupId}`}>グループページに戻る</Link>
      </Button>

      <Footer />
    </div>
  );
}