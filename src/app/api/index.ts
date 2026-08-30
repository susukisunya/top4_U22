import { Hono } from 'hono'
import { usersRoute } from '@/app/api/routes/users'
import { groupsRoute } from '@/app/api/routes/groups'
import { eventsRoute } from '@/app/api/routes/events'
import { destinationsRoute } from './routes/destinations'
import { uploadsRoute } from './routes/uploads'

// ベースパス /api 配下に user / group / event のエンドポイントをまとめた Hono アプリ。
export const api = new Hono().basePath('/api')

api.route('/users', usersRoute)
api.route('/groups', groupsRoute)
api.route('/events', eventsRoute)
api.route('/destinations', destinationsRoute)
api.route('/uploads', uploadsRoute)

// どのルートでも捕捉されなかった例外を 500 の JSON レスポンスに変換する。
// これがないと Hono 内で throw された場合に HTML のエラーページや生のテキストが返る。
api.onError((error, c) => {
  console.error(
    `[api] 未処理の例外が発生しました (${c.req.method} ${c.req.path}):`,
    error
  )
  return c.json(
    { error: 'サーバーでエラーが発生しました', code: 'INTERNAL_ERROR' },
    500
  )
})
