import { AtSign, TrendingUp, Heart, MessageCircle } from "lucide-react";
import QuickNote from "@/components/QuickNote";

const platforms = [
  { name: "Instagram", followers: "12.4K", growth: "+2.3%", color: "from-pink-400 to-rose-400", emoji: "📸" },
  { name: "TikTok", followers: "8.1K", growth: "+5.1%", color: "from-purple-400 to-violet-400", emoji: "🎵" },
  { name: "LinkedIn", followers: "3.2K", growth: "+0.8%", color: "from-blue-400 to-cyan-400", emoji: "💼" },
];

const recentPosts = [
  { platform: "Instagram", caption: "Great Earth produktlansering 🌿", likes: 234, comments: 18, date: "Idag" },
  { platform: "TikTok", caption: "Pepper Deals haul video", likes: 1203, comments: 87, date: "Igår" },
  { platform: "LinkedIn", caption: "Q1 affiliate-rapport", likes: 45, comments: 12, date: "2 dagar sedan" },
];

export default function SocialMediaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center">
          <AtSign size={20} className="text-pink-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-purple-900">Sociala medier</h1>
          <p className="text-sm text-gray-400">Alla kanaler · Samlad vy</p>
        </div>
      </div>

      {/* Platform stats */}
      <div className="grid grid-cols-3 gap-4">
        {platforms.map((p) => (
          <div key={p.name} className={`bg-gradient-to-br ${p.color} rounded-2xl p-4 text-white shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{p.emoji}</span>
              <div className="flex items-center gap-1 text-xs bg-white/20 rounded-full px-2 py-0.5">
                <TrendingUp size={10} />
                {p.growth}
              </div>
            </div>
            <p className="text-2xl font-black">{p.followers}</p>
            <p className="text-xs text-white/80 mt-0.5">{p.name}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          {/* Recent posts */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
            <h2 className="text-sm font-bold text-gray-700 mb-3">Senaste inlägg</h2>
            <div className="space-y-2">
              {recentPosts.map((post) => (
                <div key={post.caption} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{post.caption}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{post.platform} · {post.date}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Heart size={11} className="text-pink-400" />
                      {post.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={11} className="text-purple-400" />
                      {post.comments}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <QuickNote />
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50 h-fit">
          <h2 className="text-sm font-bold text-gray-700 mb-3">Att göra</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            {["Schemalägg 3 inlägg för nästa vecka", "Svara på DM:s (12 nya)", "Analysera veckans räckvidd", "Skapa stories-mall"].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-300 mt-1.5 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
