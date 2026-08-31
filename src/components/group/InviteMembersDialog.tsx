"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type InviteMembersDialogProps = {
  // 参加受付用のURL（QRコードにこのURLを埋め込む）
  inviteUrl: string;
};

// グループの「メンバーを招待」ダイアログ。
// 招待URLをQRコード化して表示する。招待されたユーザーは
// QRコード（またはURL）から参加ページにアクセスしてグループに参加できる。
export function InviteMembersDialog({
  inviteUrl,
}: InviteMembersDialogProps) {
  const [copied, setCopied] = useState(false);

  // 招待URLをクリップボードにコピーする
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("招待URLのコピーに失敗しました:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="mb-4 w-full bg-gray-300 py-6 text-base font-semibold text-black shadow-sm hover:bg-gray-200"
        >
          <UserPlus className="mr-2 !h-6 !w-6" />
          メンバーを招待
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            メンバーを招待
          </DialogTitle>

          <DialogDescription>
            以下のQRコードまたは招待URLからグループに参加できます。
          </DialogDescription>
        </DialogHeader>

        {/* QRコード */}
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-sm font-semibold">
            QRコード
          </p>

          <div className="flex h-48 w-48 items-center justify-center rounded-lg border bg-white p-3">
            <QRCodeSVG value={inviteUrl} size={160} />
          </div>

          <p className="text-center text-xs text-muted-foreground">
            招待する相手はこのQRコードを読み取って
            グループに参加できます
          </p>
        </div>

        {/* 招待URL */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">
            招待URL
          </p>

          <div className="flex gap-2">
            <div className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-md border bg-gray-100 px-3 py-2 text-sm">
              {inviteUrl}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "コピーしました" : "コピー"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}