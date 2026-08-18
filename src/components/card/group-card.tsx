import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

type GroupCardProps = {
  id: string;
  name: string;
  iconUrl?: string;
  memberCount: number;
};

export function GroupCard({
  id,
  name,
  iconUrl,
  memberCount,
}: GroupCardProps) {
  return (
    <Link href={`/group/${id}`} className="block">
      <div className="flex w-full items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-100">
        {/* グループアイコン */}
        <Avatar className="h-16 w-16 shrink-0">
          <AvatarImage src={iconUrl} />

          <AvatarFallback className="text-xl">
            {name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        {/* グループ情報 */}
        <div>
          <h2 className="text-xl font-bold">
            {name}
          </h2>

          <p className="text-muted-foreground">
            メンバー {memberCount}人
          </p>
        </div>
      </div>
    </Link>
  );
}