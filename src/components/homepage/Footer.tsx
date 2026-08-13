import { Home, User, Settings,  } from "lucide-react";

export default function Footer() {
  return (
    <footer className="flex justify-between items-center border-t-2 border-black px-4 py-3">
        <div className="flex flex-col items-center">
            <Home size={22} />
                <h1 className="text-xs text-gray-600">
                    ホーム画面
                </h1>
        </div>

        <div className="flex flex-col items-center">
            <User size={22} />
                <h1 className="text-xs text-gray-600">
                    グループ
                </h1>
        </div>

        <div className="flex flex-col items-center">
            <Settings size={22} />
                <h1 className="text-xs text-gray-600">
                    設定
                </h1>
        </div>
    </footer>
  );
}