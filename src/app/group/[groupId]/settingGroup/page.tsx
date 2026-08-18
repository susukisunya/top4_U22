"use client";

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

type Group = {
  id: string;
  name: string;
  iconUrl?: string;
};

type Props = {
  params: Promise<{
    groupId: string;
  }>;
};

const group: Group = {
  id: "group-1",
  name: "情報工学科A班",
  iconUrl: "",
};

const memberCount = 5;

export default async function SettingGroupPage({ params }: Props) {
  const { groupId } = await params;

  return (
    <main className="mx-auto w-full max-w-2xl p-6">

      {/* グループ情報 */}
      <div className="mb-8 flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={group.iconUrl} />
          <AvatarFallback className="text-xl">
            {group.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div>
          <h1 className="text-3xl font-bold">
            {group.name}
          </h1>

          <p className="text-muted-foreground">
            メンバー {memberCount}人
          </p>
        </div>
      </div>

      {/* グループ設定 */}
      <Card>
        <CardHeader>
          <CardTitle>
            グループ設定
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">

          {/* メンバーの招待 */}
          <Drawer>
            <DrawerTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between border-t px-6 py-4 text-left transition-colors hover:bg-muted"
              >
                <span className="font-medium">
                  メンバーの招待
                </span>

                <span className="text-muted-foreground">
                  ＞
                </span>
              </button>
            </DrawerTrigger>

            <DrawerContent className="max-h-[50vh]">
              <DrawerHeader>
                <DrawerTitle>
                  メンバーの招待
                </DrawerTitle>

                <DrawerDescription>
                  グループに参加するメンバーを招待します。
                </DrawerDescription>
              </DrawerHeader>

              <div className="mx-auto w-full max-w-2xl px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  ここに招待機能を追加します。
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
                  グループ名を変更します。
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
                  グループ内で表示する名前を設定します。
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