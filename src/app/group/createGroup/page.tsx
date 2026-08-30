//グループ作成
"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/upload-image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import Header from "@/components/homepage/Header";
import Footer from "@/components/homepage/Footer";

export default function CreateGroupPage() {
  const [groupName, setGroupName] = useState("");
  // プレビュー表示用のURL（選択直後はローカルのオブジェクトURL）
  const [iconUrl, setIconUrl] = useState("");
  // S3 にアップロードして発行されたURL（グループ作成時に Group.iconUrl として保存する）
  const [uploadedIconUrl, setUploadedIconUrl] = useState("");
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // アイコン画像を選択したら S3 にアップロードし、発行されたURLを保持する
  const handleIconChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // 選択した画像をプレビューする
    const previewObjectUrl = URL.createObjectURL(file);
    setIconUrl(previewObjectUrl);

    setIsUploadingIcon(true);
    setUploadError(null);
    try {
      const url = await uploadImage(file, "groups");
      setUploadedIconUrl(url);
      setIconUrl(url);
      URL.revokeObjectURL(previewObjectUrl);
    } catch (error) {
      console.error("アイコンのアップロードに失敗しました:", error);
      setUploadError(
        error instanceof Error
          ? error.message
          : "アイコンのアップロードに失敗しました"
      );
      // 失敗したらプレビューを取り下げる
      setIconUrl("");
      URL.revokeObjectURL(previewObjectUrl);
    } finally {
      setIsUploadingIcon(false);
    }
  };

  // グループ作成
  const handleCreate = async () => {
    if (!groupName.trim()) {
      return;
    }

    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: groupName.trim(),
          iconUrl: uploadedIconUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("グループの作成に失敗しました");
      }

      const createdGroup = await response.json();

      console.log("作成されたグループ:", createdGroup);

      // グループ一覧へ戻る
      window.location.href = "/group";
    } catch (error) {
      console.error(error);
      alert("グループの作成に失敗しました");
    }
  };

  return (
    <main className="mx-auto w-full max-w-2xl p-6 pt-20 pb-20">
      <Header />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            グループを作成
          </CardTitle>
        </CardHeader>

        <CardContent>
					{/* アイコン + グループ名 */}
  				<div className="mb-6 flex items-center gap-6">
						{/* グループアイコン */}
						<div className="flex shrink-0 flex-col items-center">
							<Avatar className="mb-3 h-24 w-24">
								<AvatarImage src={iconUrl} />

								<AvatarFallback className="text-2xl">
									{groupName
										? groupName.slice(0, 2)
										: "G"}
								</AvatarFallback>
							</Avatar>

							<label
								htmlFor="group-icon"
								className="cursor-pointer"
							>
								<Button
									type="button"
									variant="outline"
									asChild
								>
									<span>アイコンを選択</span>
								</Button>
							</label>

							<input
								id="group-icon"
								type="file"
								accept="image/jpeg,image/png,image/webp,image/gif"
								onChange={handleIconChange}
								className="hidden"
							/>
						</div>

						{/* グループ名 */}
						<div className="min-w-0 flex-1">
							<h2 className="mb-2 text-lg font-semibold">
								グループ名
							</h2>

							<Input
								value={groupName}
								onChange={(event) =>
									setGroupName(event.target.value)
								}
								placeholder="グループ名を入力"
							/>
						</div>
					</div>

          {/* 作成ボタン */}
          <Button
            className="w-full"
            onClick={handleCreate}
            disabled={!groupName.trim() || isUploadingIcon}
          >
            {isUploadingIcon
              ? "アイコンをアップロード中..."
              : "グループを作成"}
          </Button>

          {uploadError && (
            <p className="mt-2 text-center text-sm text-red-500">
              {uploadError}
            </p>
          )}
        </CardContent>
      </Card>

      {/* 戻る */}
      <Button
        variant="outline"
        asChild
        className="mt-4"
      >
        <Link href="/group">
          グループ一覧に戻る
        </Link>
      </Button>
      <Footer/>
    </main>
  );
}