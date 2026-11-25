CREATE TABLE learning_items (
    id uuid default gen_random_uuid() primary key,
    item_type text not null check (item_type in ('resource', 'homework')),
    title text not null,
    description text,
    resource_type text,
    subject text,
    topic text,
    external_url text,
    instructions text,
    due_at timestamptz,
    created_at timestamptz default now()
);

CREATE TABLE quizzes (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    subject text,
    duration_seconds integer not null default 600,
    questions jsonb not null default '[]'::jsonb,
    created_at timestamptz default now(),
    check (jsonb_typeof(questions) = 'array'),
    check (duration_seconds > 0)
);

CREATE TABLE quiz_attempts (
    id uuid default gen_random_uuid() primary key,
    quiz_id uuid not null references quizzes(id) on delete cascade,
    answers jsonb not null default '[]'::jsonb,
    score numeric(6,2) default 0,
    total_marks numeric(6,2),
    submitted_at timestamptz,
    created_at timestamptz default now(),
    check (jsonb_typeof(answers) = 'array'),
    check (score >= 0),
    check (total_marks is null or total_marks >= 0)
);

CREATE TABLE study_tasks (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    target_date date,
    is_completed boolean default false,
    created_at timestamptz default now()
);