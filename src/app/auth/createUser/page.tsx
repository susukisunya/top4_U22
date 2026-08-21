//ユーザー新規作成
"use client";

import { useState } from "react";

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

export default function CreateUserPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [iconUrl, setIconUrl] = useState("");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            アカウント新規作成
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* アイコン */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-24 w-24">
              <AvatarImage src={iconUrl} />
              <AvatarFallback className="text-2xl">
                {username ? username.slice(0, 2) : "?"}
              </AvatarFallback>
            </Avatar>

            <Input
              type="text"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              placeholder="アイコン画像URL"
            />
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

          {/* パスワード */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium"
            >
              パスワード
            </label>

            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
            />
          </div>

          {/* アカウント作成 */}
          <Button
            type="button"
            className="w-full bg-gray-700 py-6 text-base font-semibold hover:bg-gray-600"
          >
            アカウント作成
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}