import { Hono } from 'hono'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/groups
// ログイン中ユーザーが所属するグループと、各グループのメンバー情報を取得する。
export const groupsRoute = new Hono()

groupsRoute.get('/', async (c) => {
  // ログイン中のユーザーIDを取得（未ログインなら401）
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return c.json({ error: 'ログインしてください' }, 401)
  }

  try {
    const groups = await prisma.group.findMany({
      where: {
        // ログイン中ユーザーがメンバーとして所属するグループだけを返す
        members: { some: { userId } },
      },
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
// ログイン中ユーザーが所属するグループ単体の情報と、メンバー・イベント情報を取得する。
groupsRoute.get('/:id', async (c) => {
  // ログイン中のユーザーIDを取得（未ログインなら401）
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return c.json({ error: 'ログインしてください' }, 401)
  }

  try {
    const id = c.req.param('id')

    // ログイン中ユーザーがこのグループに所属しているか確認する
    const membership = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: { userId, groupId: id },
      },
      select: { userId: true },
    })

    // 所属していないグループは開けない（存在を隠すため404を返す）
    if (!membership) {
      return c.json({ error: 'グループが見つかりません' }, 404)
    }

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
// グループを作成し、作成者がそのグループのメンバーとして登録される。
groupsRoute.post('/', async (c) => {
  // ログイン中のユーザーIDを取得（未ログインなら401）
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return c.json({ error: 'ログインしてください' }, 401)
  }

  try {
    const body = await c.req.json<{
      name?: string
      iconUrl?: string
    }>()

    // 必須チェック（クロージャ内で型を保持できるようローカル変数に取り出す）
    const name = body.name
    if (!name) {
      return c.json({ error: 'name は必須です' }, 400)
    }

    // グループの作成と、作成者をメンバーとして登録する
    const group = await prisma.$transaction(async (tx) => {
      const created = await tx.group.create({
        data: {
          name,
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

      // 作成者はグループのメンバーとして自動登録する
      await tx.groupMember.create({
        data: {
          groupId: created.id,
          userId,
        },
      })

      return created
    })

    return c.json(group, 201)
  } catch (error) {
    console.error('グループの作成に失敗しました:', error)
    return c.json({ error: 'グループの作成に失敗しました' }, 500)
  }
})
