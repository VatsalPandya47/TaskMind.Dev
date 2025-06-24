ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('Complete', 'In Progress', 'Stuck')) DEFAULT 'In Progress';
