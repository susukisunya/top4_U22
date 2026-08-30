"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

type Profile = {
  username: string;
  icon: string;
};

export default function Header() {
  const [username, setName] = useState("");
  const [icon, setIcon] = useState("");

  // 呼び出し処理
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/routes/users");
      const data = await res.json();

      setName(data.username);
      setIcon(data.icon);
    };

    fetchUser();
  }, []);

  // 取得できなかった場合のエラーメッセージ
  if (!username) {
    return <p>ユーザー情報未登録</p>;
  }

  // 表示されるヘッダー
  return (
    <header className="fixed top-0 left-0 z-50 w-full flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">

      <div className="flex items-center gap-3">
        <img
          src={icon}
          alt={`${username}のアイコン`}
          className="h-10 w-10 rounded-full object-cover"
        />

        <h1 className="text-xl font-bold text-orange-600">
          {username}
        </h1>
      </div>

      <Bell size={20} />
    </header>
  );
}