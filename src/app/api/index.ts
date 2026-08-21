import { Hono } from 'hono'
import { usersRoute } from '@/app/api/routes/users'
import { groupsRoute } from '@/app/api/routes/groups'

// ベースパス /api 配下に user / group のエンドポイントをまとめた Hono アプリ。
export const api = new Hono().basePath('/api')

api.route('/users', usersRoute)
api.route('/groups', groupsRoute)
