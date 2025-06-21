import { assertEquals, assertExists } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Import the function to test
import "./index.ts";

// Mock environment variables for testing
const originalEnv = Deno.env.toObject();

// Test data
const mockMeetingId = "123e4567-e89b-12d3-a456-426614174000";
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
    select: () => ({
      eq: (field: string, value: string) => ({
        eq: (field2: string, value2: string) => ({
          single: async () => {
            if (table === "meetings" && value === mockMeetingId && value2 === mockUserId) {
              return {
                data: {
                  id: mockMeetingId,
                  user_id: mockUserId,
                  title: "Weekly Team Meeting",
                  date: "2024-01-15"
                },
                error: null
              };
            }
            return {
              data: null,
              error: { message: "Meeting not found" }
            };
          }
        })
      })
    }),
    update: (data: any) => ({
      eq: (field: string, value: string) => ({
        then: (callback: Function) => callback({ error: null })
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
      meetingId: mockMeetingId,
      transcript: mockTranscript
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
      return originalFetch(input, init);
    };

    try {
      const response = await serve(request);
      const data = await response.json();

      assertEquals(response.status, 200);
      assertEquals(data.success, true);
      assertExists(data.summary);
      assertEquals(data.meetingId, mockMeetingId);
      assertEquals(data.message, "Successfully generated meeting summary");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  await t.step("should handle empty transcript", async () => {
    const request = createTestRequest({
      meetingId: mockMeetingId,
      transcript: ""
    }, "valid-token");

    const response = await serve(request);
    const data = await response.json();

    assertEquals(response.status, 400);
    assertEquals(data.success, false);
    assertEquals(data.error, "Meeting ID and transcript are required");
  });

  await t.step("should handle missing transcript", async () => {
    const request = createTestRequest({
      meetingId: mockMeetingId
    }, "valid-token");

    const response = await serve(request);
    const data = await response.json();

    assertEquals(response.status, 400);
    assertEquals(data.success, false);
    assertEquals(data.error, "Meeting ID and transcript are required");
  });

  await t.step("should handle unauthorized access", async () => {
    const request = createTestRequest({
      meetingId: mockMeetingId,
      transcript: mockTranscript
    }); // No auth token

    const response = await serve(request);
    const data = await response.json();

    assertEquals(response.status, 401);
    assertEquals(data.success, false);
    assertEquals(data.error, "Unauthorized");
  });

  await t.step("should handle invalid auth token", async () => {
    const request = createTestRequest({
      meetingId: mockMeetingId,
      transcript: mockTranscript
    }, "invalid-token");

    const response = await serve(request);
    const data = await response.json();

    assertEquals(response.status, 401);
    assertEquals(data.success, false);
    assertEquals(data.error, "Unauthorized");
  });

  await t.step("should handle dry_run mode", async () => {
    const request = createTestRequest({
      meetingId: mockMeetingId,
      transcript: mockTranscript,
      dry_run: true
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
      return originalFetch(input, init);
    };

    try {
      const response = await serve(request);
      const data = await response.json();

      assertEquals(response.status, 200);
      assertEquals(data.success, true);
      assertExists(data.summary);
      assertEquals(data.message, "Dry run: generated summary, not saved to DB.");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  await t.step("should handle OpenAI API rate limiting", async () => {
    const request = createTestRequest({
      meetingId: mockMeetingId,
      transcript: mockTranscript
    }, "valid-token");

    // Mock fetch for OpenAI API with rate limiting
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes("api.openai.com")) {
        return new Response(JSON.stringify({ error: "rate_limit_exceeded" }), {
          status: 429,
          headers: { 
            "Content-Type": "application/json",
            "retry-after": "60"
          }
        });
      }
      return originalFetch(input, init);
    };

    try {
      const response = await serve(request);
      const data = await response.json();

      assertEquals(response.status, 429);
      assertEquals(data.success, false);
      assertEquals(data.code, "RATE_LIMITED");
      assertEquals(data.error, "OpenAI API is currently busy with too many requests. Please wait a few minutes and try again.");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  await t.step("should handle OpenAI API invalid key", async () => {
    const request = createTestRequest({
      meetingId: mockMeetingId,
      transcript: mockTranscript
    }, "valid-token");

    // Mock fetch for OpenAI API with invalid key
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes("api.openai.com")) {
        return new Response(JSON.stringify({ error: "invalid_api_key" }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }
      return originalFetch(input, init);
    };

    try {
      const response = await serve(request);
      const data = await response.json();

      assertEquals(response.status, 500);
      assertEquals(data.success, false);
      assertEquals(data.code, "INVALID_API_KEY");
      assertEquals(data.error, "Invalid OpenAI API key configuration.");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  await t.step("should handle OpenAI API server error", async () => {
    const request = createTestRequest({
      meetingId: mockMeetingId,
      transcript: mockTranscript
    }, "valid-token");

    // Mock fetch for OpenAI API with server error
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes("api.openai.com")) {
        return new Response(JSON.stringify({ error: "internal_server_error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      return originalFetch(input, init);
    };

    try {
      const response = await serve(request);
      const data = await response.json();

      assertEquals(response.status, 503);
      assertEquals(data.success, false);
      assertEquals(data.code, "SERVICE_ERROR");
      assertEquals(data.error, "AI service is temporarily unavailable. Please try again in a few minutes.");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  await t.step("should handle missing OpenAI API key", async () => {
    // Temporarily remove OpenAI API key
    Deno.env.delete("OPENAI_API_KEY");

    const request = createTestRequest({
      meetingId: mockMeetingId,
      transcript: mockTranscript
    }, "valid-token");

    const response = await serve(request);
    const data = await response.json();

    assertEquals(response.status, 500);
    assertEquals(data.success, false);
    assertEquals(data.error, "OpenAI API key not configured");

    // Restore API key
    Deno.env.set("OPENAI_API_KEY", "test-openai-key");
  });

  await t.step("should handle meeting not found", async () => {
    const request = createTestRequest({
      meetingId: "non-existent-meeting-id",
      transcript: mockTranscript
    }, "valid-token");

    const response = await serve(request);
    const data = await response.json();

    assertEquals(response.status, 404);
    assertEquals(data.success, false);
    assertEquals(data.error, "Meeting not found or unauthorized");
  });

  await t.step("should handle CORS preflight request", async () => {
    const request = new Request("http://localhost:8000/functions/v1/summarize", {
      method: "OPTIONS",
      headers: {
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "authorization,content-type"
      }
    });

    const response = await serve(request);
    
    assertEquals(response.status, 200);
    assertEquals(response.headers.get("Access-Control-Allow-Origin"), "*");
    assertEquals(response.headers.get("Access-Control-Allow-Headers"), "authorization, x-client-info, apikey, content-type");
  });

  await t.step("should handle very short transcript", async () => {
    const request = createTestRequest({
      meetingId: mockMeetingId,
      transcript: "Hello world"
    }, "valid-token");

    // Mock fetch for OpenAI API with short response
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes("api.openai.com")) {
        return new Response(JSON.stringify({
          choices: [{
            message: {
              content: "Too short"
            }
          }]
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      return originalFetch(input, init);
    };

    try {
      const response = await serve(request);
      const data = await response.json();

      assertEquals(response.status, 422);
      assertEquals(data.success, false);
      assertEquals(data.code, "SUMMARY_ERROR");
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
      meetingId: mockMeetingId,
      transcript: mockTranscript
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
        meetingId: mockMeetingId,
        transcript: mockTranscript
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