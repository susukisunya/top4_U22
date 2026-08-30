import { Hono } from 'hono'
import { getLoginUserId, unauthorized } from '@/lib/errorHandling'
import {
  MAX_IMAGE_SIZE_BYTES,
  isAllowedImageContentType,
  isS3Configured,
  uploadImageToS3,
} from '@/lib/s3'

// formData の folder の値を保存先フォルダとして解釈する（不正な値は null）
function parseUploadFolder(value: FormDataEntryValue | null): 'users' | 'groups' | null {
  if (value === 'users' || value === 'groups') {
    return value
  }
  return null
}

// POST /api/uploads
// ログインユーザーが選択した画像ファイルを S3 にアップロードし、
// 発行されたURLを返す。返ってきたURLを User.image / Group.iconUrl に保存して使う。
export const uploadsRoute = new Hono()

uploadsRoute.post('/', async (c) => {
  // ログイン中のユーザーIDを取得（未ログインなら401＋診断ログ）
  const userId = await getLoginUserId(c)
  if (!userId) {
    return unauthorized(c)
  }

  try {
    // multipart/form-data を解析する（Next.js の Route Handler でも動くよう標準APIを使う）
    const formData = await c.req.raw.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return c.json(
        { error: 'file フィールドで画像ファイルを送信してください' },
        400
      )
    }

    // 画像形式のチェック
    if (!isAllowedImageContentType(file.type)) {
      return c.json(
        { error: 'JPEG / PNG / WebP / GIF のいずれかの画像を送信してください' },
        415
      )
    }

    // サイズのチェック
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return c.json(
        {
          error: `画像サイズは ${Math.floor(MAX_IMAGE_SIZE_BYTES / (1024 * 1024))}MB 以下にしてください`,
        },
        413
      )
    }

    // 保存先フォルダ（ユーザーのアイコンか、グループのアイコンか）
    const folder = parseUploadFolder(formData.get('folder'))
    if (!folder) {
      return c.json(
        { error: 'folder には users または groups を指定してください' },
        400
      )
    }

    // S3 の設定が無い場合はわかりやすいエラーを返す
    if (!isS3Configured()) {
      return c.json(
        {
          error:
            '画像アップロード機能が設定されていません（AWS_REGION / AWS_BUCKET_NAME を設定してください）',
        },
        503
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const url = await uploadImageToS3({
      folder,
      buffer,
      contentType: file.type,
    })

    return c.json({ url }, 201)
  } catch (error) {
    console.error('画像のアップロードに失敗しました:', error)

    // S3 の権限不足など、原因が特定できる場合は具体的なメッセージを返す
    if (error instanceof Error && error.name === 'AccessDenied') {
      return c.json(
        {
          error:
            'S3 への書き込み権限がありません。IAM ユーザーに s3:PutObject 権限を付与してください',
        },
        500
      )
    }

    return c.json({ error: '画像のアップロードに失敗しました' }, 500)
  }
})