//グループ,ランキングページ
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"


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
    <><div>
            <h1>グループページ</h1>
            <p>ここにグループの内容が表示されます。</p>
        </div>
        <div>aaa</div>
        <Card>
            <CardContent>グループ名</CardContent>
        </Card>
        <Card>
            <CardContent></CardContent>
        </Card>
        <Button>予定作成</Button>
        <Card>
            <CardContent>予定</CardContent>
        </Card>
        
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-bold">
        遅刻ランキング
      </h1>

      <div className="space-y-4">
        {ranking.map((user, index) => (
          <Card
            key={user.id}
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 text-center text-2xl font-bold">
                {index === 0
                  ? "🥇"
                  : index === 1
                  ? "🥈"
                  : index === 2
                  ? "🥉"
                  : `${index + 1}位`}
              </div>

              <Avatar className="h-12 w-12">
                <AvatarImage src={user.iconUrl} />
                <AvatarFallback>
                  {user.username.slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="text-lg font-semibold">
                  {user.username}
                </p>
              </div>
            </div>

            <Badge
              variant="destructive"
              className="px-3 py-1 text-base"
            >
              {user.lateCount}回
            </Badge>
          </Card>
        ))}
      </div>
    </main>
    </>
  );
}


