import TeamMemberPage from "@/components/TeamMemberPage";

export default function ClaraPage() {
  return (
    <TeamMemberPage
      name="Clara"
      role="Content Creator"
      avatar="👩‍🎨"
      color="bg-purple-100"
      gradientFrom="#a78bfa"
      gradientTo="#8b5cf6"
      bio="Skapar allt visuellt och skriftligt innehåll — bloggartiklar, produkttexter, videos och grafik. Har en unik känsla för storytelling och design."
      tasks={[
        "Skriv artikel: Great Earth hållbarhetstips",
        "Producera TikTok-video Pepper Deals haul",
        "Designa nyhetsbrevsmall maj",
        "Fotar produktbilder HomesForYou",
      ]}
      quickReplies={[
        "Hur går det med Great Earth-texten?",
        "Kan du lägga till en CTA i artikeln?",
        "Behöver utkast på fredag senast",
        "Fantastisk text! Publicerar nu 🚀",
      ]}
    />
  );
}
