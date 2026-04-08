"use client";
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
      barColor="bg-gradient-to-r from-violet-400 to-purple-300"
    />
  );
}
