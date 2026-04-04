"use client";

import { useEffect, useState } from "react";
import { Leaf, Clock } from "lucide-react";

interface GreatEarthCountdownProps {
  deadlineDate?: string; // ISO string
  deadlineLabel?: string;
}

export default function GreatEarthCountdown({
  deadlineDate = "2025-06-01T00:00:00",
  deadlineLabel = "Nästa deadline",
}: GreatEarthCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    function update() {
      const now = new Date().getTime();
      const target = new Date(deadlineDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [deadlineDate]);

  if (!mounted) return null;

  const urgency = timeLeft.days < 7 ? "text-red-500" : timeLeft.days < 14 ? "text-yellow-600" : "text-emerald-700";

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Leaf size={16} className="text-emerald-600" />
        <h2 className="text-sm font-bold text-emerald-800">Great Earth</h2>
      </div>

      <p className="text-xs text-emerald-600 mb-3 font-medium">{deadlineLabel}</p>

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
    </div>
  );
}
