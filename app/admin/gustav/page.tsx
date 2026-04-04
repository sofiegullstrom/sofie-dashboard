import TeamMemberPage from "@/components/TeamMemberPage";

export default function GustavPage() {
  return (
    <TeamMemberPage
      name="Gustav"
      role="Growth Manager"
      avatar="🧑‍📊"
      color="bg-emerald-100"
      gradientFrom="#34d399"
      gradientTo="#14b8a6"
      bio="Driver tillväxt genom dataanalys, SEO, konverteringsoptimering och affiliate-strategi. Alltid på jakt efter nästa stora möjlighet att skala verksamheten."
      tasks={[
        "A/B-testa landningssidor HomesForYou",
        "SEO-audit Pepper Deals",
        "Affiliate-rapport april",
        "Growth hacks för PrimeBets Q2",
      ]}
      quickReplies={[
        "Hur ser konverteringarna ut?",
        "Vilka sidor rankar bäst just nu?",
        "Kör A/B-test på den här versionen",
        "Grymma siffror den här veckan! 🚀",
      ]}
    />
  );
}
