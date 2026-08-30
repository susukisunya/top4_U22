import type { Context } from 'hono'
import { auth } from '@/lib/auth'

// Auth.js (NextAuth v5) のセッションクッキー名。
// 開発(HTTP)では通常名、本番(HTTPS)では __Secure- プレフィックスが付く。
const SESSION_COOKIE_PATTERN = /(?:^|;\s*)(__Secure-)?authjs\.session-token=/

// Hono API のエラーハンドリング用ヘルパー。
// 401 (未認証) のレスポンス形式を全 API で統一し、認証まわりのトラブルを
// サーバーログで切り分けられるようにする。

/**
 * Hono ルート用ヘルパー: ログイン中ユーザーのIDを取得する。
 *
 * セッションを解決できなかった場合は、原因の切り分けに役立つ診断ログを
 * サーバーログに出力して null を返す。
 * - セッションCookieが無い → ブラウザから送られていない or サーバーからの内部fetchで未転送
 * - セッションCookieはある → AUTH_SECRETの不一致 / DB上のセッションの欠損・失効 / Cookie属性の不整合 など
 */
export async function getLoginUserId(c: Context): Promise<string | null> {
  let session = null
  try {
    session = await auth()
  } catch (error) {
    // AUTH_SECRET 未設定などはここで例外になる
    console.error('[api-error-handling] セッションの取得中に例外が発生しました:', error)
    return null
  }

  const userId = session?.user?.id
  if (typeof userId === 'string' && userId) {
    return userId
  }

  // ここに到達した = リクエストからセッションを解決できなかった
  const cookieHeader = c.req.raw.headers.get('cookie') ?? ''
  const cookieNames = cookieHeader
    .split(';')
    .map((part) => part.split('=')[0]?.trim())
    .filter((name): name is string => Boolean(name))
  const hasSessionCookie = SESSION_COOKIE_PATTERN.test(cookieHeader)

  if (hasSessionCookie) {
    console.warn(
      `[api-error-handling] セッションCookieは存在するが auth() がセッションを返しませんでした (path: ${c.req.path}, cookies: [${cookieNames.join(', ')}])。` +
        '考えられる原因: AUTH_SECRET の不一致 / DB上のセッションレコードの欠損・失効 / Cookie属性(secure/domain)の不整合'
    )
  } else {
    console.warn(
      `[api-error-handling] リクエストにセッションCookieがありません (path: ${c.req.path}, cookies: [${cookieNames.join(', ') || 'なし'}])。` +
        'サーバーコンポーネントから内部APIをfetchする場合は headers() で cookie を転送すること'
    )
  }

  return null
}

/**
 * Hono ルート用ヘルパー: 401 (未認証) レスポンスを返す。
 * レスポンスの形を全APIで統一し、クライアント側でエラー種別を判別できるようにする。
 */
export function unauthorized(c: Context) {
  return c.json({ error: 'ログインしてください', code: 'UNAUTHENTICATED' }, 401)
}
