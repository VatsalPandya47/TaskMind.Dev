import { assertEquals, assertExists } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Import the function to test
import "./index.ts";

// Mock environment variables for testing
const originalEnv = Deno.env.toObject();

// Test data
const mockUserId = "user-123";
const mockTranscript = `
John: Good morning everyone, welcome to our weekly team meeting. Let's start with updates from each department.

Sarah: Thanks John. From the marketing team, we've completed the Q1 campaign and saw a 15% increase in engagement. We're now planning Q2 initiatives.

Mike: Engineering here. We've deployed the new feature to production and it's running smoothly. No major issues reported so far.

Lisa: Sales team update - we've closed 3 major deals this week and have 5 more in the pipeline. We're on track to meet our quarterly targets.

John: Excellent work everyone. For next week, I want Sarah to prepare the Q2 marketing budget, Mike to review the performance metrics, and Lisa to follow up with the pending deals.

Sarah: I'll have the budget ready by Friday.

Mike: I'll schedule a review meeting for next Tuesday.

Lisa: I'll reach out to all prospects by end of day tomorrow.

John: Perfect. Any other business? No? Alright, meeting adjourned. Thanks everyone.
`;

// Mock Supabase client
const mockSupabase = {
  auth: {
    getUser: async (token: string) => {
      if (token === "valid-token") {
        return {
          data: { user: { id: mockUserId } },
          error: null
        };
      }
      return {
        data: { user: null },
        error: { message: "Invalid token" }
      };
    }
  },
  from: (table: string) => ({
    insert: (data: any) => ({
      select: () => ({
        single: async () => {
          if (table === "summaries") {
            return {
              data: {
                id: "summary-123",
                user_id: mockUserId,
                transcript: data.transcript,
                summary: data.summary,
                audio_name: data.audio_name
              },
              error: null
            };
          }
          return {
            data: null,
            error: { message: "Insert failed" }
          };
        }
      })
    })
  })
};

// Mock OpenAI API
const mockOpenAIResponse = {
  choices: [{
    message: {
      content: `## Meeting Summary

**Key Topics Discussed:**
- Q1 marketing campaign results and Q2 planning
- Engineering deployment status
- Sales pipeline updates and quarterly targets

**Important Decisions:**
- Q2 marketing budget preparation assigned to Sarah
- Performance metrics review assigned to Mike
- Follow-up on pending deals assigned to Lisa

**Action Items:**
- Sarah: Prepare Q2 marketing budget by Friday
- Mike: Schedule performance metrics review for next Tuesday
- Lisa: Follow up with all prospects by end of day tomorrow

**Key Insights:**
- 15% increase in engagement from Q1 marketing campaign
- New feature deployed successfully with no major issues
- 3 major deals closed this week with 5 more in pipeline

**Next Steps:**
- Individual follow-up on assigned tasks
- Preparation for next week's meeting with completed deliverables`
    }
  }]
};

// Helper function to create test request
function createTestRequest(body: any, authToken?: string): Request {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }
  
  return new Request("http://localhost:8000/functions/v1/summarize", {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });
}

// Setup and teardown
function setupTestEnv() {
  Deno.env.set("OPENAI_API_KEY", "test-openai-key");
  Deno.env.set("SUPABASE_URL", "https://test.supabase.co");
  Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "test-service-key");
}

function teardownTestEnv() {
  // Restore original environment
  for (const [key, value] of Object.entries(originalEnv)) {
    Deno.env.set(key, value);
  }
}

