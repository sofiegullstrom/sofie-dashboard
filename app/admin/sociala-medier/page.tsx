"use client";

import { useState } from "react";
import {
  TrendingUp, Eye, Users, Heart, MessageCircle, Share2,
  Clock, Sparkles, RefreshCw, ChevronUp, Award, Plus, Loader2
} from "lucide-react";
import TaskCard from "@/components/TaskCard";
import { useProjectTasks } from "@/hooks/useProjectTasks";

// ── Real stats (April 2026) ──────────────────────────────────────────────────

const tiktokStats = {
  handle: "@sofiegullstrom",
  period: "Senaste 28 dagarna",
  views: 986000,
  reach: 366000,
  newFollowers: 52000,
  likes: 26000,
  comments: 1128,
  shares: 876,
  engagementRate: ((26000 + 1128 + 876) / 366000 * 100).toFixed(1),
  audience: { female: 83, topAge: "25-34 år (51%)", country: "Sverige 96%" },
  bestTime: "Fredag 21–22",
  trafficSource: "86,9% För dig-sidan",
  monthlyGoal: 1000000,
  topPosts: [
    { title: "Utemöbler haul", views: 228000, date: "15 mar" },
    { title: "ADHD-kliniken", views: 91000, date: "22 mar" },
    { title: "Veckobrev papper", views: 50000, date: "28 mar" },
    { title: "Barn äter ur huset", views: 46000, date: "1 apr" },
  ],
};

const instagramStats = {
  handle: "@sofiegullstrom",
  period: "Senaste 30 dagarna",
  views: 280000,
  reach: 47502,
  reachGrowth: 56.6,
  audience: { female: 92, topAge: "25-34 år (39%)", country: "Sverige 97%" },
  bestTime: "Tisdag–torsdag 19–21",
  contentMix: { stories: 55, reels: 28, posts: 16 },
  monthlyGoal: 50000,
  topPosts: [
    { title: "Inlägg 14 mars", views: 22000, date: "14 mar" },
    { title: "Inlägg 12 mars", views: 12000, date: "12 mar" },
    { title: "Inlägg 2 april", views: 10000, date: "2 apr" },
    { title: "Inlägg 8 mars", views: 9900, date: "8 mar" },
  ],
};

// ── AI recommendations (static, based on top posts) ─────────────────────────

const tiktokIdeas = [
  { title: "Utemöbler vol. 2", why: "Fortsätt serien — originalet fick 228K. Visa samma plats efter 1 månad.", tag: "Uppföljare" },
  { title: "ADHD-diagnos: 3 månader senare", why: "91K views — publiken vill veta hur det går. Personlig uppföljning.", tag: "Uppföljare" },
  { title: "Vad jag äter på en vecka (med barn)", why: "Mat + vardagsliv presterar starkt. Kombinera Barn äter + Veckobrev-formatet.", tag: "Nytt format" },
  { title: "Budgethack: handla hemma för 500kr", why: "Ekonomi + hem + barn = hög relevans för 25-34-demografin.", tag: "Trend" },
];

const instagramIdeas = [
  { title: "Carousel: 5 saker ingen berättar om ADHD", why: "Utbildande carousels sparas och delas — ökar räckvidd organiskt.", tag: "Carousel" },
  { title: "Reel: Morning routine med barn", why: "Reels = 28% av räckvidden. Visa ärlig vardag — fungerar för din publik.", tag: "Reel" },
  { title: "Inlägg: Utemöblerna klara + before/after", why: "Ditt bästa TikTok-format konverterat till stills — lätt att producera.", tag: "Inlägg" },
  { title: "Stories: Rösta — vad vill ni se härnäst?", why: "Öka Stories-engagemanget (55% av din räckvidd). Interaktion = algoritm.", tag: "Stories" },
];

// ── Update form ──────────────────────────────────────────────────────────────

interface UpdateForm {
  tiktok_views: string;
  tiktok_reach: string;
  tiktok_followers_new: string;
  ig_views: string;
  ig_reach: string;
}

