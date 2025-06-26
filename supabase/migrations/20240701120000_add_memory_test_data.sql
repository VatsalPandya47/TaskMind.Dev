-- Add realistic test data to memory_embeddings for TaskMind Memory

-- Helper: 1536 zeros for embedding
DO $$
DECLARE
  zeros float8[] := array_fill(0.0, ARRAY[1536]);
BEGIN
  INSERT INTO memory_embeddings (id, content_text, content_type, content_id, metadata, embedding) VALUES
  -- Meeting
  (gen_random_uuid(),
   'We discussed the new product roadmap for Q2. Key features include AI-powered task prioritization, real-time collaboration tools, and advanced analytics dashboard. The team agreed to focus on user experience improvements first.',
   'meeting',
   gen_random_uuid(),
   '{"title": "Q2 Product Planning", "date": "2024-01-15", "participants": ["alice@company.com", "bob@company.com", "charlie@company.com"], "duration": "60min", "action_items": ["Finalize UX mockups", "Set up user testing", "Create development timeline"]}',
   zeros),
  -- Task
  (gen_random_uuid(),
   'Prepare the slides for the upcoming investor pitch. Focus on the new AI features and customer success stories.',
   'task',
   gen_random_uuid(),
   '{"task": "Prepare investor pitch slides", "assignee": "bob@company.com", "priority": "High", "completed": false, "due_date": "2024-01-20"}',
   zeros),
  -- Decision
  (gen_random_uuid(),
   'The team decided to postpone the mobile app launch to Q3 to allow more time for testing and bug fixes.',
   'decision',
   gen_random_uuid(),
   '{"title": "Mobile App Launch Postponed", "date": "2024-01-18", "participants": ["alice@company.com", "bob@company.com"], "reason": "More testing needed"}',
   zeros),
  -- Summary
  (gen_random_uuid(),
   'Summary: The Q2 planning meeting focused on prioritizing user experience improvements and scheduling user testing sessions.',
   'summary',
   gen_random_uuid(),
   '{"ai_model": "gpt-4", "meeting_id": "Q2-PLANNING-2024"}',
   zeros);
END $$; 