import { Hono } from 'hono'
import { prisma } from '@/lib/prisma'

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
        // スキーマ上のフィールド名は createAt / updateAt（Group の createdAt とは名前が異なる点に注意）
        createAt: true,
        updateAt: true,
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
              },
            },
          },
        },
      },
      orderBy: { createAt: 'desc' },
    })

    return c.json(users)
  } catch (error) {
    console.error('ユーザー一覧の取得に失敗しました:', error)
    return c.json({ error: 'ユーザー一覧の取得に失敗しました' }, 500)
  }
})
