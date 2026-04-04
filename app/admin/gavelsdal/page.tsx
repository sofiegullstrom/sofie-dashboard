import { Gavel } from "lucide-react";
import ProjectPage from "@/components/ProjectPage";

export default function GavelDalPage() {
  return (
    <ProjectPage
      name="GavelDal"
      description="Auktioner & Antikviteter · Content"
      icon={Gavel}
      iconColor="text-amber-700"
      bgColor="bg-amber-100"
      progress={80}
      barColor="bg-gradient-to-r from-amber-400 to-yellow-300"
      tasks={[
        { title: "Produktbeskrivningar nya objekt", priority: "high", est: "90min" },
        { title: "Fotograferingstips artikel", priority: "medium", est: "45min" },
        { title: "Email till säljare", priority: "low", est: "20min" },
      ]}
    />
  );
}
