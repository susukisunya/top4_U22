import { Hono } from 'hono'
import { prisma } from '@/lib/prisma'

export const destinationsRoute = new Hono()

destinationsRoute.get('/', async (c) => {
  try {
    const destinations = await prisma.destination.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return c.json({ success: true, data: destinations });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return c.json(
      { success: false, error: '目的地の取得に失敗しました' },
      { status: 500 }
    );
  }
})

destinationsRoute.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { name, address, latitude, longitude, placeId } = body;

    if (!name || latitude === undefined || longitude === undefined) {
      return c.json(
        { success: false, error: '必須項目(name, latitude, longitude)が不足しています' },
        { status: 400 }
      );
    }

    const newDestination = await prisma.destination.create({
      data: {
        name,
        address: address || null,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        placeId: placeId || null,
      },
    });

    return c.json({ success: true, data: newDestination }, { status: 201 });
  } catch (error) {
    console.error('Error saving destination:', error);
    return c.json(
      { success: false, error: '目的地の保存に失敗しました' },
      { status: 500 }
    );
  }
})