import Header from "@/components/homepage/Header";
import MonthlyLateCard from "@/components/homepage/MonthlyLateCard";
import ScheduleList from "@/components/homepage/ScheduleList";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-[390px] flex-col bg-white border">
      <Header />

      <div className="p-4 space-y-6">
        <MonthlyLateCard />

        {/* 次回の目的地はここに入れる */}

        <ScheduleList />
      </div>
    </main>
  );
}