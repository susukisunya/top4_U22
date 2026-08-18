"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";

type Props = {
  params: Promise<{
    groupId: string;
  }>;
};

type User = {
  id: string;
  username: string;
  iconUrl?: string;
};

// APIから取得する想定の仮データ
const users: User[] = [
  {
    id: "1",
    username: "メンバー1",
    iconUrl: "",
  },
  {
    id: "2",
    username: "メンバー2",
    iconUrl: "",
  },
  {
    id: "3",
    username: "メンバー3",
    iconUrl: "",
  },
  {
    id: "4",
    username: "メンバー4",
    iconUrl: "",
  },
  {
    id: "5",
    username: "メンバー5",
    iconUrl: "",
  },
];

export default function CreateSchedulePage() {
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;

  const [scheduleName, setScheduleName] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  // 選択されているメンバーのID
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  // メンバーを選択・解除
  const toggleMember = (userId: string) => {
    setSelectedMembers((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId]
    );
  };

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
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
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              placeholder="予定の名前を入力"
            />
          </div>
          {/* 集合場所 */}
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">
              集合場所
            </h2>

            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="集合場所を入力"
            />
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
          <div>
            <h2 className="mb-2 text-lg font-semibold">
              集合日時
            </h2>
          </div>
          機能はあとで追加

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
                    className={`flex w-full items-center gap-4 px-4 py-3 text-left transition-colors ${
                      isSelected
                        ? "bg-gray-200"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {/* 選択状態を表す丸 */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                        isSelected
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

          <Button className="mt-6">
            作成
          </Button>
        </CardContent>
      </Card>

      <Button variant="outline" asChild>
        <Link href={`/group/${groupId}`}>
            戻る
        </Link>
      </Button>
    </main>
  

  );
}