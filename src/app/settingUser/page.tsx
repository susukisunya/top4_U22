//ユーザーの設定画面
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPen, CircleUserRound, CircleX } from "lucide-react";
import Header from "@/components/homepage/Header";
import Footer from "@/components/homepage/Footer";

export default function SettingUserPage() {
  // 現在のユーザーネーム
  const [username, setUsername] = useState("ユーザーネーム");

  // ユーザーネーム変更用
  const [newUsername, setNewUsername] = useState(username);

  // 現在のアイコン
  const [iconUrl, setIconUrl] = useState("");

  // アイコン変更用
  const [newIconUrl, setNewIconUrl] = useState(iconUrl);

  // ユーザーネームを変更
  const handleUsernameChange = () => {
    const trimmedUsername = newUsername.trim();

    if (trimmedUsername === "") {
      return;
    }

    setUsername(trimmedUsername);
  };

  // アイコンを変更
  const handleIconChange = () => {
    setIconUrl(newIconUrl);
  };

  // ユーザーネーム変更ドロワーを閉じたとき
  const resetUsername = () => {
    setNewUsername(username);
  };

  // アイコン変更ドロワーを閉じたとき
  const resetIcon = () => {
    setNewIconUrl(iconUrl);
  };

  return (
    <main className="mx-auto w-full max-w-2xl p-6 pt-20 pb-20">
      <Header />

      <h1 className="mb-6 text-3xl font-bold">
        アカウント設定
      </h1>

      <Card className="!p-0">
        <CardContent className="p-0">
					{/* ユーザーネーム変更 */}
          <Drawer>
            <DrawerTrigger asChild>
                <button
                type="button"
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-muted"
                >
                <div className="flex items-center">
                    <UserPen className="mr-3 h-5 w-5" />
                    <span className="font-medium">
                    ユーザーネームの変更
                    </span>
                </div>

                <span className="text-muted-foreground">
                    ＞
                </span>
                </button>
            </DrawerTrigger>

            <DrawerContent className="max-h-[50vh]">
              <DrawerHeader>
                <DrawerTitle>
                  ユーザーネームの変更
                </DrawerTitle>
              </DrawerHeader>

              <div className="mx-auto w-full max-w-2xl px-6 py-4">
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium"
                  >
                    ユーザーネーム
                  </label>

                  <Input
                    id="username"
                    value={newUsername}
                    onChange={(e) =>
                      setNewUsername(e.target.value)
                    }
                    placeholder="ユーザーネームを入力"
                  />
                </div>
              </div>

              <DrawerFooter>
                <Button
                  type="button"
                  onClick={handleUsernameChange}
                >
                  変更する
                </Button>

                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    onClick={resetUsername}
                  >
                    閉じる
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* アイコン変更 */}
          <Drawer>
            <DrawerTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between border-t px-6 py-4 text-left transition-colors hover:bg-muted"
              >
                <div className="flex items-center">
                  <CircleUserRound className="mr-3 h-5 w-5" />

                  <span className="font-medium">
                    アイコン変更
                  </span>
                </div>

                <span className="text-muted-foreground">
                  ＞
                </span>
              </button>
            </DrawerTrigger>

            <DrawerContent className="max-h-[50vh]">
              <DrawerHeader>
                <DrawerTitle>
                  アイコン変更
                </DrawerTitle>
              </DrawerHeader>

              <div className="mx-auto w-full max-w-2xl px-6 py-4">
                <div className="space-y-2">
                  <label
                    htmlFor="iconUrl"
                    className="text-sm font-medium"
                  >
                    アイコン画像URL
                  </label>

                  <Input
                    id="iconUrl"
                    value={newIconUrl}
                    onChange={(e) =>
                      setNewIconUrl(e.target.value)
                    }
                    placeholder="アイコン画像URLを入力"
                  />
                </div>
              </div>

              <DrawerFooter>
                <Button
                  type="button"
                  onClick={handleIconChange}
                >
                  変更する
                </Button>

                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    onClick={resetIcon}
                  >
                    閉じる
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* アカウント削除 */}
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between border-t px-6 py-4 text-left transition-colors hover:bg-red-50"
              >
                <div className="flex items-center">
                  <CircleX className="mr-3 h-5 w-5 text-red-500" />

                  <span className="font-medium text-red-500">
                    アカウント削除
                  </span>
                </div>

                <span className="text-red-500">
                  ＞
                </span>
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  アカウントを削除しますか？
                </DialogTitle>

                <DialogDescription>
                  アカウントを削除すると、サービスを利用できなくなり、
									 <br />すべてのデータが削除されます。
                   <br />この操作を続けてもよろしいですか？
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="gap-2 sm:gap-2">
                <Button variant="destructive">
                  はい
                </Button>

                <DialogClose asChild>
									<Button variant="outline">
										いいえ
									</Button>
								</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </CardContent>
      </Card>

      <Footer />
    </main>
  );
}