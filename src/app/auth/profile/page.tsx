//初回登録画面
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
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
  const [username, setUsername] = useState("");
  const [iconUrl, setIconUrl] = useState("");

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

          {/* 登録ボタン */}
          <Button
            type="button"
            className="w-full bg-gray-700 py-6 text-base font-semibold hover:bg-gray-600"
          >
            登録する
          </Button>

        </CardContent>
      </Card>
    </main>
  );
}