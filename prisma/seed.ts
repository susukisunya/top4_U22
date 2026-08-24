import { PrismaClient } from '../src/generated/prisma/client';
import { fakerJA as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    // 既存データのクリーンアップ（外部キー制約に配慮した順序）
    await prisma.eventMember.deleteMany();
    await prisma.event.deleteMany();
    await prisma.destination.deleteMany();
    await prisma.groupMember.deleteMany();
    await prisma.group.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();

    // 1. ダミーユーザーの作成 (10人)
    const users = await Promise.all(
        Array.from({ length: 10 }).map((_, i) =>
            prisma.user.create({
                data: {
                    name: faker.person.fullName(),
                    email: `user${i + 1}@example.com`,
                    emailVerified: faker.helpers.maybe(() => faker.date.past(), { probability: 0.5 }),
                    image: faker.image.avatarGitHub(),
                },
            })
        )
    );

    // 2. ダミーグループの作成 (3グループ)
    const groups = await Promise.all(
        Array.from({ length: 3 }).map(() =>
            prisma.group.create({
                data: {
                    name: `${faker.company.name()} コミュニティ`,
                    iconUrl: faker.image.url(),
                },
            })
        )
    );

    // 3. 各グループにメンバーとイベントを紐付け
    for (const group of groups) {
        // ランダムに3〜6名のユーザーをグループに追加
        const shuffledUsers = faker.helpers.shuffle(users);
        const assignedUsers = shuffledUsers.slice(0, faker.number.int({ min: 3, max: 6 }));

        for (const user of assignedUsers) {
            await prisma.groupMember.create({
                data: {
                    userId: user.id,
                    groupId: group.id,
                    lateCount: faker.number.int({ min: 0, max: 5 }),
                    displayName: faker.helpers.maybe(() => faker.person.middleName(), { probability: 0.3 }),
                    joinedAt: faker.date.past({ years: 1 }),
                },
            });
        }

        // 各グループに 2 つのイベントを作成
        for (let i = 0; i < 2; i++) {
            const meetingTime = faker.date.soon({ days: 30 });

            // Event と一対一で紐づく Destination を作成
            const destination = await prisma.destination.create({
                data: {
                    name: `${faker.location.city()} ${faker.word.noun()} カフェ`,
                    address: faker.location.streetAddress(),
                    latitude: faker.location.latitude(),
                    longitude: faker.location.longitude(),
                    placeId: faker.helpers.maybe(() => faker.string.alphanumeric({ length: 12 }), {
                        probability: 0.8,
                    }),
                },
            });

            const event = await prisma.event.create({
                data: {
                    groupId: group.id,
                    title: `${faker.word.noun()} 勉強会`,
                    description: faker.lorem.paragraph(),
                    meetingTime,
                    destinationId: destination.id,
                },
            });

            // グループ内メンバーをイベントメンバーとして登録
            for (const user of assignedUsers) {
                const isAttending = faker.datatype.boolean({ probability: 0.8 });
                await prisma.eventMember.create({
                    data: {
                        userId: user.id,
                        eventId: event.id,
                        isAttending: isAttending,
                        // 参加者かつ一部の人のみ個別集合時間を設定
                        meetingTime: isAttending && faker.datatype.boolean({ probability: 0.3 })
                            ? faker.date.recent({ days: 1, refDate: meetingTime })
                            : null,
                    },
                });
            }
        }
    }

    // シード結果のサマリー
    const [userCount, groupCount, eventCount, destinationCount, eventMemberCount] = await Promise.all([
        prisma.user.count(),
        prisma.group.count(),
        prisma.event.count(),
        prisma.destination.count(),
        prisma.eventMember.count(),
    ]);
    console.log(
        `Seeded: ${userCount} users, ${groupCount} groups, ${eventCount} events, ${destinationCount} destinations, ${eventMemberCount} event members`
    );
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });