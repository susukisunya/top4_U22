//グループページ
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion";
import { MoreVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Copy } from "lucide-react";
import { Plus } from "lucide-react";
import { UsersRound } from "lucide-react";
import { UserPlus } from "lucide-react";
import { CalendarPlus } from "lucide-react";
import { GroupHeader } from "@/components/card/group-header";
import Header from "@/components/homepage/Header";
import Footer from "@/components/homepage/Footer";

type Props = {
  params: Promise<{
    groupId: string;
  }>;
};

// APIから取得するグループの型
type Group = {
  id: string;
  name: string;
  iconUrl?: string | null;
  createdAt: string;
  updatedAt: string;

  _count: {
    members: number;
  };

  members: {
    userId: string;
    displayName: string | null;
    lateCount: number;
    joinedAt: string;

    user: {
      id: string;
      name: string | null;
      icon: string | null;
    };
  }[];
  
  events: {
    id: string;
    title: string;
    meetingTime: string;
  }[];
};

export default async function GroupPage({ params }: Props) {
  const { groupId } = await params;

  // APIからグループ情報を取得
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/groups/${groupId}`,
    {
      cache: "no-store",
    }
  );

  // グループが取得できなかった場合
  if (!response.ok) {
      return (
      <main className="mx-auto w-full max-w-2xl p-6 pt-20 pb-20">
        <Header />

        <h1 className="text-2xl font-bold">
          グループが見つかりません
        </h1>

        <Button
          variant="outline"
          asChild
          className="mt-6"
        >
          <Link href="/group">
            グループ一覧に戻る
          </Link>
        </Button>

        <Footer />
      </main>
    );
  }

  const group: Group = await response.json();

  // APIのmembersを画面表示用に変換
  const users = group.members.map((member) => ({
    id: member.user.id,
    username:
      member.displayName ?? member.user.name ?? "名前未設定",
    iconUrl: member.user.icon ?? "",
    lateCount: member.lateCount,
  }));

  // 遅刻回数が少ない順に並び替え
  const ranking = [...users].sort(
    (a, b) => a.lateCount - b.lateCount
  );

  return (
    <main className="mx-auto w-full max-w-2xl p-6 pt-20 pb-20">
      <Header />

      {/* グループ名 */}
      <div className="mb-4 flex items-center gap-4">
        <GroupHeader
          name={group.name}
          iconUrl={group.iconUrl ?? ""}
          memberCount={group._count.members}
        />

        {/* グループ設定 */}
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="ml-auto"
        >
          <Link href={`/group/${groupId}/settingGroup`} aria-label="グループ設定">
            <MoreVertical className="!h-6 !w-6" />
          </Link>
        </Button>
      </div>

      {/* メンバー一覧 */}
      <Card className="mb-4 bg-gray-100/80 p-0 overflow-hidden">
        <CardContent className="p-0">
          <Accordion type="single" collapsible >
            <AccordionItem value="members">
              <AccordionTrigger
                className="px-4 py-2 bg-gray-200 text-lg font-semibold hover:bg-gray-200/60"
              >
                <div className="flex items-center gap-2">
                  <UsersRound className="h-5 w-5" />

                  <span>
                    メンバー一覧（{users.length}人）
                  </span>
                </div>
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

      {/* メンバー招待 */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="mb-4 w-full bg-gray-300 py-6 text-base font-semibold text-black shadow-sm hover:bg-gray-200"
          >
            <UserPlus className="mr-2 !h-6 !w-6" />
            メンバーを招待
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              メンバーを招待
            </DialogTitle>

            <DialogDescription>
              以下のQRコードまたはURLからグループに参加できます。
            </DialogDescription>
          </DialogHeader>

          {/* QRコード */}
          <div className="flex flex-col items-center gap-3 py-4">
            <p className="text-sm font-semibold">
              QRコード
            </p>

            <div className="flex h-48 w-48 items-center justify-center rounded-lg border bg-gray-100">
              <span className="text-sm text-muted-foreground">
                QRコード
              </span>
            </div>
          </div>

          {/* 招待URL */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">
              招待URL
            </p>

            <div className="flex gap-2">
              <div className="flex-1 rounded-md border bg-gray-100 px-3 py-2 text-sm">
                https://example.com/group/invite/abc123
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </DialogContent>
      </Dialog>


      {/* 予定作成 */}
      <Button
        asChild
        className="mb-6 w-full bg-gray-300 py-6 text-base font-semibold text-black shadow-sm hover:bg-gray-200"
      >
        <Link href={`/group/${groupId}/createEvent`}>
          <CalendarPlus className="mr-2 !h-6 !w-6" />
          予定を作成
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
      
      <Footer/>
  </main>
  );
}


