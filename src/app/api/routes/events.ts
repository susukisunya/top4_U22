import { Hono } from 'hono'
import { prisma } from '@/lib/prisma'

// GET /api/events
// イベントの情報と、各イベントに参加するメンバー（ユーザー）の情報を取得する。
export const eventsRoute = new Hono()

eventsRoute.get('/', async (c) => {
  try {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        groupId: true,
        title: true,
        description: true,
        location: true,
        meetingTime: true,
        createdAt: true,
        updatedAt: true,
        group: {
          select: {
            id: true,
            name: true,
            iconUrl: true,
          },
        },
        members: {
          select: {
            userId: true,
            isAttending: true,
            meetingTime: true,
            user: {
              select: {
                id: true,
                name: true,
                icon: true,
              },
            },
          },
        },
      },
      orderBy: { meetingTime: 'asc' },
    })

    return c.json(events)
  } catch (error) {
    console.error('イベント一覧の取得に失敗しました:', error)
    return c.json({ error: 'イベント一覧の取得に失敗しました' }, 500)
  }
})

// GET /api/events/:id
// イベント単体の詳細情報と、参加メンバー（ユーザー）の情報を取得する。
eventsRoute.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    const event = await prisma.event.findUnique({
      where: { id },
      select: {
        id: true,
        groupId: true,
        title: true,
        description: true,
        location: true,
        meetingTime: true,
        createdAt: true,
        updatedAt: true,
        group: {
          select: {
            id: true,
            name: true,
            iconUrl: true,
          },
        },
        members: {
          select: {
            userId: true,
            isAttending: true,
            meetingTime: true,
            user: {
              select: {
                id: true,
                name: true,
                icon: true,
              },
            },
          },
        },
      },
    })

    if (!event) {
      return c.json({ error: 'イベントが見つかりません' }, 404)
    }

    return c.json(event)
  } catch (error) {
    console.error('イベントの取得に失敗しました:', error)
    return c.json({ error: 'イベントの取得に失敗しました' }, 500)
  }
})