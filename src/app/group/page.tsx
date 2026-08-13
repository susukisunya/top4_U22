//グループ,ランキングページ
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion";
import Link from "next/link";
import { MoreVertical } from "lucide-react";

type Group = {
  id: string;
  name: string;
  iconUrl?: string;
};

const group: Group = {
  id: "group-1",
  name: "情報工学科A班",
  iconUrl: "",
};

type User = {
  id: string;
  username: string;
  iconUrl?: string;
  lateCount: number;
};

// APIから取得する想定の仮データ
const users: User[] = [
  {
    id: "1",
    username: "太郎",
    iconUrl: "",
    lateCount: 2,
  },
  {
    id: "2",
    username: "次郎",
    iconUrl: "",
    lateCount: 5,
  },
  {
    id: "3",
    username: "花子",
    iconUrl: "",
    lateCount: 1,
  },
  {
    id: "4",
    username: "三郎",
    iconUrl: "",
    lateCount: 9,
  },
  {
    id: "5",
    username: "四郎",
    iconUrl: "",
    lateCount: 3,
  },
];

export default function GroupPage() {
  // 遅刻回数が少ない順に並び替え
  const ranking = [...users].sort(
    (a, b) => a.lateCount - b.lateCount
  );

  return (
    <main className="mx-auto w-full max-w-2xl p-6">

      {/* グループ名 */}
      <div className="mb-6 flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={group.iconUrl} />
          <AvatarFallback className="text-xl">
            {group.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div>
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <p className="text-muted-foreground">
            メンバー {users.length}人
          </p>
        </div>

        {/* グループ設定 */}
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="ml-auto"
        >
          <Link href="/group/settings" aria-label="グループ設定">
            <MoreVertical className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      {/* メンバー一覧 */}
      <Card className="mb-4 bg-gray-100/80 p-0 overflow-hidden">
        <CardContent className="p-0">
          <Accordion type="single" collapsible >
            <AccordionItem value="members">
              <AccordionTrigger
                className="px-4 py-2 bg-gray-200 px-4 text-lg font-semibold hover:bg-gray-200/60"
              >
                メンバー一覧（{users.length}人）
              </AccordionTrigger>

              <AccordionContent className="px-2 pt-3 pb-2">
                <div className="space-y-2">
                  {users.map((user) => (
                    <Card
                      key={user.id}
                      className="p-3"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.iconUrl} />
                          <AvatarFallback>
                            {user.username.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <p className="font-medium">{user.username}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      {/* 予定作成 */}
      <Button
        asChild
        className="mb-4 w-full text-base font-semibold"
      >
        <Link href="/group/schedule/create">
          予定作成
        </Link>
      </Button>

      {/* 次回予定表示 */}
      <Card>
        <CardContent>予定</CardContent>
      </Card>

      {/* 遅刻ランキング */}
      <section>
        <h1 className="mb-4 text-3xl font-bold">
          遅刻ランキング
        </h1>

        <div className="space-y-4">
          {ranking.map((user, index) => (
            <Card
              key={user.id}
              className={`w-full p-4 ${
                index === 0
                  ? "border-2 border-amber-500"
                  : ""
              }`}
            >
              <div className="flex w-full items-center gap-4">

                {/* 順位 */}
                  <div
                    className={`w-16 shrink-0 text-center font-bold ${
                      index === 0
                        ? "text-3xl text-amber-500"
                        : "text-lg"
                      }`}
                  >
                    {index === 0 ? "1位" : `${index + 1}位`}
                </div>

                  {/* アイコン */}
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage src={user.iconUrl} />
                    <AvatarFallback>
                      {user.username.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                    {/* ユーザー名 */}
                    <p className="min-w-0 flex-1 text-lg font-semibold">
                      {user.username}
                    </p>
                

                {/* 遅刻回数 */}
                <Badge
                  variant="destructive"
                  className="shrink-0 px-3 py-1 text-base"
                >
                  {user.lateCount}回
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>
  </main>
  );
}


