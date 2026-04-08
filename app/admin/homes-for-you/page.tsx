"use client";
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
      barColor="bg-gradient-to-r from-blue-300 to-cyan-300"
    />
  );
}
