// グループ一覧画面
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GroupCard } from "@/components/card/group-card";
import Header from "@/components/homepage/Header";
import Footer from "@/components/homepage/Footer";

type Group = {
  id: string;
  name: string;
  iconUrl?: string;
  memberCount: number;
};

export default function GroupListPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // グループ一覧を取得
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch("/api/groups");

        if (!response.ok) {
          throw new Error("グループ一覧の取得に失敗しました");
        }

        const data = await response.json();

                // APIのデータを画面用のデータに変換
        const formattedGroups: Group[] = data.map(
          (group: {
            id: string;
            name: string;
            iconUrl?: string;
            members: unknown[];
          }) => ({
            id: group.id,
            name: group.name,
            iconUrl: group.iconUrl,
            memberCount: group.members.length,
          })
        );

        setGroups(formattedGroups);
      } catch (error) {
        console.error(error);
        setError("グループ一覧の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <main className="mx-auto w-full max-w-2xl p-6 pt-20 pb-20">
      <Header />

      <h1 className="mb-6 text-3xl font-bold">
        所属グループ一覧
      </h1>

      {/* 読み込み中 */}
      {loading && (
        <p className="text-center text-gray-500">
          グループを読み込んでいます...
        </p>
      )}

      {/* エラー */}
      {error && (
        <p className="text-center text-red-500">
          {error}
        </p>
      )}

      {/* グループ一覧 */}
      {!loading && !error && (
        <div className="space-y-4">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              id={group.id}
              name={group.name}
              iconUrl={group.iconUrl}
              memberCount={group.memberCount}
            />
          ))}
        </div>
      )}

      {/* グループがない場合 */}
      {!loading && !error && groups.length === 0 && (
        <p className="text-center text-gray-500">
          所属しているグループはありません。
        </p>
      )}

      {/* グループ作成ボタン */}
      <Button
        asChild
        className="fixed bottom-24 right-6 rounded-full bg-red-700 shadow-lg hover:bg-red-600"
      >
        <Link href="/group/createGroup">
          <Plus className="h-5 w-5" />
          グループ作成
        </Link>
      </Button>

      <Footer/>
    </main>
  );
}