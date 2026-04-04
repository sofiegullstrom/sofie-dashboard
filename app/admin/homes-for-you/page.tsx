import { Home } from "lucide-react";
import ProjectPage from "@/components/ProjectPage";

export default function HomesForYouPage() {
  return (
    <ProjectPage
      name="HomesForYou"
      description="Fastigheter & Boende · Content"
      icon={Home}
      iconColor="text-blue-600"
      bgColor="bg-blue-100"
      progress={40}
      barColor="bg-gradient-to-r from-blue-300 to-cyan-300"
      tasks={[
        { title: "Skriva 3 boendeguider", priority: "high", est: "120min" },
        { title: "Uppdatera regionsidor", priority: "medium", est: "60min" },
        { title: "Kolla SEO-rankningar", priority: "medium", est: "30min" },
        { title: "Sociala medier-inlägg x5", priority: "low", est: "60min" },
      ]}
    />
  );
}
