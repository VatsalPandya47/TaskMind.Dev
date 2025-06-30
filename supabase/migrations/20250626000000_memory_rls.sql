-- Enable RLS for memory tables
ALTER TABLE public.memory_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_search_logs ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to select/insert/update/delete (for now, for testing)
CREATE POLICY "Authenticated can access memory_embeddings"
  ON public.memory_embeddings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can access memory_search_logs"
  ON public.memory_search_logs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true); 