import { ReactNode } from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useAIProcessing } from '../useAIProcessing';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    QueryClientProvider({ client: queryClient, children })
  );
};

describe('useAIProcessing', () => {
  let mockSupabase: any;
  let mockToast: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockSupabase = (global as any).mockSupabase;
    mockToast = (global as any).mockToast;
    
    // Setup default auth mock
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'test-user-id' }, access_token: 'mock-token' } },
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('successful transcript processing', () => {
    it('should process transcript and extract tasks successfully', async () => {
      const mockResponse = {
        success: true,
        tasksCount: 3,
        tasks: [
          {
            task: 'Review project proposal',
            assignee: 'John',
            due_date: '2024-01-25',
            priority: 'high',
            context: 'Discussed in morning meeting',
          },
          {
            task: 'Update documentation',
            assignee: 'Sarah',
            due_date: '2024-01-30',
            priority: 'medium',
            context: 'Legacy system docs need updates',
          },
          {
            task: 'Schedule follow-up meeting',
            assignee: 'Mike',
            due_date: '2024-01-22',
            priority: 'low',
            context: 'Team sync for next sprint',
          },
        ],
        message: 'Successfully extracted 3 tasks from transcript',
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const { result } = renderHook(() => useAIProcessing(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.processTranscript.mutate({
          meetingId: 'meeting-123',
          transcript: 'Meeting discussion about project updates, tasks assignment, and timeline...',
        });
      });

      await waitFor(() => {
        expect(result.current.processTranscript.isSuccess).toBe(true);
      });
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('process-transcript', {
        body: {
          meetingId: 'meeting-123',
          transcript: 'Meeting discussion about project updates, tasks assignment, and timeline...',
        },
        headers: {
          Authorization: 'Bearer mock-token',
        },
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success! 🎉',
        description: 'AI extracted 3 tasks from the transcript',
      });
    });

    it('should handle processing with no tasks extracted', async () => {
      const mockResponse = {
        success: true,
        tasksCount: 0,
        tasks: [],
        message: 'No actionable tasks found in transcript',
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const { result } = renderHook(() => useAIProcessing(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.processTranscript.mutate({
          meetingId: 'meeting-456',
          transcript: 'General discussion without specific action items...',
        });
      });

      await waitFor(() => {
        expect(result.current.processTranscript.isSuccess).toBe(true);
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success! 🎉',
        description: 'AI extracted 0 tasks from the transcript',
      });
    });

    it('should handle single task extraction', async () => {
      const mockResponse = {
        success: true,
        tasksCount: 1,
        tasks: [
          {
            task: 'Send meeting notes to team',
            assignee: 'Alex',
            due_date: '2024-01-20',
            priority: 'high',
            context: 'Action item from today\'s meeting',
          },
        ],
        message: 'Successfully extracted 1 task from transcript',
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const { result } = renderHook(() => useAIProcessing(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.processTranscript.mutate({
          meetingId: 'meeting-789',
          transcript: 'Alex, please send the meeting notes to the team by tomorrow.',
        });
      });

      await waitFor(() => {
        expect(result.current.processTranscript.isSuccess).toBe(true);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success! 🎉',
        description: 'AI extracted 1 tasks from the transcript',
      });
    });
  });

  describe('authentication handling', () => {
    it('should handle missing session', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const { result } = renderHook(() => useAIProcessing(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.processTranscript.mutate({
          meetingId: 'meeting-123',
          transcript: 'Test transcript...',
        });
      });

      await waitFor(() => {
        expect(result.current.processTranscript.isError).toBe(true);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Processing Failed',
        description: 'Not authenticated',
        variant: 'destructive',
      });
    });

    it('should handle authentication error', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: new Error('Session expired'),
      });

      const { result } = renderHook(() => useAIProcessing(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.processTranscript.mutate({
          meetingId: 'meeting-123',
          transcript: 'Test transcript...',
        });
      });

      await waitFor(() => {
        expect(result.current.processTranscript.isError).toBe(true);
      });
    });
  });

  describe('error handling', () => {
    it('should handle API failure response', async () => {
      mockSupabase.functions.invoke.mockResolvedValue({
        data: {
          success: false,
          error: 'Transcript too short for analysis',
          tasksCount: 0,
        },
        error: null,
      });

      const { result } = renderHook(() => useAIProcessing(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.processTranscript.mutate({
          meetingId: 'meeting-123',
          transcript: 'Short text',
        });
      });

      await waitFor(() => {
        expect(result.current.processTranscript.isError).toBe(true);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Processing Failed',
        description: 'Transcript too short for analysis',
        variant: 'destructive',
      });
    });

    it('should handle network errors', async () => {
      mockSupabase.functions.invoke.mockRejectedValue(new Error('Network connection failed'));

      const { result } = renderHook(() => useAIProcessing(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.processTranscript.mutate({
          meetingId: 'meeting-123',
          transcript: 'Test transcript...',
        });
      });

      await waitFor(() => {
        expect(result.current.processTranscript.isError).toBe(true);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Processing Failed',
        description: 'Network connection failed',
        variant: 'destructive',
      });
    });

    it('should handle API errors from edge function', async () => {
      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: new Error('AI service rate limit exceeded'),
      });

      const { result } = renderHook(() => useAIProcessing(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.processTranscript.mutate({
          meetingId: 'meeting-123',
          transcript: 'Test transcript...',
        });
      });

      await waitFor(() => {
        expect(result.current.processTranscript.isError).toBe(true);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Processing Failed',
        description: 'OpenAI API rate limit reached. Please wait a few minutes and try again.',
        variant: 'destructive',
      });
    });

    it('should handle processing failure without error message', async () => {
      mockSupabase.functions.invoke.mockResolvedValue({
        data: {
          success: false,
          tasksCount: 0,
        },
        error: null,
      });

      const { result } = renderHook(() => useAIProcessing(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.processTranscript.mutate({
          meetingId: 'meeting-123',
          transcript: 'Test transcript...',
        });
      });

      await waitFor(() => {
        expect(result.current.processTranscript.isError).toBe(true);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Processing Failed',
        description: 'Processing failed',
        variant: 'destructive',
      });
    });
  });

  describe('query invalidation', () => {
    it.skip('should invalidate correct queries on successful processing', async () => {
      const mockResponse = {
        success: true,
        tasksCount: 2,
        tasks: [
          { task: 'Task 1', assignee: 'User 1', due_date: '2024-01-20', priority: 'high', context: 'Context 1' },
          { task: 'Task 2', assignee: 'User 2', due_date: '2024-01-21', priority: 'medium', context: 'Context 2' },
        ],
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const queryClient = new QueryClient();
      const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useAIProcessing(), {
        wrapper: ({ children }) => {
          const { QueryClientProvider } = require('@tanstack/react-query');
          return QueryClientProvider({ client: queryClient, children });
        },
      });

      await act(async () => {
        result.current.processTranscript.mutate({
          meetingId: 'meeting-123',
          transcript: 'Test transcript...',
        });
      });

      await waitFor(() => {
        expect(result.current.processTranscript.isSuccess).toBe(true);
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['tasks'] });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['meetings'] });
    });

    it.skip('should not invalidate queries on processing failure', async () => {
      mockSupabase.functions.invoke.mockResolvedValue({
        data: {
          success: false,
          error: 'Processing failed',
        },
        error: null,
      });

      const queryClient = new QueryClient();
      const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useAIProcessing(), {
        wrapper: ({ children }) => {
          const { QueryClientProvider } = require('@tanstack/react-query');
          return QueryClientProvider({ client: queryClient, children });
        },
      });

      await act(async () => {
        result.current.processTranscript.mutate({
          meetingId: 'meeting-123',
          transcript: 'Test transcript...',
        });
      });

      await waitFor(() => {
        expect(result.current.processTranscript.isError).toBe(true);
      });

      expect(invalidateQueriesSpy).not.toHaveBeenCalled();
    });
  });

  describe('state management', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAIProcessing(), {
        wrapper: createWrapper(),
      });

      expect(result.current.processTranscript.isPending).toBe(false);
      expect(result.current.processTranscript.isError).toBe(false);
      expect(result.current.processTranscript.isSuccess).toBe(false);
      expect(result.current.processTranscript.error).toBeNull();
    });

    it('should expose required methods', () => {
      const { result } = renderHook(() => useAIProcessing(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty('processTranscript');
      expect(typeof result.current.processTranscript.mutate).toBe('function');
      expect(typeof result.current.processTranscript.mutateAsync).toBe('function');
    });
  });

  describe('input validation', () => {
    it('should handle empty transcript', async () => {
      const mockResponse = {
        success: true,
        tasksCount: 0,
        tasks: [],
        message: 'No content to process',
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const { result } = renderHook(() => useAIProcessing(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.processTranscript.mutate({
          meetingId: 'meeting-123',
          transcript: '',
        });
      });

      await waitFor(() => {
        expect(result.current.processTranscript.isSuccess).toBe(true);
      });

      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('process-transcript', {
        body: {
          meetingId: 'meeting-123',
          transcript: '',
        },
        headers: {
          Authorization: 'Bearer mock-token',
        },
      });
    });

    it('should handle very long transcript', async () => {
      const longTranscript = 'This is a very long meeting transcript. '.repeat(500);
      
      const mockResponse = {
        success: true,
        tasksCount: 5,
        tasks: Array.from({ length: 5 }, (_, i) => ({
          task: `Task ${i + 1}`,
          assignee: `User ${i + 1}`,
          due_date: `2024-01-${20 + i}`,
          priority: 'medium',
          context: `Context ${i + 1}`,
        })),
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const { result } = renderHook(() => useAIProcessing(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.processTranscript.mutate({
          meetingId: 'meeting-123',
          transcript: longTranscript,
        });
      });

      await waitFor(() => {
        expect(result.current.processTranscript.isSuccess).toBe(true);
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success! 🎉',
        description: 'AI extracted 5 tasks from the transcript',
      });
    });

    it('should handle missing meetingId', async () => {
      const { result } = renderHook(() => useAIProcessing(), {
        wrapper: createWrapper(),
      });

      // TypeScript should prevent this, but test runtime behavior
      await act(async () => {
        result.current.processTranscript.mutate({
          meetingId: undefined as any,
          transcript: 'Test transcript...',
        });
      });

      await waitFor(() => {
        expect(result.current.processTranscript.isSuccess).toBe(true);
      });

      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('process-transcript', {
        body: {
          meetingId: undefined,
          transcript: 'Test transcript...',
        },
        headers: {
          Authorization: 'Bearer mock-token',
        },
      });
    });
  });

  describe('edge cases', () => {
    it('should handle malformed response data', async () => {
      mockSupabase.functions.invoke.mockResolvedValue({
        data: {
          // Missing success field
          tasksCount: 'invalid',
          tasks: 'not an array',
        },
        error: null,
      });

      const { result } = renderHook(() => useAIProcessing(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.processTranscript.mutate({
          meetingId: 'meeting-123',
          transcript: 'Test transcript...',
        });
      });

      await waitFor(() => {
        expect(result.current.processTranscript.isError).toBe(true);
      });
    });

    it('should handle null response data', async () => {
      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: null,
      });

      const { result } = renderHook(() => useAIProcessing(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.processTranscript.mutate({
          meetingId: 'meeting-123',
          transcript: 'Test transcript...',
        });
      });

      await waitFor(() => {
        expect(result.current.processTranscript.isError).toBe(true);
      });
    });
  });
}); 