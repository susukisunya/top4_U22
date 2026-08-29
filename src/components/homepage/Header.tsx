"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

type Profile = {
  username: string;
  icon: string;
};

export default function Header() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/routes/users");
      const data = await res.json();

      setUsername(data.username);
    };

    fetchUser();
  }, []);

  if (!username) {
    return <p>ぴーや</p>;
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-full flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
      <h1 className="text-xl font-bold text-orange-600">
        {username}
      </h1>

      <Bell size={20} />
    </header>
  );
}
