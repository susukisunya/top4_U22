"use client";

import { Bell, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // ユーザー情報を取得
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/users/me");
      const data = await res.json();

      setName(data.name);
      setImage(data.image);
    };

    fetchUser();
  }, []);

  // ユーザー情報を取得できなかった場合
  if (!name) {
    return <p>ユーザー情報未登録</p>;
  }

  return (
    <>
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 z-50 w-full flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">

        {/* 左側：アイコン・ユーザー名 */}
        <div className="flex items-center gap-3">
          <img
            src={image}
            alt={`${name}のアイコン`}
            className="h-10 w-10 rounded-full object-cover"
          />

          <h1 className="text-s font-bold text-orange-600">
            {name}
          </h1>
        </div>

        {/* 中央：タイトル */}
        <h2 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-black">
          遅刻王
        </h2>

        {/* 右側：通知ボタン */}
        <button
          onClick={() => setIsNotificationOpen(true)}
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <Bell size={20} />
        </button>
      </header>

      {/* 背景の暗い部分 */}
      {isNotificationOpen && (
        <div
          onClick={() => setIsNotificationOpen(false)}
          className="fixed inset-0 z-[60] bg-black/30"
        />
      )}

      {/* 通知画面 */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-80 bg-white shadow-xl transition-transform duration-300 ${
          isNotificationOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        {/* 通知画面のヘッダー */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">
            通知
          </h2>

          <button
            onClick={() => setIsNotificationOpen(false)}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* 通知内容 */}
        <div className="p-4">
          <p className="text-gray-500">
            通知はありません。
          </p>
        </div>
      </div>
    </>
  );
}
