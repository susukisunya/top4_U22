"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/homepage/Header";
import Footer from "@/components/homepage/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Status = "idle" | "joining" | "success" | "already" | "error";

// 招待QRコード・招待URLから開くグループ参加ページ。
// 「参加する」を押すと POST /api/groups/:id/join でメンバーに追加される。
export default function JoinGroupPage() {
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleJoin = async () => {
    if (!groupId) {
      setStatus("error");
      setErrorMessage("招待URLが正しくありません");
      return;
    }

    setStatus("joining");

    try {
      const res = await fetch(`/api/groups/${groupId}/join`, {
        method: "POST",
      });

      // 未ログインの場合はログインページへ（ログイン後にこのページへ戻れるようURLを渡す）
      if (res.status === 401) {
        window.location.href = `/auth/login?callbackUrl=${encodeURIComponent(
          window.location.pathname
        )}`;
        return;
      }

      // すでに参加している場合
      if (res.status === 409) {
        setStatus("already");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.error ?? "グループへの参加に失敗しました");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch (error) {
      console.error("グループへの参加に失敗しました:", error);
      setErrorMessage("グループへの参加に失敗しました");
      setStatus("error");
    }
  };

  // 参加完了（または参加済み）の表示
  if (status === "success" || status === "already") {
    return (
      <main className="mx-auto w-full max-w-2xl p-6 pt-20 pb-20">
        <Header />

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {status === "already"
                ? "すでに参加しています"
                : "グループに参加しました"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {status === "already"
                ? "このグループにはすでに入っています。"
                : "招待されたグループに追加されました。"}
            </p>

            <Button asChild className="w-full">
              <Link href={`/group/${groupId}`}>
                グループページを開く
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Footer />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-6 pt-20 pb-20">
      <Header />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            グループに参加
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            このグループに参加しますか？
          </p>

          <Button
            type="button"
            className="w-full"
            onClick={handleJoin}
            disabled={status === "joining"}
          >
            {status === "joining"
              ? "参加しています..."
              : "グループに参加する"}
          </Button>

          {status === "error" && (
            <p className="text-sm text-red-500">
              {errorMessage}
            </p>
          )}
        </CardContent>
      </Card>

      <Button variant="outline" asChild className="mt-4">
        <Link href="/group">
          グループ一覧に戻る
        </Link>
      </Button>

      <Footer />
    </main>
  );
}