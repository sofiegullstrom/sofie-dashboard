import TeamMemberPage from "@/components/TeamMemberPage";

export default function SaraPage() {
  return (
    <TeamMemberPage
      name="Sara"
      role="Social Media Manager"
      avatar="👩‍💼"
      color="bg-pink-100"
      gradientFrom="#f472b6"
      gradientTo="#fb7185"
      bio="Ansvarar för alla sociala kanaler — Instagram, TikTok och LinkedIn. Expert på trender, engagement och att hitta rätt ton för varje projekt."
      tasks={[
        "Planera maj-kalender för Great Earth",
        "Svara på DM:s (12 nya)",
        "Publicera veckaninlägg Pepper Deals",
        "Analysera engagement-data vecka 14",
      ]}
      quickReplies={[
        "Kan du prioritera Great Earth idag?",
        "Hur ser engagement ut den här veckan?",
        "Vi behöver 3 extra inlägg till fredag",
        "Bra jobbat med senaste kampanjen! 🎉",
      ]}
    />
  );
}
