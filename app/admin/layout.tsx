import Sidebar from "@/components/Sidebar";
import TeamBubbles from "@/components/TeamBubbles";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#fafafa]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="max-w-5xl mx-auto px-6 py-6">{children}</div>
      </main>
      <TeamBubbles />
    </div>
  );
}
