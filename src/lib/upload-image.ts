// 画像ファイルを /api/uploads へアップロードし、S3で発行されたURLを返すクライアント用ヘルパー。

export async function uploadImage(
  file: File,
  folder: 'users' | 'groups'
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/uploads", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(
      body?.error ?? `画像のアップロードに失敗しました (${res.status})`
    );
  }

  const data = (await res.json()) as { url: string };
  return data.url;
}