"use client";
import { ShoppingBag } from "lucide-react";
import ProjectPage from "@/components/ProjectPage";

export default function PepperDealsPage() {
  return (
    <ProjectPage
      name="Pepper Deals"
      description="Deals & Erbjudanden · Affiliate"
      icon={ShoppingBag}
      iconColor="text-orange-600"
      bgColor="bg-orange-100"
      barColor="bg-gradient-to-r from-orange-300 to-amber-300"
    />
  );
}
