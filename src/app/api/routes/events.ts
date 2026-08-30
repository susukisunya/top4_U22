import { Hono } from 'hono'
import { prisma } from '@/lib/prisma'
import { getLoginUserId, unauthorized } from '@/lib/errorHandling'

// GET /api/events
// ログイン中ユーザーが参加するイベントの情報と、各イベントの参加メンバーを取得する。
export const eventsRoute = new Hono()

eventsRoute.get('/', async (c) => {
  // ログイン中のユーザーIDを取得（未ログインなら401＋診断ログ）
  const userId = await getLoginUserId(c)
  if (!userId) {
    return unauthorized(c)
  }

  try {
    const events = await prisma.event.findMany({
      where: {
        // ログイン中ユーザーが参加するイベントだけを返す
        members: { some: { userId } },
      },
      select: {
        id: true,
        groupId: true,
        title: true,
        description: true,
        meetingTime: true,
        createdAt: true,
        updatedAt: true,
        destinationId: true,
        destination: {
          select: {
            id: true,
            name: true,
            address: true,
            latitude: true,
            longitude: true,
            placeId: true,
          },
        },
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
// ログイン中ユーザーが参加する（またはグループに所属している）イベント詳細を取得する。
eventsRoute.get('/:id', async (c) => {
  // ログイン中のユーザーIDを取得（未ログインなら401＋診断ログ）
  const userId = await getLoginUserId(c)
  if (!userId) {
    return unauthorized(c)
  }

  try {
    const id = c.req.param('id')

    // ログイン中ユーザーがこのイベントに参加しているか確認する
    const participation = await prisma.eventMember.findUnique({
      where: {
        userId_eventId: { userId, eventId: id },
      },
      select: { userId: true },
    })

    // 参加していないイベントは開けない（存在を隠すため404を返す）
    if (!participation) {
      return c.json({ error: 'イベントが見つかりません' }, 404)
    }

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
        destinationId: true,
        destination: {
          select: {
            id: true,
            name: true,
            address: true,
            latitude: true,
            longitude: true,
            placeId: true,
          },
        },
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
            arrivedAt: true,
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

// POST /api/events/:id/arrival
// ログイン中ユーザーの到着を報告する。
// サーバー時刻がイベントの集合時間より後なら「遅刻」として記録し、
// グループメンバーの lateCount を 1 増やす（再報告でも二重加算されない）。
eventsRoute.post('/:id/arrival', async (c) => {
  // ログイン中のユーザーIDを取得（未ログインなら401＋診断ログ）
  const userId = await getLoginUserId(c)
  if (!userId) {
    return unauthorized(c)
  }

  try {
    const id = c.req.param('id')

    // イベント（集合時間・グループ）と自分の参加記録を取得する
    const event = await prisma.event.findUnique({
      where: { id },
      select: { id: true, groupId: true, meetingTime: true },
    })
    if (!event) {
      return c.json({ error: 'イベントが見つかりません' }, 404)
    }

    const eventMember = await prisma.eventMember.findUnique({
      where: { userId_eventId: { userId, eventId: id } },
      select: { arrivedAt: true },
    })
    // イベント参加者以外は報告できない（存在を隠すため404）
    if (!eventMember) {
      return c.json({ error: 'イベントが見つかりません' }, 404)
    }

    const now = new Date()
    const isLate = now.getTime() > event.meetingTime.getTime()

    // 到着を記録する。arrivedAt が未設定のときだけ更新されるため、
    // 再報告や同時報告があっても遅刻回数が二重に増えることはない。
    const reportResult = await prisma.$transaction(async (tx) => {
      const updated = await tx.eventMember.updateMany({
        where: { userId, eventId: id, arrivedAt: null },
        data: { arrivedAt: now },
      })

      if (updated.count === 0) {
        return { alreadyReported: true as const }
      }

      // 遅刻ならグループの遅刻回数を1増やす
      // （GroupMember レコードが無くてもエラーにしないよう updateMany を使う）
      if (isLate) {
        await tx.groupMember.updateMany({
          where: { userId, groupId: event.groupId },
          data: { lateCount: { increment: 1 } },
        })
      }

      return { alreadyReported: false as const }
    })

    // 応答用に報告後の最新状態を取得する
    const [member, groupMember] = await Promise.all([
      prisma.eventMember.findUnique({
        where: { userId_eventId: { userId, eventId: id } },
        select: { arrivedAt: true },
      }),
      prisma.groupMember.findUnique({
        where: { userId_groupId: { userId, groupId: event.groupId } },
        select: { lateCount: true },
      }),
    ])

    const reportedAt = member?.arrivedAt ?? null

    return c.json({
      alreadyReported: reportResult.alreadyReported,
      arrivedAt: reportedAt,
      isLate:
        reportedAt !== null
          ? reportedAt.getTime() > event.meetingTime.getTime()
          : isLate,
      lateCount: groupMember?.lateCount ?? null,
    })
  } catch (error) {
    console.error('到着報告の処理に失敗しました:', error)
    return c.json({ error: '到着報告の処理に失敗しました' }, 500)
  }
})

// POST /api/events
// イベントを作成する。groupId / title / meetingTime が必要。
// 任意で destination（目的地情報）と memberIds（参加メンバー）も同時に保存する。
// イベント作成者（ログイン中ユーザー）は自動的に参加メンバーとして登録される。
eventsRoute.post('/', async (c) => {
  // ログイン中のユーザーIDを取得（未ログインなら401＋診断ログ）
  const loginUserId = await getLoginUserId(c)
  if (!loginUserId) {
    return unauthorized(c)
  }

  try {
    const body = await c.req.json<{
      groupId?: string
      title?: string
      description?: string
      meetingTime?: string
      destination?: {
        name?: string
        address?: string | null
        latitude?: number | string
        longitude?: number | string
        placeId?: string | null
      } | null
      memberIds?: string[]
    }>()

    // 必須チェック（クロージャ内で型を保持できるようローカル変数に取り出す）
    const groupId = body.groupId
    const title = body.title
    const meetingTime = body.meetingTime
    if (!groupId || !title || !meetingTime) {
      return c.json(
        { error: 'groupId と title と meetingTime は必須です' },
        400
      )
    }

    // Event / Destination / EventMember をまとめて保存する
    const event = await prisma.$transaction(async (tx) => {
      // 1. 目的地が指定されていれば Destination を作成して Event に紐付ける
      let destinationId: string | null = null
      const dest = body.destination
      if (
        dest &&
        dest.name &&
        dest.latitude !== undefined &&
        dest.longitude !== undefined
      ) {
        const created = await tx.destination.create({
          data: {
            name: dest.name,
            address: dest.address ?? null,
            latitude: Number(dest.latitude),
            longitude: Number(dest.longitude),
            placeId: dest.placeId ?? null,
          },
        })
        destinationId = created.id
      }

      // 2. イベントを作成
      const event = await tx.event.create({
        data: {
          groupId,
          title,
          description: body.description ?? null,
          meetingTime: new Date(meetingTime),
          destinationId,
        },
        select: {
          id: true,
          groupId: true,
          title: true,
          description: true,
          meetingTime: true,
          destinationId: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      // 3. 参加メンバーを EventMember として登録
      //    重複を除き、イベント作成者（ログイン中ユーザー）は常に参加者にする
      const memberIds = Array.from(
        new Set([...body.memberIds ?? [], loginUserId])
      ).filter((id) => typeof id === 'string' && id.length > 0)

      if (memberIds.length > 0) {
        await tx.eventMember.createMany({
          data: memberIds.map((userId) => ({
            eventId: event.id,
            userId,
          })),
        })
      }

      return event
    })

    return c.json(event, 201)
  } catch (error) {
    console.error('イベントの作成に失敗しました:', error)
    return c.json({ error: 'イベントの作成に失敗しました' }, 500)
  }
})