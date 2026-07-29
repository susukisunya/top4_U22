import { Bell, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b-2 border-black px-4 py-3">
      <Menu size={22} />

      <h1 className="text-xl font-bold text-orange-600">
        遅刻ガード
      </h1>

      <Bell size={20} />
    </header>
  );
}