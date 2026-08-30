//初回登録画面
"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/upload-image";
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
  // 保存するURL（S3で発行されたURL or 初期状態ではGoogleアカウントの画像URL）
  const [iconUrl, setIconUrl] = useState(defaultIcon);
  // プレビュー表示用のURL（アップロード中は選択した画像を即座に表示する）
  const [iconPreviewUrl, setIconPreviewUrl] = useState(defaultIcon);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // アイコン画像を選択したら S3 にアップロードし、発行されたURLを保存用の状態に持つ
  const handleIconChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // 選択した画像をすぐプレビューする
    const previewObjectUrl = URL.createObjectURL(file);
    setIconPreviewUrl(previewObjectUrl);

    setIsUploadingIcon(true);
    setUploadError(null);
    try {
      const uploadedUrl = await uploadImage(file, "users");
      setIconUrl(uploadedUrl);
      setIconPreviewUrl(uploadedUrl);
      URL.revokeObjectURL(previewObjectUrl);
    } catch (e) {
      console.error("アイコンのアップロードに失敗しました:", e);
      setUploadError(
        e instanceof Error
          ? e.message
          : "アイコンのアップロードに失敗しました"
      );
      // 失敗したら元の画像のプレビューに戻す
      setIconPreviewUrl(iconUrl);
      URL.revokeObjectURL(previewObjectUrl);
    } finally {
      setIsUploadingIcon(false);
    }
  };

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
              <AvatarImage src={iconPreviewUrl} />

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

              {/* 選択した画像は S3 にアップロードされ、発行されたURLを保存する */}
              <input
                id="icon"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleIconChange}
                className="hidden"
              />

              <Button
                type="button"
                variant="outline"
                asChild
                className="w-full"
              >
                <span>
                  {isUploadingIcon ? "アップロード中..." : "アイコン画像を選択"}
                </span>
              </Button>

              {uploadError && (
                <p className="text-xs text-red-500">{uploadError}</p>
              )}
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
            disabled={isSubmitting || isUploadingIcon || !username.trim()}
            className="w-full bg-gray-700 py-6 text-base font-semibold hover:bg-gray-600"
          >
            {isSubmitting ? "登録中..." : "登録する"}
          </Button>

        </CardContent>
      </Card>
    </main>
  );
}