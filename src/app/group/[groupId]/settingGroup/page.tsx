//グループ設定ページ
"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { GroupHeader } from "@/components/card/group-header";

type Group = {
  id: string;
  name: string;
  iconUrl?: string;
};

const group: Group = {
  id: "group-1",
  name: "情報工学科A班",
  iconUrl: "",
};

const memberCount = 5;

export default function SettingGroupPage() {
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;

  // 現在のグループ名
  const [groupName, setGroupName] = useState(group.name);

  // 現在のグループアイコン
  const [groupIcon, setGroupIcon] = useState(group.iconUrl ?? "");

  // 選択した画像
  const [selectedIcon, setSelectedIcon] = useState("");

  // 入力中のグループ名
  const [newGroupName, setNewGroupName] = useState(group.name);

  // グループ名を変更
  const handleChangeGroupName = () => {
    if (!newGroupName.trim()) {
      return;
    }

    setGroupName(newGroupName.trim());
  };

  // アイコン画像を選択
  const handleIconChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // 画像ファイルか確認
    if (!file.type.startsWith("image/")) {
      return;
    }

    // 選択した画像をブラウザ上で表示する
    const imageUrl = URL.createObjectURL(file);

    setSelectedIcon(imageUrl);
  };

  // アイコンを変更
  const handleChangeIcon = () => {
    if (!selectedIcon) {
      return;
    }

    setGroupIcon(selectedIcon);
  };

// このグループ内で使用する表示名
const [displayName, setDisplayName] = useState("");

// 入力中の表示名
const [newDisplayName, setNewDisplayName] = useState("");

