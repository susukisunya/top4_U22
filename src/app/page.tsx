import Header from "@/components/homepage/Header";
import MonthlyLateCard from "@/components/homepage/MonthlyLateCard";
import { MissionCard } from "@/components/card/missionCard";
import ScheduleList from "@/components/homepage/ScheduleList";
import Footer from "@/components/homepage/Footer";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-[390px] flex-col bg-white border pt-20 pb-20">
      <Header />

      <div className="p-4 space-y-6">
        <MonthlyLateCard />

        <MissionCard />

        <ScheduleList />
      </div>

      <Footer/>
    </main>
  );
}