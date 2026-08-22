import { Hono } from 'hono'
import { prisma } from '@/lib/prisma'
import { Param } from '@prisma/client/runtime/library'

// GET /api/users
// ユーザー一覧と、各ユーザーが所属するグループの情報を取得する。
// パスワードはセキュリティのためレスポンスに含めない。
export const usersRoute = new Hono()

usersRoute.get('/', async (c) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        icon: true,
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
        icon: true,
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
// ユーザーを作成する。name / icon / password が必要。
usersRoute.post('/', async (c) => {
  try {
    const body = await c.req.json<{
      name?: string
      icon?: string
      password?: string
    }>()

    if (!body.name || !body.password) {
      return c.json(
        { error: 'name と password は必須です' },
        400
      )
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        icon: body.icon ?? '',
        password: body.password,
      },
      select: {
        id: true,
        name: true,
        icon: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // パスワードをレスポンスに含めない
    return c.json(user, 201)
  } catch (error) {
    console.error('ユーザーの作成に失敗しました:', error)
    return c.json({ error: 'ユーザーの作成に失敗しました' }, 500)
  }
})
