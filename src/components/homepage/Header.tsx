import { Bell, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full flex items-center justify-between  border-b bg-white px-4 py-3 shadow-sm">
      
      <h1 className="text-xl font-bold text-orange-600">
        遅刻ガード
      </h1>

      <Bell size={20} />
    </header>
  );
}