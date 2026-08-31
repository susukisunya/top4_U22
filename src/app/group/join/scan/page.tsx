"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/homepage/Header";
import Footer from "@/components/homepage/Footer";
import { Button } from "@/components/ui/button";

// 読み取った文字列からグループIDを取り出す。
// 招待QRコードには「{NEXT_PUBLIC_APP_URL}/group/join/<groupId>」が入っている。
function extractGroupId(decodedText: string): string | null {
  const match = decodedText.match(/\/group\/join\/([^/?#\s]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// 招待QRコードをカメラで読み取ってグループに参加するページ。
export default function ScanJoinPage() {
  const router = useRouter();
  // カメラの停止処理だけ保持する（html5-qrcodeは動的importで取り込む）
  const scannerRef = useRef<{ stop: () => Promise<void> } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    // 読み取り成功時にgroupIdを抽出して参加ページへ遷移する
    const applyGroupId = (decodedText: string) => {
      const groupId = extractGroupId(decodedText);

      if (!groupId) {
        setError("このQRコードはグループ招待用ではありません");
        return;
      }

      // カメラを止めてから参加ページへ移動する
      const scanner = scannerRef.current;
      scannerRef.current = null;
      if (scanner) {
        scanner.stop().catch(() => {});
      }

      if (!cancelled) {
        router.replace(`/group/join/${groupId}`);
      }
    };

    // カメラを起動してQRコードの読み取りを開始する
    (async () => {
      try {
        // ブラウザ専用ライブラリのため、マウント後に動的importする
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) {
          return;
        }

        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => applyGroupId(decodedText),
          () => {}
        );
      } catch (err) {
        if (!cancelled) {
          console.error("カメラの起動に失敗しました:", err);
          setError(
            "カメラを起動できませんでした。カメラの使用を許可してからお試しください。"
          );
        }
      }
    })();

    // アンマウント時にカメラを停止する
    return () => {
      cancelled = true;
      const scanner = scannerRef.current;
      scannerRef.current = null;
      if (scanner) {
        scanner.stop().catch(() => {});
      }
    };
  }, [router]);

  return (
    <main className="mx-auto w-full max-w-2xl p-6 pt-20 pb-20">
      <Header />

      <h1 className="mb-2 text-2xl font-bold">
        QRコードでグループに参加
      </h1>

      <p className="mb-4 text-sm text-muted-foreground">
        招待されたQRコードをカメラに写すと、グループに参加できます。
      </p>

      {/* QRリーダー */}
      <div className="mb-4 flex justify-center">
        <div
          id="qr-reader"
          className="w-full max-w-sm overflow-hidden rounded-lg border bg-gray-100"
        />
      </div>

      {error && (
        <p className="mb-4 text-center text-sm text-red-500">
          {error}
        </p>
      )}

      <Button variant="outline" asChild className="mt-4">
        <Link href="/group">
          グループ一覧に戻る
        </Link>
      </Button>

      <Footer />
    </main>
  );
}