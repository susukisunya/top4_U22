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
        updatedAt: true,
        members: {
          select: {
            displayName: true,
            lateCount: true,
            joinedAt: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
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

// GET /api/groups/:id
// グループ単体の情報と、所属メンバー数・イベント情報を取得する。
groupsRoute.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    const group = await prisma.group.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        iconUrl: true,
        createdAt: true,
        updatedAt: true,
        // メンバー数を _count で取得する
        _count: {
          select: {
            members: true,
          },
        },
        members: {
          select: {
            userId: true,
            displayName: true,
            lateCount: true,
            joinedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { lateCount: 'asc' },
        },
        events: {
          select: {
            id: true,
            title: true,
            meetingTime: true,
          },
        },
      },
    })

    if (!group) {
      return c.json({ error: 'グループが見つかりません' }, 404)
    }

    return c.json(group)
  } catch (error) {
    console.error('グループの取得に失敗しました:', error)
    return c.json({ error: 'グループの取得に失敗しました' }, 500)
  }
})

// GET /api/groups/:id/members
// グループに所属するメンバー（ユーザー）の情報を遅刻回数が少ない順で取得する。
groupsRoute.get('/:id/members', async (c) => {
  try {
    const id = c.req.param('id')

    const members = await prisma.groupMember.findMany({
      where: { groupId: id },
      select: {
        userId: true,
        displayName: true,
        lateCount: true,
        joinedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { lateCount: 'asc' },
    })

    return c.json(members)
  } catch (error) {
    console.error('グループメンバーの取得に失敗しました:', error)
    return c.json({ error: 'グループメンバーの取得に失敗しました' }, 500)
  }
})

// POST /api/groups
// グループを作成する。name / iconUrl が必要。
groupsRoute.post('/', async (c) => {
  try {
    const body = await c.req.json<{
      name?: string
      iconUrl?: string
    }>()

    if (!body.name) {
      return c.json({ error: 'name は必須です' }, 400)
    }

    const group = await prisma.group.create({
      data: {
        name: body.name,
        iconUrl: body.iconUrl ?? '',
      },
      select: {
        id: true,
        name: true,
        iconUrl: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            members: true,
          },
        },
      },
    })

    return c.json(group, 201)
  } catch (error) {
    console.error('グループの作成に失敗しました:', error)
    return c.json({ error: 'グループの作成に失敗しました' }, 500)
  }
})
