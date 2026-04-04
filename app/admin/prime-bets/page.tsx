import { Dices } from "lucide-react";
import ProjectPage from "@/components/ProjectPage";

export default function PrimeBetsPage() {
  return (
    <ProjectPage
      name="PrimeBets"
      description="Sport & Spel · Affiliate"
      icon={Dices}
      iconColor="text-violet-600"
      bgColor="bg-violet-100"
      progress={30}
      barColor="bg-gradient-to-r from-violet-400 to-purple-300"
      tasks={[
        { title: "Q2-strategi dokument", priority: "high", est: "90min" },
        { title: "Uppdatera affiliate-länklista", priority: "high", est: "45min" },
        { title: "Sportkalender för maj", priority: "medium", est: "30min" },
        { title: "Granska bonuserbjudanden", priority: "medium", est: "40min" },
        { title: "Skriv odds-guide för nybörjare", priority: "low", est: "120min" },
      ]}
    />
  );
}
