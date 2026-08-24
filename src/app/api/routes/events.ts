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
                image: true,
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
                image: true,
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

// POST /api/events
// イベントを作成する。groupId / title / meetingTime が必要。
eventsRoute.post('/', async (c) => {
  try {
    const body = await c.req.json<{
      groupId?: string
      title?: string
      description?: string
      meetingTime?: string
    }>()

    if (!body.groupId || !body.title || !body.meetingTime) {
      return c.json(
        { error: 'groupId と title と meetingTime は必須です' },
        400
      )
    }

    const event = await prisma.event.create({
      data: {
        groupId: body.groupId,
        title: body.title,
        description: body.description ?? null,
        meetingTime: new Date(body.meetingTime),
      },
      select: {
        id: true,
        groupId: true,
        title: true,
        description: true,
        meetingTime: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return c.json(event, 201)
  } catch (error) {
    console.error('イベントの作成に失敗しました:', error)
    return c.json({ error: 'イベントの作成に失敗しました' }, 500)
  }
})