// ── Components ───────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string; sub?: string; color: string;
}) {
  return (
    <div className={`rounded-2xl p-4 ${color}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={13} className="opacity-70" />
        <span className="text-xs font-medium opacity-70">{label}</span>
      </div>
      <p className="text-xl font-black">{value}</p>
      {sub && <p className="text-xs opacity-60 mt-0.5">{sub}</p>}
    </div>
  );
}

function GoalMeter({ current, goal, label, color }: { current: number; goal: number; label: string; color: string }) {
  const pct = Math.min(100, Math.round((current / goal) * 100));
  return (
    <div className="bg-white/60 rounded-xl p-3">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-semibold">{label}</span>
        <span className={`text-xs font-bold ${pct >= 90 ? "text-emerald-600" : pct >= 60 ? "text-amber-500" : "text-gray-500"}`}>
          {pct}%
        </span>
      </div>
      <div className="h-2 bg-black/10 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs opacity-60 mt-1">
        {current.toLocaleString("sv-SE")} / {goal.toLocaleString("sv-SE")} visningar
      </p>
    </div>
  );
}

function TopPost({ rank, post, colorClass }: { rank: number; post: { title: string; views: number; date: string }; colorClass: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 ${colorClass}`}>
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-700 truncate">{post.title}</p>
        <p className="text-xs text-gray-400">{post.date}</p>
      </div>
      <div className="flex items-center gap-1 text-xs font-bold text-gray-500 shrink-0">
        <Eye size={11} />
        {post.views >= 1000 ? `${(post.views / 1000).toFixed(0)}K` : post.views.toLocaleString("sv-SE")}
      </div>
    </div>
  );
}

