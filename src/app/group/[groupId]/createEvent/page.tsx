//予定作成
"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { ja } from "react-day-picker/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { GroupHeader } from "@/components/card/group-header";
import { DestinationSetterCard, type SelectedDestination } from "@/components/card/destinationSetterCard";
import Header from "@/components/homepage/Header";
import Footer from "@/components/homepage/Footer";

type User = {
  id: string;
  username: string;
  iconUrl?: string;
};

type Group = {
  id: string;
  name: string;
  iconUrl?: string;
};

// GET /api/groups/:id のレスポンス型（参加メンバーを含む）
type ApiGroup = {
  id: string;
  name: string;
  iconUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    members: number;
  };
  members: {
    userId: string;
    displayName: string | null;
    lateCount: number;
    joinedAt: string;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }[];
};


export default function CreateEventPage() {
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;

  const [eventName, setEventName] = useState("");
  const [notes, setNotes] = useState("");
  // 選択されているメンバーのID
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  // マップで選択された目的地（作成時に一緒に保存する）
  const [destination, setDestination] = useState<SelectedDestination | null>(null);
  // 集合日時（日付は Calendar、時刻は input[type=time] で選択）
  const [meetingDate, setMeetingDate] = useState<Date | undefined>(undefined);
  const [meetingTime, setMeetingTime] = useState<string>("12:00");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");

  // APIから取得するグループとメンバー(ユーザー)
  const [group, setGroup] = useState<Group | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // グループと参加メンバーをAPIから取得
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await fetch(`/api/groups/${groupId}`);

        if (!response.ok) {
          throw new Error("グループの取得に失敗しました");
        }

        const data: ApiGroup = await response.json();

        setGroup({
          id: data.id,
          name: data.name,
          iconUrl: data.iconUrl ?? "",
        });

        // APIのmembersを画面表示用に変換
        setUsers(
          data.members.map((member) => ({
            id: member.user.id,
            username:
              member.displayName ?? member.user.name ?? "名前未設定",
            iconUrl: member.user.image ?? "",
          }))
        );
      } catch (error) {
        console.error(error);
        setError("グループの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);
  // メンバーを選択・解除
  const toggleMember = (userId: string) => {
    setSelectedMembers((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId]
    );
  };

  // 選択した日付と時刻を組み合わせて meetingTime を作成
  const buildMeetingTime = (): Date | null => {
    if (!meetingDate) return null;

    const [hours, minutes] = meetingTime.split(":").map(Number);
    const date = new Date(meetingDate);
    date.setHours(hours ?? 0, minutes ?? 0, 0, 0);
    return date;
  };

  // 予定を作成（POST /api/events）
  const handleSubmit = async () => {
    const meetingTimeDate = buildMeetingTime();
    if (!eventName.trim()) {
      setSubmitError("予定の名前を入力してください");
      return;
    }
    if (!meetingTimeDate) {
      setSubmitError("集合日時を選択してください");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          title: eventName.trim(),
          description: notes.trim() || null,
          meetingTime: meetingTimeDate.toISOString(),
          // 選択された目的地（無ければ null）
          destination: destination
            ? {
                name: destination.name,
                address: destination.address || null,
                latitude: destination.latitude,
                longitude: destination.longitude,
                placeId: destination.placeId ?? null,
              }
            : null,
          // 選択された参加メンバーのID一覧
          memberIds: selectedMembers,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "予定の作成に失敗しました");
      }

      // 作成成功後はグループページへ戻る
      window.location.href = `/group/${groupId}`;
    } catch (error) {
      console.error(error);
      setSubmitError(
        error instanceof Error ? error.message : "予定の作成に失敗しました"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // 読み込み中
  if (loading) {
    return (
      <main className="mx-auto w-full max-w-2xl p-6 pt-20 pb-20">
        <Header />
        <p className="text-center text-gray-500">
          グループを読み込んでいます...
        </p>
        <Footer />
      </main>
    );
  }

  // グループの取得に失敗した場合
  if (error || !group) {
    return (
      <main className="mx-auto w-full max-w-2xl p-6 pt-20 pb-20">
        <Header />
        <h1 className="text-2xl font-bold">グループが見つかりません</h1>
        <Button variant="outline" asChild className="mt-6">
          <Link href="/group">グループ一覧に戻る</Link>
        </Button>
        <Footer />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-6 pt-20 pb-20">
      <Header />

      <GroupHeader
        name={group.name}
        iconUrl={group.iconUrl}
        memberCount={users.length}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            予定を作成
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* 予定名 */}
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">
              予定の名前
            </h2>

            <Input
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="予定の名前を入力"
            />
          </div>
          {/* 集合場所 */}
          <div className="mb-6">
            <DestinationSetterCard onDestinationSelected={setDestination} />
          </div>

          {/* 詳細 */}
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">
              詳細
            </h2>

            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="予定の詳細を入力"
              className="min-h-24 resize-none"
            />
          </div>

          {/* 日時 */}
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">
              集合日時
            </h2>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* 日付選択（Calendar） */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-start gap-2 text-left font-normal"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {meetingDate
                      ? meetingDate.toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          weekday: "short",
                        })
                      : "日付を選択"}
                  </Button>
                </DialogTrigger>

                <DialogContent className="w-fit">
                  <DialogHeader>
                    <DialogTitle>日付を選択</DialogTitle>
                  </DialogHeader>

                  <Calendar
                    mode="single"
                    selected={meetingDate}
                    onSelect={setMeetingDate}
                    locale={ja}
                    className="rounded-lg border"
                  />
                </DialogContent>
              </Dialog>

              {/* 時刻選択 */}
              <Input
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                className="w-40"
              />
            </div>

            {meetingDate && (
              <p className="mt-2 text-sm text-muted-foreground">
                集合日時:{" "}
                {meetingDate.toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "short",
                })}{" "}
                {meetingTime}
              </p>
            )}
          </div>

          {/* 参加メンバー */}
          <div>
            <h2 className="mb-3 text-lg font-semibold">
              参加メンバー
            </h2>

            <div className="space-y-3">
              {users.map((user) => {
                const isSelected = selectedMembers.includes(user.id);

                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggleMember(user.id)}
                    className={`flex w-full items-center gap-4 px-4 py-3 text-left transition-colors ${isSelected
                      ? "bg-gray-200"
                      : "bg-gray-100 hover:bg-gray-200"
                      }`}
                  >
                    {/* 選択状態を表す丸 */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${isSelected
                        ? "border-green-400 bg-green-400"
                        : "border-gray-300 bg-white"
                        }`}
                    >
                      {isSelected && (
                        <span className="text-sm font-bold text-white">
                          ✓
                        </span>
                      )}
                    </div>

                    {/* アイコン */}
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.iconUrl} />
                      <AvatarFallback>
                        {user.username.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    {/* ユーザーネーム */}
                    <span className="font-medium">
                      {user.username}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            size="lg"
            className="mt-6 w-full"
            disabled={!eventName.trim() || !meetingDate || submitting}
            onClick={handleSubmit}
          >
            {submitting && <Loader2 className="animate-spin" />}
            {submitting ? "作成中..." : "作成"}
          </Button>

          {submitError && (
            <p className="mt-3 text-sm text-destructive">{submitError}</p>
          )}
        </CardContent>
      </Card>

      <Button variant="outline" asChild>
        <Link href={`/group/${groupId}`}>
          戻る
        </Link>
      </Button>
      <Footer />
    </main>

  );
}