// Test suite
Deno.test("Summarize Function Integration Tests", async (t) => {
  
  await t.step("Setup test environment", () => {
    setupTestEnv();
  });

  await t.step("should handle valid transcript successfully", async () => {
    const request = createTestRequest({
      transcript: mockTranscript,
      dry_run: false,
      audio_name: "test-meeting.mp3"
    }, "valid-token");

    // Mock fetch for OpenAI API
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes("api.openai.com")) {
        return new Response(JSON.stringify(mockOpenAIResponse), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      if (url.includes("test.supabase.co")) {
        // Mock Supabase auth response
        if (url.includes("/auth/v1/user")) {
          return new Response(JSON.stringify({
            user: { id: mockUserId }
          }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
        // Mock Supabase insert response
        if (url.includes("/rest/v1/summaries")) {
          return new Response(JSON.stringify([{
            id: "summary-123",
            user_id: mockUserId,
            transcript: mockTranscript,
            summary: mockOpenAIResponse.choices[0].message.content,
            audio_name: "test-meeting.mp3"
          }]), {
            status: 201,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
      return originalFetch(input, init);
    };

    try {
      const response = await serve(request);
      const data = await response.json();

      assertEquals(response.status, 200);
      assertEquals(data.success, true);
      assertExists(data.summary);
      assertEquals(data.dry_run, false);
      assertEquals(data.message, "Successfully generated and saved meeting summary");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  await t.step("should handle dry run mode", async () => {
    const request = createTestRequest({
      transcript: mockTranscript,
      dry_run: true,
      audio_name: "test-dry-run.mp3"
    }, "valid-token");

    // Mock fetch for OpenAI API
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes("api.openai.com")) {
        return new Response(JSON.stringify(mockOpenAIResponse), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      if (url.includes("test.supabase.co")) {
        // Mock Supabase auth response
        if (url.includes("/auth/v1/user")) {
          return new Response(JSON.stringify({
            user: { id: mockUserId }
          }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
      return originalFetch(input, init);
    };

    try {
      const response = await serve(request);
      const data = await response.json();

      assertEquals(response.status, 200);
      assertEquals(data.success, true);
      assertEquals(data.dry_run, true);
      assertExists(data.summary);
      assertEquals(data.message, "Dry run: generated summary, not saved to DB.");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  await t.step("should handle empty transcript", async () => {
    const request = createTestRequest({
      transcript: "",
      dry_run: false
    }, "valid-token");

    const response = await serve(request);
    const data = await response.json();

    assertEquals(response.status, 400);
    assertEquals(data.success, false);
    assertEquals(data.error, "Transcript is required");
  });

  await t.step("should handle missing transcript", async () => {
    const request = createTestRequest({
      dry_run: false
    }, "valid-token");

    const response = await serve(request);
    const data = await response.json();

    assertEquals(response.status, 400);
    assertEquals(data.success, false);
    assertEquals(data.error, "Transcript is required");
  });

  await t.step("should handle unauthorized access", async () => {
    const request = createTestRequest({
      transcript: mockTranscript,
      dry_run: false
    }); // No auth token

    const response = await serve(request);
    const data = await response.json();

    assertEquals(response.status, 401);
    assertEquals(data.success, false);
    assertEquals(data.error, "Unauthorized");
  });

  await t.step("should handle invalid auth token", async () => {
    const request = createTestRequest({
      transcript: mockTranscript,
      dry_run: false
    }, "invalid-token");

    const response = await serve(request);
    const data = await response.json();

    assertEquals(response.status, 401);
    assertEquals(data.success, false);
    assertEquals(data.error, "Unauthorized");
  });

  await t.step("should handle OpenAI API errors", async () => {
    const request = createTestRequest({
      transcript: mockTranscript,
      dry_run: false
    }, "valid-token");

    // Mock fetch to simulate OpenAI API error
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes("api.openai.com")) {
        return new Response(JSON.stringify({
          error: {
            message: "Rate limit exceeded",
            type: "rate_limit_error"
          }
        }), {
          status: 429,
          headers: { "Content-Type": "application/json" }
        });
      }
      if (url.includes("test.supabase.co")) {
        // Mock Supabase auth response
        if (url.includes("/auth/v1/user")) {
          return new Response(JSON.stringify({
            user: { id: mockUserId }
          }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
      return originalFetch(input, init);
    };

    try {
      const response = await serve(request);
      const data = await response.json();

      assertEquals(response.status, 429);
      assertEquals(data.success, false);
      assertEquals(data.code, "RATE_LIMITED");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  await t.step("Teardown test environment", () => {
    teardownTestEnv();
  });
});

// Performance test
Deno.test("Summarize Function Performance Test", async (t) => {
  setupTestEnv();

  await t.step("should complete within reasonable time", async () => {
    const request = createTestRequest({
      transcript: mockTranscript,
      dry_run: false,
      audio_name: "test-meeting.mp3"
    }, "valid-token");

    // Mock fetch for OpenAI API
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes("api.openai.com")) {
        // Simulate some processing time
        await new Promise(resolve => setTimeout(resolve, 100));
        return new Response(JSON.stringify(mockOpenAIResponse), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      return originalFetch(input, init);
    };

    try {
      const startTime = Date.now();
      const response = await serve(request);
      const endTime = Date.now();
      const duration = endTime - startTime;

      assertEquals(response.status, 200);
      // Should complete within 5 seconds
      assertEquals(duration < 5000, true);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  teardownTestEnv();
});

// Load test
Deno.test("Summarize Function Load Test", async (t) => {
  setupTestEnv();

  await t.step("should handle multiple concurrent requests", async () => {
    const requests = Array.from({ length: 5 }, () => 
      createTestRequest({
        transcript: mockTranscript,
        dry_run: false,
        audio_name: "test-meeting.mp3"
      }, "valid-token")
    );

    // Mock fetch for OpenAI API
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes("api.openai.com")) {
        await new Promise(resolve => setTimeout(resolve, 50));
        return new Response(JSON.stringify(mockOpenAIResponse), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      return originalFetch(input, init);
    };

    try {
      const startTime = Date.now();
      const responses = await Promise.all(requests.map(req => serve(req)));
      const endTime = Date.now();
      const duration = endTime - startTime;

      // All requests should succeed
      responses.forEach(response => {
        assertEquals(response.status, 200);
      });

      // Should complete within 10 seconds
      assertEquals(duration < 10000, true);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  teardownTestEnv();
});

console.log("🧪 Summarize function tests ready to run!");
console.log("Run with: deno test --allow-env --allow-net supabase/functions/summarize/test.ts"); 