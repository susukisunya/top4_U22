import Header from "@/components/homepage/Header";
import MonthlyLateCard from "@/components/homepage/MonthlyLateCard";
import { EventCard, type EventCardData } from "@/components/card/eventCard";
import ScheduleList from "@/components/homepage/ScheduleList";
import Footer from "@/components/homepage/Footer";
import Link from "next/link";

// GET /api/events の次回イベント表示用の型
type ApiEventData = {
  id: string;
  title: string;
  meetingTime: string;
  destination: {
    id: string;
    name: string;
    address: string | null;
    latitude: number;
    longitude: number;
    placeId: string | null;
  } | null;
};

export const dynamic = "force-dynamic";

export default async function Home() {
  // 次回のイベント情報をAPIから取得する（取得失敗時やイベントが無い場合は null）
  let nextEvent: EventCardData | null = null;

  try {
    const base =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/events`, { cache: "no-store" });

    if (res.ok) {
      const events: ApiEventData[] = await res.json();

      // 現在以降に開始する最も早いイベントを「次回のイベント」とする
      const now = new Date();
      const upcoming = events
        .filter((event) => new Date(event.meetingTime) >= now)
        .sort(
          (a, b) =>
            new Date(a.meetingTime).getTime() -
            new Date(b.meetingTime).getTime()
        );

      const target = upcoming[0];
      if (target) {
        const meetingDate = new Date(target.meetingTime);
        nextEvent = {
          title: target.title,
          location:
            target.destination?.name ??
            target.destination?.address ??
            "目的地未設定",
          meetDate: meetingDate.toLocaleDateString("ja-JP", {
            month: "long",
            day: "numeric",
            weekday: "short",
          }),
          meetTime: meetingDate.toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      }
    }
  } catch (error) {
    console.error("次回イベントの取得に失敗しました:", error);
  }

  return (
    <main className="mx-auto flex min-h-screen w-[390px] flex-col bg-white border pt-20 pb-20">
      <Header />

      <div className="p-4 space-y-6">
        <MonthlyLateCard />

        <Link
          href = "/group/1/event"
          >
      
        {/* 次回のイベント情報（イベントが無い場合は「イベント無し」と表示） */}
        <EventCard event={nextEvent} />
           </Link>

        <ScheduleList />
      </div>

      <Footer/>
    </main>
  );
}