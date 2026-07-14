//グループ,ランキングページ
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion";

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
    <><div>
            <h1>グループページ</h1>
            <p>ここにグループの内容が表示されます。</p>
        </div>
        <div>aaa</div>
        <div className="mb-8 flex items-center gap-4">
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
      </div>
      <Accordion type="single" collapsible className="mb-6">
        <AccordionItem value="members">
          <AccordionTrigger className="text-lg font-semibold">
            メンバー一覧（{users.length}人）
          </AccordionTrigger>

          <AccordionContent>
            <div className="space-y-3">
              {users.map((user) => (
                <Card
                  key={user.id}
                  className="flex items-center gap-4 p-3"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.iconUrl} />
                    <AvatarFallback>
                      {user.username.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <p className="font-medium">{user.username}</p>
                  </div>  
                </Card>
            ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
        
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


