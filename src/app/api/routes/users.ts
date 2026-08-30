import { Hono } from 'hono'
import { prisma } from '@/lib/prisma'
import { getLoginUserId, unauthorized } from '@/lib/errorHandling'

// GET /api/users
// ユーザー一覧と、各ユーザーが所属するグループの情報を取得する。
export const usersRoute = new Hono()

// GET /api/users/me
// ログイン中ユーザーの情報を取得する（未ログインなら401）。
usersRoute.get('/me', async (c) => {
  const userId = await getLoginUserId(c)
  if (!userId) {
    return unauthorized(c)
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return c.json({ error: 'ユーザが見つかりません' }, 404)
    }

    return c.json(user)
  } catch (error) {
    console.error('ログインユーザ情報の取得に失敗しました:', error)
    return c.json({ error: 'ログインユーザ情報の取得に失敗しました' }, 500)
  }
})

// PUT /api/users/me
// ログイン中ユーザーのプロフィール（ユーザーネーム・アイコン）を更新する。
// 初回登録画面（/auth/profile）からの登録・保存はこのエンドポイントで行う。
usersRoute.put('/me', async (c) => {
  const userId = await getLoginUserId(c)
  if (!userId) {
    return unauthorized(c)
  }

  try {
    const body = await c.req.json<{
      name?: string
      icon?: string
    }>()

    const name = body.name?.trim()
    if (!name) {
      return c.json({ error: 'name は必須です' }, 400)
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        image: body.icon ?? null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return c.json(user)
  } catch (error) {
    console.error('ユーザー情報の更新に失敗しました:', error)
    return c.json({ error: 'ユーザー情報の更新に失敗しました' }, 500)
  }
})

usersRoute.get('/', async (c) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        groupMembers: {
          select: {
            displayName: true,
            lateCount: true,
            joinedAt: true,
            group: {
              select: {
                id: true,
                name: true,
                iconUrl: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return c.json(users)
  } catch (error) {
    console.error('ユーザー一覧の取得に失敗しました:', error)
    return c.json({ error: 'ユーザー一覧の取得に失敗しました' }, 500)
  }
})
//特定のユーザの情報を取得するapi
usersRoute.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    const users = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        groupMembers: {
          select: {
            displayName: true,
            lateCount: true,
            joinedAt: true,
            group: {
              select: {
                id: true,
                name: true,
                iconUrl: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    })

    return c.json(users)
  } catch (error) {
    console.error('ユーザ情報の取得に失敗しました:', error)
    return c.json({ error: 'ユーザ情報の取得に失敗しました' }, 500)
  }
})
// POST /api/users
// ユーザーを作成する。通常のユーザー登録はGoogleログイン時に自動作成されるため、
// このエンドポイントは主にテスト・管理用。name / email が必要。
usersRoute.post('/', async (c) => {
  try {
    const body = await c.req.json<{
      name?: string
      email?: string
      icon?: string
    }>()

    if (!body.name || !body.email) {
      return c.json(
        { error: 'name と email は必須です' },
        400
      )
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        image: body.icon ?? null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return c.json(user, 201)
  } catch (error) {
    console.error('ユーザーの作成に失敗しました:', error)
    return c.json({ error: 'ユーザーの作成に失敗しました' }, 500)
  }
})
