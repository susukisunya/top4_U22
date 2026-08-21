import { handle } from 'hono/vercel'
import { api } from '@/app/api/index'

// Hono アプリを Next.js App Router の Route Handler として公開する。
// すべての HTTP メソッドを Hono の handle に委譲する。
export const GET = handle(api)
export const POST = handle(api)
export const PUT = handle(api)
export const PATCH = handle(api)
export const DELETE = handle(api)
export const OPTIONS = handle(api)
