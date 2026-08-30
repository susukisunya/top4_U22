"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

type Profile = {
  name: string;
  image: string;
};

export default function Header() {
  const [name, setName] = useState("");
  const [image, setIcon] = useState("");

  // 呼び出し処理
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/users/me");
      const data = await res.json();

      setName(data.name);
      setIcon(data.image);
    };

    fetchUser();
  }, []);

  // 取得できなかった場合のエラーメッセージ
  if (!name) {
    return <p>ユーザー情報未登録</p>;
  }

  // 表示されるヘッダー
  return (
    <header className="fixed top-0 left-0 z-50 w-full flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">

      <div className="flex items-center gap-3">
        <img
          src={image}
          alt={`${name}のアイコン`}
          className="h-10 w-10 rounded-full object-cover"
        />

        <h1 className="text-s font-bold text-orange-600">
          {name}
        </h1>

        <h2 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-black">遅刻王</h2>
      </div>

      <Bell size={20} />
    </header>
  );
}