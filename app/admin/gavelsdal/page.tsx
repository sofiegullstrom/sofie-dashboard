"use client";
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
      barColor="bg-gradient-to-r from-amber-400 to-yellow-300"
    />
  );
}
