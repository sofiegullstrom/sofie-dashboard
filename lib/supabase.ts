import { createClient } from "@supabase/supabase-js";

export type Task = {
  id: string;
  title: string;
  description?: string;
  project: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in_progress" | "done";
  estimated_minutes: number;
  due_date?: string;
  assigned_to?: string;
  created_at: string;
};

export type Note = {
  id: string;
  raw_text: string;
  structured_text?: string;
  category?: string;
  created_at: string;
};

export type Rating = {
  id: string;
  task_id: string;
  score: number;
  plus_comment?: string;
  minus_comment?: string;
  created_at: string;
};

export type TeamMessage = {
  id: string;
  from_member: string;
  message: string;
  reply?: string;
  is_read: boolean;
  created_at: string;
};

export type Idea = {
  id: string;
  title: string;
  description?: string;
  project?: string;
  tags?: string[];
  created_at: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