const handleChangeDisplayName = () => {
  const trimmedName = newDisplayName.trim();

  if (trimmedName === "") {
    return;
  }

  setDisplayName(trimmedName);
};

  return (
    <main className="mx-auto w-full max-w-2xl p-6">

      {/* グループ情報 */}
      <GroupHeader
        name={groupName}
        iconUrl={groupIcon}
        memberCount={memberCount}
      />

      {/* グループ設定 */}
      <Card>
        <CardHeader>
          <CardTitle>
            グループ設定
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">

          {/* グループ名の変更 */}
          <Drawer>
            <DrawerTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between border-t px-6 py-4 text-left transition-colors hover:bg-muted"
              >
                <span className="font-medium">
                  グループ名の変更
                </span>

                <span className="text-muted-foreground">
                  ＞
                </span>
              </button>
            </DrawerTrigger>

            <DrawerContent className="max-h-[50vh]">
              <DrawerHeader>
                <DrawerTitle>
                  グループ名の変更
                </DrawerTitle>

                <DrawerDescription>
                  新しいグループ名を入力してください。
                </DrawerDescription>
              </DrawerHeader>

              <div className="mx-auto w-full max-w-2xl px-6 py-4">

                <Input
                  value={newGroupName}
                  onChange={(event) =>
                    setNewGroupName(event.target.value)
                  }
                  placeholder="グループ名を入力"
                />

              </div>

              <DrawerFooter>

                <DrawerClose asChild>
                  <Button
                    onClick={handleChangeGroupName}
                    disabled={!newGroupName.trim()}
                  >
                    変更する
                  </Button>
                </DrawerClose>

                <DrawerClose asChild>
                  <Button variant="outline">
                    キャンセル
                  </Button>
                </DrawerClose>

              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* グループアイコンの変更 */}
          <Drawer>
            <DrawerTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between border-t px-6 py-4 text-left transition-colors hover:bg-muted"
              >
                <span className="font-medium">
                  グループアイコンの変更
                </span>

                <span className="text-muted-foreground">
                  ＞
                </span>
              </button>
            </DrawerTrigger>

            <DrawerContent className="max-h-[50vh]">
              <DrawerHeader>
                <DrawerTitle>
                  グループアイコンの変更
                </DrawerTitle>

                <DrawerDescription>
                  グループアイコンを変更します。
                </DrawerDescription>
              </DrawerHeader>

              <div className="mx-auto w-full max-w-2xl px-6 py-4">

                {/* アイコンプレビュー */}
                <div className="mb-6 flex justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={
                        selectedIcon ||
                        groupIcon
                      }
                    />

                    <AvatarFallback className="text-2xl">
                      {groupName.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* ファイル選択 */}
                <div className="space-y-3">
                  <label
                    htmlFor="group-icon"
                    className="block text-sm font-medium"
                  >
                    アイコン画像
                  </label>

                  <Input
                    id="group-icon"
                    type="file"
                    accept="image/*"
                    onChange={handleIconChange}
                  />
                </div>

              </div>

              <DrawerFooter>
                <DrawerClose asChild>
                  <Button
                    onClick={handleChangeIcon}
                    disabled={!selectedIcon}
                  >
                    アイコンを変更
                  </Button>
                </DrawerClose>

                <DrawerClose asChild>
                  <Button variant="outline">
                    閉じる
                  </Button>
                </DrawerClose>

              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* 表示名の設定 */}
          <Drawer>
            <DrawerTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between border-t px-6 py-4 text-left transition-colors hover:bg-muted"
              >
                <span className="font-medium">
                  表示名の設定
                </span>

                <span className="text-muted-foreground">
                  ＞
                </span>
              </button>
            </DrawerTrigger>

            <DrawerContent className="max-h-[50vh]">
              <DrawerHeader>
                <DrawerTitle>
                  表示名の設定
                </DrawerTitle>

                <DrawerDescription>
                  このグループ内で表示する名前を設定します。
                </DrawerDescription>
              </DrawerHeader>

              <div className="mx-auto w-full max-w-2xl px-6 py-4">

                {/* 現在の表示名 */}
                <div className="mb-4">
                  <p className="mb-2 text-sm text-muted-foreground">
                    現在の表示名
                  </p>

                  {displayName ? (
                    <p className="text-lg font-semibold">
                      {displayName}
                    </p>
                  ) : (
                    <p className="text-lg font-semibold text-muted-foreground">
                      ユーザーネームを表示中
                    </p>
                  )}
                </div>
                
                {/* 表示名入力 */}
                <div>
                  <p className="mb-2 text-sm font-medium">
                    新しい表示名
                  </p>

                  <Input
                    value={newDisplayName}
                    onChange={(event) =>
                      setNewDisplayName(event.target.value)
                    }
                    placeholder="このグループで使用する名前"
                  />
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  この名前は{groupName}でのみ使用されます。
                </p>

              </div>

              <DrawerFooter>

                {/* 表示名を変更 */}
                <DrawerClose asChild>
                  <Button
                    onClick={() => {
                      handleChangeDisplayName();
                      setNewDisplayName("");
                    }}
                    disabled={newDisplayName.trim() === ""}
                  >
                    表示名を変更
                  </Button>
                </DrawerClose>

                {/* ユーザーネームに戻す */}
                {displayName && (
                  <DrawerClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDisplayName("");
                        setNewDisplayName("");
                      }}
                    >
                      ユーザーネームに戻す
                    </Button>
                  </DrawerClose>
                )}

                {/* 閉じる */}
                <DrawerClose asChild>
                  <Button variant="outline" 
                    onClick={() => {
                      setNewDisplayName("");
                    }}
                  >
                    閉じる
                  </Button>
                </DrawerClose>

              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* 通知の設定 */}
          <Drawer>
            <DrawerTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between border-t px-6 py-4 text-left transition-colors hover:bg-muted"
              >
                <span className="font-medium">
                  通知の設定
                </span>

                <span className="text-muted-foreground">
                  ＞
                </span>
              </button>
            </DrawerTrigger>

            <DrawerContent className="max-h-[50vh]">
              <DrawerHeader>
                <DrawerTitle>
                  通知の設定
                </DrawerTitle>

                <DrawerDescription>
                  このグループの通知を受け取りますか。
                </DrawerDescription>
              </DrawerHeader>

              <div className="mx-auto w-full max-w-2xl px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  ここに機能を追加します。
                </p>
              </div>

              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">
                    閉じる
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* グループを退会 */}
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between border-t px-6 py-4 text-left transition-colors hover:bg-red-50"
              >
                <span className="font-medium text-red-500">
                  グループを退会
                </span>

                <span className="text-red-500">
                  ＞
                </span>
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  グループを退会しますか？
                </DialogTitle>

                <DialogDescription>
                  「{group.name}」から退会します。
                  この操作を続けてもよろしいですか？
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="gap-2 sm:gap-2">
                <Button variant="destructive">
                  はい
                </Button>
                
                <Button variant="outline">
                  いいえ
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </CardContent>
      </Card>

      {/* グループページへ戻る */}
      <Button
        variant="outline"
        asChild
        className="mt-6"
      >
        <Link href={`/group/${groupId}`}>
          グループページに戻る
        </Link>
      </Button>

    </main>
  );
}