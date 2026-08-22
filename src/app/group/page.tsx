// グループ一覧画面
import { GroupCard } from "@/components/card/group-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import Header from "@/components/homepage/Header";
import Footer from "@/components/homepage/Footer";

type Group = {
  id: string;
  name: string;
  iconUrl?: string;
  memberCount: number;
};

// APIから取得する想定の仮データ
const groups: Group[] = [
  {
    id: "group-1",
    name: "情報工学科A班",
    iconUrl: "",
    memberCount: 5,
  },
  {
    id: "group-2",
    name: "情報工学科B班",
    iconUrl: "",
    memberCount: 8,
  },
  {
    id: "group-3",
    name: "ゲーム制作班",
    iconUrl: "",
    memberCount: 6,
  },
];

export default function GroupListPage() {
  return (
    <main className="mx-auto w-full max-w-2xl p-6 pt-20 pb-20">
      <Header />

      <h1 className="mb-6 text-3xl font-bold">
        所属グループ一覧
      </h1>

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