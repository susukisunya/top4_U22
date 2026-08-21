//ログイン
"use client";

import { useState } from "react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            ログイン
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
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

          {/* ログインボタン */}
          <Button
            type="button"
            className="w-full bg-gray-700 py-6 text-base font-semibold hover:bg-gray-600"
          >
            ログイン
          </Button>

          {/* 新規作成 */}
          <div className="text-center">
            <Link href="/auth/createUser">
              <Button
                type="button"
                variant="link"
                className="text-sm"
              >
                アカウント新規作成はこちら
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}