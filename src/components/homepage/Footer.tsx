"use client";

import { Home, User, Settings,  } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Footer() {
    const router = useRouter();
  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full flex justify-between items-center border-t-2 border-black px-4 py-3">
        <button onClick={() => router.push("/")}>
        <div className="flex flex-col items-center">
            <Home size={22} />
                <h1 className="text-xs text-gray-600">
                    ホーム画面
                </h1>
        </div>
        </button>

        <button onClick={() => router.push("/group/aaaa")}>
        <div className="flex flex-col items-center">
            <User size={22} />
                <h1 className="text-xs text-gray-600">
                    グループ
                </h1>
        </div>
        </button>

        <button onClick={() => router.push("/settingUser")}>
        <div className="flex flex-col items-center">
            <Settings size={22} />
                <h1 className="text-xs text-gray-600">
                    設定
                </h1>
        </div>
        </button>

    </footer>
  );
}