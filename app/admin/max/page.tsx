import TeamMemberPage from "@/components/TeamMemberPage";

export default function MaxPage() {
  return (
    <TeamMemberPage
      name="Max"
      role="Marketing Manager"
      avatar="👨‍💻"
      color="bg-blue-100"
      gradientFrom="#60a5fa"
      gradientTo="#06b6d4"
      bio="Ansvarar för marknadsföringsstrategi, kampanjplanering och budget. Analytisk och data-driven med ett öga för tillväxtmöjligheter i alla projekt."
      tasks={[
        "Presentera Q2-budget för Sofie",
        "Granska PrimeBets kampanjstrategi",
        "Optimera Google Ads för Pepper Deals",
        "Rapport: Vecka 14 performance",
      ]}
      quickReplies={[
        "Hur ser Q2-budgeten ut?",
        "Vilka kanaler presterar bäst?",
        "Kan vi öka budget för Great Earth?",
        "Toppresultat i veckan! 📊",
      ]}
    />
  );
}
