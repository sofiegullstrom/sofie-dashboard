"use client";

import { useEffect, useState } from "react";
import { Leaf, Clock, Settings, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function GreatEarthCountdown() {
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineLabel, setDeadlineLabel] = useState("Nästa deadline");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [saving, setSaving] = useState(false);

  // Load from Supabase
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("settings")
        .select("key, value")
        .in("key", ["greatearth_deadline_date", "greatearth_deadline_label"]);

      if (data) {
        const dateRow = data.find((r) => r.key === "greatearth_deadline_date");
        const labelRow = data.find((r) => r.key === "greatearth_deadline_label");
        if (dateRow) setDeadlineDate(dateRow.value);
        if (labelRow) setDeadlineLabel(labelRow.value);
      }
      setMounted(true);
    }
    load();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!deadlineDate) return;

    function update() {
      const now = Date.now();
      const target = new Date(deadlineDate).getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [deadlineDate]);

  async function handleSave() {
    if (!editDate) return;
    setSaving(true);
    await supabase.from("settings").upsert([
      { key: "greatearth_deadline_date", value: editDate, updated_at: new Date().toISOString() },
      { key: "greatearth_deadline_label", value: editLabel || "Nästa deadline", updated_at: new Date().toISOString() },
    ]);
    setDeadlineDate(editDate);
    setDeadlineLabel(editLabel || "Nästa deadline");
    setSaving(false);
    setEditing(false);
  }

  function openEdit() {
    setEditDate(deadlineDate);
    setEditLabel(deadlineLabel);
    setEditing(true);
  }

  if (!mounted) return null;

  const urgency = timeLeft.days < 7
    ? "text-red-500"
    : timeLeft.days < 14
    ? "text-yellow-600"
    : "text-emerald-700";

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Leaf size={16} className="text-emerald-600" />
          <h2 className="text-sm font-bold text-emerald-800">Great Earth</h2>
        </div>
        <button
          onClick={openEdit}
          className="p-1 text-emerald-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-100"
          title="Ändra deadline"
        >
          <Settings size={13} />
        </button>
      </div>

      {editing ? (
        <div className="space-y-2">
          <div>
            <label className="text-xs text-emerald-700 font-medium mb-1 block">Datum</label>
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-400 bg-white"
            />
          </div>
          <div>
            <label className="text-xs text-emerald-700 font-medium mb-1 block">Etikett</label>
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              placeholder="T.ex. Kampanjlansering"
              className="w-full text-xs px-3 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-400 bg-white placeholder-gray-300"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving || !editDate}
              className="flex items-center gap-1.5 text-xs px-3 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 font-medium"
            >
              <Check size={12} />
              {saving ? "Sparar..." : "Spara"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-xs px-3 py-2 bg-white text-emerald-600 rounded-xl hover:bg-emerald-50 border border-emerald-200"
            >
              Avbryt
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-xs text-emerald-600 mb-3 font-medium">{deadlineLabel}</p>

          {!deadlineDate ? (
            <p className="text-xs text-emerald-400 italic">Ingen deadline satt — klicka ⚙️ för att lägga till.</p>
          ) : (
            <>
              <div className="flex gap-2">
                {[
                  { value: timeLeft.days, label: "Dagar" },
                  { value: timeLeft.hours, label: "Tim" },
                  { value: timeLeft.minutes, label: "Min" },
                  { value: timeLeft.seconds, label: "Sek" },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    className="flex-1 bg-white rounded-xl p-2 text-center border border-emerald-100"
                  >
                    <p className={`text-xl font-black ${urgency} tabular-nums`}>
                      {String(value).padStart(2, "0")}
                    </p>
                    <p className="text-[9px] text-emerald-500 font-medium uppercase tracking-wider">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              {timeLeft.days < 7 && (
                <div className="mt-2 flex items-center gap-1 text-xs text-red-500 font-medium">
                  <Clock size={11} />
                  Snart deadline — prioritera!
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
