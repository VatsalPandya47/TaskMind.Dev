import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Supabase client
const mockSupabase = {
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
        },
      },
      error: null,
    }),
    getSession: vi.fn().mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
          },
          access_token: 'test-token',
        },
      },
      error: null,
    }),
  },
  from: vi.fn(() => {
    const createChainableMock = () => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      like: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      contains: vi.fn().mockReturnThis(),
      containedBy: vi.fn().mockReturnThis(),
      rangeGt: vi.fn().mockReturnThis(),
      rangeGte: vi.fn().mockReturnThis(),
      rangeLt: vi.fn().mockReturnThis(),
      rangeLte: vi.fn().mockReturnThis(),
      rangeAdjacent: vi.fn().mockReturnThis(),
      overlaps: vi.fn().mockReturnThis(),
      textSearch: vi.fn().mockReturnThis(),
      match: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      filter: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      abortSignal: vi.fn().mockReturnThis(),
      then: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
      single: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
      maybeSingle: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
      data: [],
      error: null,
      head: vi.fn().mockResolvedValue({
        count: 0,
        error: null,
      }),
    });
    
    return createChainableMock();
  }),
  functions: {
    invoke: vi.fn().mockResolvedValue({
      data: { success: true, summary: 'Test summary' },
      error: null,
    }),
  },
  storage: {
    from: vi.fn().mockReturnValue({
      upload: vi.fn().mockResolvedValue({
        data: { path: 'test-user-id/2024-01-15T10-00-00-000Z.mp3' },
        error: null,
      }),
      download: vi.fn().mockResolvedValue({
        data: new Blob(),
        error: null,
      }),
      remove: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
      createSignedUrl: vi.fn().mockResolvedValue({
        data: { signedUrl: 'test-url' },
        error: null,
      }),
      getPublicUrl: vi.fn().mockReturnValue({
        data: { publicUrl: 'test-public-url' },
      }),
      list: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    }),
  },
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

// Also mock the lib/supabaseClient for hooks that use getSupabase()
vi.mock('@/lib/supabaseClient', () => ({
  getSupabase: vi.fn(() => mockSupabase),
}));

// Mock toast hook
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Make mockToast available globally for tests
global.mockToast = mockToast;

// Mock Slack service
const mockSlackService = {
  notifyTaskCreated: vi.fn().mockResolvedValue(undefined),
  notifyTaskCompleted: vi.fn().mockResolvedValue(undefined),
  notifyTaskReminder: vi.fn().mockResolvedValue(undefined),
  notifyMeetingCreated: vi.fn().mockResolvedValue(undefined),
  notifyMeetingUpdated: vi.fn().mockResolvedValue(undefined),
  notifyMeetingSummary: vi.fn().mockResolvedValue(undefined),
  notifyMeetingActionItems: vi.fn().mockResolvedValue(undefined),
  sendDailyDigest: vi.fn().mockResolvedValue(undefined),
  sendWeeklyReport: vi.fn().mockResolvedValue(undefined),
  sendCustomNotification: vi.fn().mockResolvedValue(undefined),
  testConnection: vi.fn().mockResolvedValue(true),
};

vi.mock('@/lib/slackService', () => ({
  slackService: mockSlackService,
}));

// Make slack service available globally for tests
global.mockSlackService = mockSlackService;

// Mock the user hook for authentication
vi.mock('@supabase/auth-helpers-react', () => ({
  useUser: vi.fn(() => ({
    id: 'test-user-id',
    email: 'test@example.com',
  })),
  useSession: vi.fn(() => ({
    user: {
      id: 'test-user-id', 
      email: 'test@example.com',
    },
    access_token: 'test-token',
  })),
  useSupabaseClient: vi.fn(() => mockSupabase),
}));

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock fetch for Slack service tests
const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  status: 200,
  json: vi.fn().mockResolvedValue({ success: true }),
  text: vi.fn().mockResolvedValue('{"success": true}'),
  headers: new Headers(),
});

global.fetch = mockFetch;
global.mockFetch = mockFetch;

// Setup global test utilities
global.mockSupabase = mockSupabase; 