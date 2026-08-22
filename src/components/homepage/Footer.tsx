//フッター
"use client";

import { Home, User, Settings,  } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
	const pathname = usePathname();

	  const isHome = pathname === "/";
		const isGroup = pathname.startsWith("/group");
		const isSetting = pathname.startsWith("/settingUser");
  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full flex justify-center gap-20 items-center border-t bg-white px-4 py-3 shadow-md">
    	{/* ホーム */}
      <Link
        href="/"
        className={`flex flex-col items-center ${
          isHome ? "font-bold text-black" : "text-gray-600"
        }`}
      >
        <Home
          size={22}
          strokeWidth={isHome ? 3 : 2}
        />
        <h1 className="text-xs">
          ホーム
        </h1>
      </Link>

      {/* グループ */}
      <Link
        href="/group"
        className={`flex flex-col items-center ${
          isGroup ? "font-bold text-black" : "text-gray-600"
        }`}
      >
        <User
          size={22}
          strokeWidth={isGroup ? 3 : 2}
        />
        <h1 className="text-xs">
          グループ
        </h1>
      </Link>

      {/* 設定 */}
      <Link
        href="/settingUser"
        className={`flex flex-col items-center ${
          isSetting ? "font-bold text-black" : "text-gray-600"
        }`}
      >
        <Settings
          size={22}
          strokeWidth={isSetting ? 3 : 2}
        />
        <h1 className="text-xs">
          設定
        </h1>
      </Link>


    </footer>
  );
}