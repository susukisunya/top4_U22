//グループ,ランキングページ
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type RankingCardProps = {
  rank: number;
  name: string;
  icon?: string;
  lateCount: number;
};

export default function Group({
  rank,
  name,
  icon,
  lateCount,
}: RankingCardProps) {
    const medal =
    rank === 1
      ? "🥇"
      : rank === 2
      ? "🥈"
      : rank === 3
      ? "🥉"
      : "";

    return (
        <><div>
            <h1>グループページ</h1>
            <p>ここにグループの内容が表示されます。</p>
        </div>
        <div>aaa</div>
        <Card>
            <CardContent>aaa</CardContent>
        </Card>
        <Card></Card>
        <div>ランキング</div>
        <Card className="flex items-center justify-between p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-12 text-center text-xl font-bold">
          {medal || `${rank}位`}
        </div>

        <Avatar className="h-12 w-12">
          <AvatarImage src={icon} />
          <AvatarFallback>
            {name?.slice(0, 2) ?? "?"}
          </AvatarFallback>
        </Avatar>

        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">
            Rank #{rank}
          </p>
        </div>
      </div>

      <Badge variant="destructive" className="text-base px-3 py-1">
        {lateCount}回
      </Badge>
    </Card>
        </>
    );
}
