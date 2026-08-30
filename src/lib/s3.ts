// AWS S3 へ画像をアップロードするためのユーティリティ。
// 必要な環境変数: AWS_REGION / AWS_BUCKET_NAME /（ローカル実行では AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY）

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'node:crypto'

// 許可する画像の Content-Type と、S3 のキーに使う拡張子の対応
const ALLOWED_CONTENT_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

// アップロードできるファイルサイズの上限（5MB）
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

export function isAllowedImageContentType(contentType: string): boolean {
  return contentType in ALLOWED_CONTENT_TYPES
}

export function getImageExtension(contentType: string): string | undefined {
  return ALLOWED_CONTENT_TYPES[contentType]
}

// S3 の設定（リージョンとバケット）が揃っているかどうか
export function isS3Configured(): boolean {
  return Boolean(process.env.AWS_REGION && process.env.AWS_BUCKET_NAME)
}

// S3Client は使い回す（リクエストごとの生成コストを避ける）
let cachedClient: S3Client | null = null

function getS3Client(): S3Client {
  if (!cachedClient) {
    // 認証情報は AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY の環境変数、
    // または IAM ロールから自動的に解決される
    cachedClient = new S3Client({ region: process.env.AWS_REGION })
  }
  return cachedClient
}

/**
 * 画像を S3 にアップロードし、公開URLを返す。
 *
 * @param folder 保存先のフォルダ（'users' | 'groups'）。キーは `${folder}/${uuid}.${ext}` になる
 * @param buffer 画像ファイルの中身
 * @param contentType 画像の Content-Type（許可リストに含まれるもの）
 * @returns 発行された公開URL（User.image / Group.iconUrl に保存して使う）
 */
export async function uploadImageToS3(params: {
  folder: 'users' | 'groups'
  buffer: Buffer
  contentType: string
}): Promise<string> {
  const region = process.env.AWS_REGION
  const bucket = process.env.AWS_BUCKET_NAME
  if (!region || !bucket) {
    throw new Error(
      'S3 が設定されていません（AWS_REGION / AWS_BUCKET_NAME を設定してください）'
    )
  }

  const extension = getImageExtension(params.contentType)
  if (!extension) {
    throw new Error(`未対応の画像形式です: ${params.contentType}`)
  }

  // 同名衝突を避けるため UUID をキーにする
  const key = `${params.folder}/${randomUUID()}.${extension}`

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: params.buffer,
      ContentType: params.contentType,
    })
  )

  // CloudFront などを前段に置く場合は環境変数 S3_PUBLIC_BASE_URL で差し替えられる
  const baseUrl =
    process.env.S3_PUBLIC_BASE_URL ??
    `https://${bucket}.s3.${region}.amazonaws.com`

  return `${baseUrl}/${key}`
}
