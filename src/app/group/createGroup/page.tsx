//グループ作成
"use client";

import { useState } from "react";
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
  const [iconUrl, setIconUrl] = useState("");

  // アイコン画像を選択
  const handleIconChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // 選択した画像をプレビューする
    const imageUrl = URL.createObjectURL(file);
    setIconUrl(imageUrl);
  };

  // グループ作成
  const handleCreate = () => {
    console.log("グループ名:", groupName);
    console.log("アイコン:", iconUrl);

    // 後でAPIに送信する
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
								accept="image/*"
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
            disabled={!groupName.trim()}
          >
            グループを作成
          </Button>
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