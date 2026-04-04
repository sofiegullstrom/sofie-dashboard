-- Tasks table
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  project text not null default 'Övrigt',
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  estimated_minutes integer not null default 30,
  due_date date,
  assigned_to text,
  created_at timestamptz not null default now()
);

-- Notes table
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  raw_text text not null,
  structured_text text,
  category text default 'Anteckning',
  created_at timestamptz not null default now()
);

-- Ratings table
create table if not exists ratings (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id) on delete cascade,
  score integer not null check (score >= 1 and score <= 10),
  plus_comment text,
  minus_comment text,
  created_at timestamptz not null default now()
);

-- Team messages table
create table if not exists team_messages (
  id uuid primary key default gen_random_uuid(),
  from_member text not null,
  message text not null,
  reply text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Ideas table
create table if not exists ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  project text,
  tags text[] default '{}',
  created_at timestamptz not null default now()
);

-- Sample data
insert into tasks (title, description, project, priority, status, estimated_minutes) values
  ('Skriva kampanjtext Great Earth nyhetsbrev', 'Fokus på hållbarhet. 300-400 ord.', 'Great Earth', 'high', 'in_progress', 60),
  ('Granska Saras Instagramkalender maj', null, 'Sociala medier', 'medium', 'todo', 30),
  ('Uppdatera PrimeBets affiliate-länklista', null, 'PrimeBets', 'low', 'todo', 20),
  ('Möte med Max om Q2-kampanjbudget', 'Gå igenom siffrorna för Pepper Deals och GavelDal', 'Pepper Deals', 'high', 'todo', 45);

insert into ideas (title, project, tags) values
  ('Great Earth podcast-serie om hållbarhet', 'Great Earth', array['content', 'audio']),
  ('Pepper Deals app med push-notiser', 'Pepper Deals', array['tech', 'ux']),
  ('HomesForYou virtuella stadsvisningar', 'HomesForYou', array['video', 'interaktivt']);