function IdeaCard({ idea, accent }: { idea: { title: string; why: string; tag: string }; accent: string }) {
  return (
    <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
      <div className="flex items-start gap-2 mb-1.5">
        <Sparkles size={13} className={`${accent} shrink-0 mt-0.5`} />
        <p className="text-xs font-semibold text-gray-800">{idea.title}</p>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed mb-2">{idea.why}</p>
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-gray-50 text-gray-500`}>{idea.tag}</span>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SocialMediaPage() {
  const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask } = useProjectTasks("Sociala medier");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [form, setForm] = useState<UpdateForm>({
    tiktok_views: "", tiktok_reach: "", tiktok_followers_new: "",
    ig_views: "", ig_reach: "",
  });
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    // Save to Supabase
    const { supabase } = await import("@/lib/supabase");
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const periodEnd = now.toISOString().split("T")[0];
    const month = now.toLocaleString("sv-SE", { month: "long", year: "numeric" });

    const rows = [];
    if (form.tiktok_views) rows.push({
      platform: "tiktok", period_label: month,
      period_start: periodStart, period_end: periodEnd,
      views: parseInt(form.tiktok_views) || 0,
      reach: parseInt(form.tiktok_reach) || 0,
      followers_new: parseInt(form.tiktok_followers_new) || 0,
    });
    if (form.ig_views) rows.push({
      platform: "instagram", period_label: month,
      period_start: periodStart, period_end: periodEnd,
      views: parseInt(form.ig_views) || 0,
      reach: parseInt(form.ig_reach) || 0,
    });

    if (rows.length) await supabase.from("social_stats").insert(rows);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowUpdateForm(false); }, 1500);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-purple-900">Sociala medier</h1>
          <p className="text-sm text-gray-400 mt-0.5">TikTok & Instagram · {new Date().toLocaleString("sv-SE", { month: "long", year: "numeric" })}</p>
        </div>
        <button
          onClick={() => setShowUpdateForm(!showUpdateForm)}
          className="flex items-center gap-2 text-xs px-3 py-2 bg-white border border-purple-100 rounded-xl shadow-sm hover:bg-purple-50 text-purple-600 font-medium transition-colors"
        >
          <RefreshCw size={13} />
          Uppdatera statistik
        </button>
      </div>

      {/* Update form */}
      {showUpdateForm && (
        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Mata in ny statistik</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">TikTok</p>
              {[
                { key: "tiktok_views" as keyof UpdateForm, label: "Visningar" },
                { key: "tiktok_reach" as keyof UpdateForm, label: "Tittare (räckvidd)" },
                { key: "tiktok_followers_new" as keyof UpdateForm, label: "Nya följare" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                  <input
                    type="number"
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-300"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Instagram</p>
              {[
                { key: "ig_views" as keyof UpdateForm, label: "Visningar" },
                { key: "ig_reach" as keyof UpdateForm, label: "Konton nådda (räckvidd)" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                  <input
                    type="number"
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-300"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            {saved ? "Sparat! ✓" : "Spara statistik"}
          </button>
        </div>
      )}

      {/* ── TikTok section ── */}
      <div className="bg-gray-900 rounded-2xl p-5 text-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🎵</span>
              <h2 className="text-base font-black">TikTok</h2>
              <span className="text-xs text-gray-400">{tiktokStats.handle}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{tiktokStats.period}</p>
          </div>
          <div className="flex items-center gap-1 text-xs bg-white/10 rounded-full px-2.5 py-1">
            <TrendingUp size={11} />
            {tiktokStats.trafficSource}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={Eye} label="Visningar" value={(tiktokStats.views / 1000).toFixed(0) + "K"} sub="→ 986K" color="bg-white/10 text-white" />
          <StatCard icon={Users} label="Tittare" value={(tiktokStats.reach / 1000).toFixed(0) + "K"} sub={`+${(tiktokStats.newFollowers / 1000).toFixed(0)}K nya`} color="bg-white/10 text-white" />
          <StatCard icon={Heart} label="Engagemang" value={tiktokStats.engagementRate + "%"} sub={`${tiktokStats.likes.toLocaleString("sv-SE")} likes`} color="bg-white/10 text-white" />
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="bg-white/5 rounded-xl p-3">
            <MessageCircle size={11} className="mb-1 opacity-50" />
            <p className="font-bold">{tiktokStats.comments.toLocaleString("sv-SE")}</p>
            <p className="text-gray-400">kommentarer</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <Share2 size={11} className="mb-1 opacity-50" />
            <p className="font-bold">{tiktokStats.shares.toLocaleString("sv-SE")}</p>
            <p className="text-gray-400">delningar</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <Users size={11} className="mb-1 opacity-50" />
            <p className="font-bold">{tiktokStats.audience.female}% ♀</p>
            <p className="text-gray-400">{tiktokStats.audience.topAge}</p>
          </div>
        </div>

        {/* Best time + goal */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock size={11} className="text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-400">Bästa tid att posta</span>
            </div>
            <p className="text-sm font-bold">{tiktokStats.bestTime}</p>
            <p className="text-xs text-gray-400 mt-0.5">Publik aktiv lördag 00–01</p>
          </div>
          <GoalMeter
            current={tiktokStats.views}
            goal={tiktokStats.monthlyGoal}
            label="Mål: 1M visningar/mån"
            color="bg-gradient-to-r from-purple-400 to-pink-400"
          />
        </div>

        {/* Top posts */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award size={13} className="text-yellow-400" />
            <span className="text-xs font-bold">Toppvideor denna period</span>
          </div>
          {tiktokStats.topPosts.map((p, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{p.title}</p>
                <p className="text-xs text-gray-500">{p.date}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-gray-300 shrink-0">
                <Eye size={10} />
                {p.views >= 1000 ? `${(p.views / 1000).toFixed(0)}K` : p.views}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Instagram section ── */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-5 text-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📸</span>
              <h2 className="text-base font-black">Instagram</h2>
              <span className="text-xs text-white/60">{instagramStats.handle}</span>
            </div>
            <p className="text-xs text-white/50 mt-0.5">{instagramStats.period}</p>
          </div>
          <div className="flex items-center gap-1 text-xs bg-white/20 rounded-full px-2.5 py-1">
            <ChevronUp size={11} />
            +{instagramStats.reachGrowth}% räckvidd
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Eye} label="Visningar" value={(instagramStats.views / 1000).toFixed(0) + "K"} color="bg-white/20 text-white" />
          <StatCard icon={Users} label="Konton nådda" value={instagramStats.reach.toLocaleString("sv-SE")} sub={`+${instagramStats.reachGrowth}%`} color="bg-white/20 text-white" />
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          {[
            { label: "Stories", pct: instagramStats.contentMix.stories },
            { label: "Reels", pct: instagramStats.contentMix.reels },
            { label: "Inlägg", pct: instagramStats.contentMix.posts },
          ].map(({ label, pct }) => (
            <div key={label} className="bg-white/10 rounded-xl p-3 text-center">
              <p className="font-black text-lg">{pct}%</p>
              <p className="text-white/60">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock size={11} className="text-yellow-300" />
              <span className="text-xs font-semibold text-yellow-300">Bästa tid</span>
            </div>
            <p className="text-sm font-bold">{instagramStats.bestTime}</p>
            <p className="text-xs text-white/50 mt-0.5">{instagramStats.audience.female}% kvinnor · {instagramStats.audience.topAge}</p>
          </div>
          <GoalMeter
            current={instagramStats.reach}
            goal={instagramStats.monthlyGoal}
            label="Mål: 50K räckvidd/mån"
            color="bg-white/60"
          />
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award size={13} className="text-yellow-300" />
            <span className="text-xs font-bold">Toppinlägg denna period</span>
          </div>
          {instagramStats.topPosts.map((p, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-white/10 last:border-0">
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{p.title}</p>
                <p className="text-xs text-white/50">{p.date}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-white/70 shrink-0">
                <Eye size={10} />
                {p.views >= 1000 ? `${(p.views / 1000).toFixed(0)}K` : p.views}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI recommendations ── */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-xl bg-gray-900 flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">TikTok-idéer</h3>
              <p className="text-xs text-gray-400">Baserat på toppvideorna</p>
            </div>
          </div>
          <div className="space-y-3">
            {tiktokIdeas.map((idea, i) => (
              <IdeaCard key={i} idea={idea} accent="text-gray-700" />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Instagram-idéer</h3>
              <p className="text-xs text-gray-400">Baserat på bästa räckvidden</p>
            </div>
          </div>
          <div className="space-y-3">
            {instagramIdeas.map((idea, i) => (
              <IdeaCard key={i} idea={idea} accent="text-pink-500" />
            ))}
          </div>
        </div>
      </div>

      {/* Audience summary */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Publik — sammanfattning</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">TikTok</p>
            {[
              { label: "Kön", value: "83% kvinnor" },
              { label: "Ålder", value: "25-34 år (51%)" },
              { label: "Land", value: "Sverige 96%" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-xs">
                <span className="text-gray-500">{label}</span>
                <span className="font-semibold text-gray-700">{value}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Instagram</p>
            {[
              { label: "Kön", value: "92% kvinnor" },
              { label: "Ålder", value: "25-34 år (39%)" },
              { label: "Land", value: "Sverige 97%" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-xs">
                <span className="text-gray-500">{label}</span>
                <span className="font-semibold text-gray-700">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tasks ── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-700">
            Uppgifter
            {!tasksLoading && tasks.length > 0 && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                {tasks.filter((t) => t.status === "done").length}/{tasks.length} klara
              </span>
            )}
          </h2>
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className="w-6 h-6 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center hover:bg-pink-200 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        {showAddTask && (
          <div className="flex gap-2 mb-3">
            <input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTask(newTaskTitle);
                  setNewTaskTitle("");
                  setShowAddTask(false);
                }
              }}
              placeholder="Ny uppgift..."
              className="flex-1 text-sm px-3 py-2 border border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none placeholder-gray-300"
              autoFocus
            />
            <button
              onClick={() => { addTask(newTaskTitle); setNewTaskTitle(""); setShowAddTask(false); }}
              className="px-3 py-2 bg-pink-400 text-white text-xs rounded-xl hover:bg-pink-500 font-medium"
            >
              Lägg till
            </button>
          </div>
        )}

        {tasksLoading ? (
          <div className="flex items-center justify-center py-8 text-gray-300">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">Inga uppgifter. Lägg till en!</p>
        ) : (
          <div className="space-y-2">
            {[...tasks]
              .sort((a, b) => {
                if (a.status === "done" && b.status !== "done") return 1;
                if (b.status === "done" && a.status !== "done") return -1;
                const order = { high: 0, medium: 1, low: 2 };
                return order[a.priority] - order[b.priority];
              })
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={(id, status) => updateTask(id, { status })}
                  onDelete={deleteTask}
                  onUpdate={(updated) =>
                    updateTask(updated.id, {
                      title: updated.title,
                      description: updated.description,
                      priority: updated.priority,
                      estimated_minutes: updated.estimated_minutes,
                    })
                  }
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
