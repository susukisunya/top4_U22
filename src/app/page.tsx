import { headers } from "next/headers";
import Header from "@/components/homepage/Header";
import MonthlyLateCard from "@/components/homepage/MonthlyLateCard";
import { EventCard, type EventCardData } from "@/components/card/eventCard";
import ScheduleList from "@/components/homepage/ScheduleList";
import Footer from "@/components/homepage/Footer";
import Link from "next/link";

// GET /api/events の次回イベント表示用の型
type ApiEventData = {
  id: string;
  groupId: string;
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

// GET /api/users/me のレスポンス型（遅刻回数の表示に使う）
type ApiUserData = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  lateCount: number;
};

export const dynamic = "force-dynamic";

export default async function Home() {
  // 次回のイベント情報をAPIから取得する（取得失敗時やイベントが無い場合は null）
  let nextEvent: EventCardData | null = null;
  // 次回イベントに対応する詳細ページのリンク先（groupId / eventId）
  let nextEventLink: { groupId: string; eventId: string } | null = null;
  // ログイン中ユーザーの遅刻回数（取得失敗時は 0）
  let lateCount = 0;

  try {
    const base = process.env.NEXT_PUBLIC_APP_URL;
    // サーバーコンポーネントから内部APIを呼ぶ場合、ブラウザのCookieは自動付与されないため
    // セッションCookieを明示的に転送する（転送しないとAPI側で未ログイン扱いになり401になる）
    const cookieHeader = (await headers()).get("cookie") ?? "";
    const res = await fetch(`${base}/api/events`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    });

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
            // サーバーはUTCのため、日本のタイムゾーンを明示して9時間のずれを防ぐ
            timeZone: "Asia/Tokyo",
          }),
          meetTime: meetingDate.toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
            // サーバーはUTCのため、日本のタイムゾーンを明示して9時間のずれを防ぐ
            timeZone: "Asia/Tokyo",
          }),
        };
        // イベント詳細ページへのリンク先を保持する
        nextEventLink = {
          groupId: target.groupId,
          eventId: target.id,
        };
      }
    } else {
      // APIが401等を返した場合（セッションCookieの転送漏れ・失効など。詳細はAPI側の診断ログを参照）
      console.error(`/api/events が ${res.status} を返しました`);
    }
  } catch (error) {
    console.error("次回イベントの取得に失敗しました:", error);
  }

  // ログイン中ユーザーの遅刻回数をAPIから取得する
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL;
    // サーバーコンポーネントから内部APIを呼ぶ場合、セッションCookieを明示的に転送する
    const cookieHeader = (await headers()).get("cookie") ?? "";
    const res = await fetch(`${base}/api/users/me`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    });

    if (res.ok) {
      const me: ApiUserData = await res.json();
      lateCount = me.lateCount ?? 0;
    } else {
      // APIが401等を返した場合（未ログイン／セッションCookieの転送漏れなど）
      console.error(`/api/users/me が ${res.status} を返しました`);
    }
  } catch (error) {
    console.error("遅刻回数の取得に失敗しました:", error);
  }

  return (
    <main className="mx-auto flex min-h-screen w-[390px] flex-col bg-white border pt-20 pb-20">
      <Header />

      <div className="p-4 space-y-6">
        <MonthlyLateCard lateCount={lateCount} />

        {/* 次回のイベント情報（イベントが無い場合は「イベント無し」と表示）
            イベントがある場合のみ詳細ページへのリンクにする */}
        <Link
          className={nextEventLink ? undefined : "pointer-events-none"}
          href={
            nextEventLink
              ? `/group/${nextEventLink.groupId}/event/${nextEventLink.eventId}`
              : "#"
          }
          aria-disabled={nextEventLink ? undefined : true}
        >
          <EventCard event={nextEvent} />
        </Link>

        <ScheduleList />
      </div>

      <Footer/>
    </main>
  );
}