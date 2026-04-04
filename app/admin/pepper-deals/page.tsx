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
      progress={65}
      barColor="bg-gradient-to-r from-orange-300 to-amber-300"
      tasks={[
        { title: "Uppdatera topp-deals för veckan", priority: "high", est: "45min" },
        { title: "Skriv produktrecensioner x3", priority: "high", est: "90min" },
        { title: "Kolla affiliate-status hos partners", priority: "medium", est: "30min" },
        { title: "SEO-optimera kategorisidor", priority: "medium", est: "60min" },
        { title: "Newsletter med veckans deals", priority: "low", est: "45min" },
      ]}
    />
  );
}
