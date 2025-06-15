
# Internal Evaluation Dataset

- Each line in `dataset.jsonl` is a record with fields:
  - transcript (input)
  - ai_output (raw AI output)
  - corrected_output (optional, by human)
  - notes (optional)

Example:
```json
{
  "transcript": "Full transcript here",
  "ai_output": [
    { "task": "Follow up with HR", "responsible_person": "Alice", "deadline": "2025-06-21", "follow_up": true }
  ],
  "corrected_output": [
    { "task": "Follow up with HR about onboarding", "responsible_person": "Alice", "deadline": "2025-06-21", "follow_up": true }
  ],
  "notes": "AI missed context about onboarding"
}
```
Use this for evaluation, prompt improvement, and future fine-tuning.
