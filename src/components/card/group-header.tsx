import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type GroupHeaderProps = {
  name: string;
  iconUrl?: string;
  memberCount: number;
};

export function GroupHeader({
  name,
  iconUrl,
  memberCount,
}: GroupHeaderProps) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={iconUrl} />

        <AvatarFallback className="text-xl">
          {name.slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      <div>
        <h1 className="text-3xl font-bold">
          {name}
        </h1>

        <p className="text-muted-foreground">
          メンバー {memberCount}人
        </p>
      </div>
    </div>
  );
}