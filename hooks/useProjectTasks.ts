"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, Task } from "@/lib/supabase";

export function useProjectTasks(project?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    if (project) query = query.eq("project", project);
    const { data } = await query;
    setTasks(data || []);
    setLoading(false);
  }, [project]);

  useEffect(() => {
    load();
  }, [load]);

  async function addTask(
    title: string,
    opts: { priority?: Task["priority"]; estimated_minutes?: number } = {}
  ) {
    const row = {
      title,
      project: project || "Övrigt",
      priority: opts.priority ?? "medium",
      status: "todo" as Task["status"],
      estimated_minutes: opts.estimated_minutes ?? 30,
    };
    const { data } = await supabase.from("tasks").insert(row).select().single();
    if (data) setTasks((prev) => [data, ...prev]);
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    await supabase.from("tasks").update(updates).eq("id", id);
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }

  async function deleteTask(id: string) {
    await supabase.from("tasks").delete().eq("id", id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return { tasks, loading, addTask, updateTask, deleteTask };
}
