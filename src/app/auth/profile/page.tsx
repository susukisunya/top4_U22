//初回登録画面
"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  // セッション確認中
  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <p className="text-sm text-muted-foreground">読み込み中...</p>
      </main>
    );
  }

  // 未ログインならGoogleログインを促す
  if (status === "unauthenticated") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              アカウント登録
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              登録にはまずGoogleでログインしてください
            </p>

            <Button
              type="button"
              onClick={() =>
                signIn("google", {
                  callbackUrl: "/auth/profile",
                })
              }
              className="w-full py-6 text-base font-semibold"
            >
              Googleでログイン
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // ログイン済み：Googleアカウントの情報を初期値にして登録フォームを表示する
  return (
    <ProfileForm
      defaultName={session?.user?.name ?? ""}
      defaultIcon={session?.user?.image ?? ""}
    />
  );
}

function ProfileForm({
  defaultName,
  defaultIcon,
}: {
  defaultName: string;
  defaultIcon: string;
}) {
  const router = useRouter();
  const [username, setUsername] = useState(defaultName);
  const [iconUrl, setIconUrl] = useState(defaultIcon);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // DBにユーザーネームとアイコンを保存する
  const handleRegister = async () => {
    if (!username.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: username.trim(),
          icon: iconUrl,
        }),
      });

      if (!res.ok) {
        throw new Error(`/api/users/me の更新に失敗しました: ${res.status}`);
      }

      router.push("/");
    } catch (e) {
      console.error("ユーザー登録に失敗しました:", e);
      setError("ユーザー登録に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            アカウント登録
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          

          {/* アイコン */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={iconUrl} />

              <AvatarFallback className="text-2xl">
                {username
                  ? username.slice(0, 2)
                  : "？"}
              </AvatarFallback>
            </Avatar>

            <div className="w-full space-y-2">
              <label
                htmlFor="icon"
                className="text-sm font-medium"
              >
                アイコン
              </label>

              <Input
                id="icon"
                type="text"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                placeholder="アイコン画像URL"
              />
            </div>
          </div>

          {/* ユーザーネーム */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium"
            >
              ユーザーネーム
            </label>

            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ユーザーネームを入力"
            />
          </div>

          {/* 説明 */}
          <p className="text-center text-sm text-muted-foreground">
            ユーザーネームとアイコンは後から変更可能です
          </p>

          {error && (
            <p className="text-center text-sm text-red-500">{error}</p>
          )}

          {/* 登録ボタン */}
          <Button
            type="button"
            onClick={handleRegister}
            disabled={isSubmitting || !username.trim()}
            className="w-full bg-gray-700 py-6 text-base font-semibold hover:bg-gray-600"
          >
            {isSubmitting ? "登録中..." : "登録する"}
          </Button>

        </CardContent>
      </Card>
    </main>
  );
}