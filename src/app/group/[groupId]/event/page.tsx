import { MemberCard, MemberStatus } from '@/components/card/memberCard'
import { MissionCard } from '@/components/card/missionCard'
import { MapCard } from '@/components/card/mapCard'
import { RouteDeadlineCard } from '@/components/card/routeDeadlineCard'
import { ArrivalReportCard } from '@/components/card/ArrivalReportCard'

interface Member {
  id: string
  name: string
  avatarUrl: string
  fallbackText: string
  status: MemberStatus
}

const membersData: Member[] = [
  {
    id: '1',
    name: 'Kenji M.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
    fallbackText: 'KM',
    status: { type: 'arrived', time: '18:40' }
  },
  {
    id: '2',
    name: 'Yumi T.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
    fallbackText: 'YT',
    status: { type: 'moving', remainingTime: 10 }
  },
  {
    id: '3',
    name: 'Taro S.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
    fallbackText: 'TS',
    status: { type: 'missing' }
  }
]

export default function LateGuardApp() {

  return (
    <div className="max-w-md mx-auto bg-[#FBF9F6] min-h-screen text-stone-800 font-sans p-4 space-y-4 pb-8 shadow-md">
      
      <MissionCard />

      <MapCard location="Shinjuku East Exit, Tokyo" label="TARGET" />

      <RouteDeadlineCard />

      <ArrivalReportCard />

        <div className="space-y-2.5">
          {membersData.map((member) => (
            <MemberCard
              key={member.id}
              name={member.name}
              avatarUrl={member.avatarUrl}
              fallbackText={member.fallbackText}
              status={member.status}
            />
          ))}
        </div>
      </div>
  )
}