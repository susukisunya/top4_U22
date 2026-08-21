import { Hono } from 'hono'
import { prisma } from '@/lib/prisma'

// GET /api/groups
// グループの情報と、各グループに所属するメンバー（ユーザー）の情報を取得する。
export const groupsRoute = new Hono()

groupsRoute.get('/', async (c) => {
  try {
    const groups = await prisma.group.findMany({
      select: {
        id: true,
        name: true,
        iconUrl: true,
        createdAt: true,
        members: {
          select: {
            displayName: true,
            lateCount: true,
            joinedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                icon: true,
              },
            },
          },
        },
        events: {
          select: {
            id: true,
            title: true,
            meetingTime: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return c.json(groups)
  } catch (error) {
    console.error('グループ一覧の取得に失敗しました:', error)
    return c.json({ error: 'グループ一覧の取得に失敗しました' }, 500)
  }
})
