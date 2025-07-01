import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useSummarize } from '../useSummarize';

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

describe('useSummarize', () => {
  let mockSupabase: any;
  let mockToast: any;
  let mockSlackService: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockSupabase = (global as any).mockSupabase;
    mockToast = (global as any).mockToast;
    mockSlackService = (global as any).mockSlackService;
    
    // Setup default auth mock
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'test-user-id' }, access_token: 'mock-token' } },
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('successful summarization', () => {
    it('should summarize transcript successfully (non-dry run)', async () => {
      const mockResponse = {
        success: true,
        dry_run: false,
        summary: 'This meeting covered project updates, discussed timeline adjustments, and assigned new tasks to team members.',
        processing_time_ms: 2500,
        retry_attempts: 0,
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const { result } = renderHook(() => useSummarize(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.summarizeTranscript.mutate({
          transcript: 'Meeting transcript content...',
          dry_run: false,
          audio_name: 'Team Standup',
        });
      });

      await waitFor(() => {
        expect(result.current.summarizeTranscript.isSuccess).toBe(true);
      });
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('summarize', {
        body: {
          transcript: 'Meeting transcript content...',
          dry_run: false,
          audio_name: 'Team Standup',
        },
        headers: {
          Authorization: 'Bearer mock-token',
        },
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Summary Generated! 📝',
        description: 'Meeting summary has been created successfully',
      });

      expect(mockSlackService.notifyMeetingSummary).toHaveBeenCalledWith(
        {
          title: 'Team Standup',
          date: expect.any(String),
          duration: 'Unknown',
        },
        mockResponse.summary
      );
    });

    it('should handle dry run successfully', async () => {
      const mockResponse = {
        success: true,
        dry_run: true,
        summary: 'Test summary for validation purposes.',
        processing_time_ms: 1800,
        retry_attempts: 0,
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const { result } = renderHook(() => useSummarize(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.summarizeTranscript.mutate({
          transcript: 'Test transcript...',
          dry_run: true,
          audio_name: 'Test Meeting',
        });
      });

      await waitFor(() => {
        expect(result.current.summarizeTranscript.isSuccess).toBe(true);
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Test Summary Generated! 🧪',
        description: 'Test summary generated successfully (not saved to database)',
      });

      // Should not send Slack notification for dry run
      expect(mockSlackService.notifyMeetingSummary).not.toHaveBeenCalled();
    });

    it('should handle missing audio_name', async () => {
      const mockResponse = {
        success: true,
        dry_run: false,
        summary: 'Meeting summary without specific name.',
        processing_time_ms: 2000,
        retry_attempts: 0,
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const { result } = renderHook(() => useSummarize(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.summarizeTranscript.mutateAsync({
          transcript: 'Meeting transcript...',
          dry_run: false,
        });
      });

      expect(mockSlackService.notifyMeetingSummary).toHaveBeenCalledWith(
        {
          title: 'Meeting Summary',
          date: expect.any(String),
          duration: 'Unknown',
        },
        mockResponse.summary
      );
    });
  });

  describe('authentication handling', () => {
    it('should handle missing session', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const { result } = renderHook(() => useSummarize(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.summarizeTranscript.mutateAsync({
            transcript: 'Test transcript...',
          });
        } catch (error) {
          expect(error.message).toBe('Not authenticated');
        }
      });

      expect(result.current.summarizeTranscript.isError).toBe(true);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Summarization Failed',
        description: 'Authentication failed. Please log in again.',
        variant: 'destructive',
      });
    });

    it('should handle authentication error', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: new Error('Session expired'),
      });

      const { result } = renderHook(() => useSummarize(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.summarizeTranscript.mutate({
          transcript: 'Test transcript...',
        });
      });

      await waitFor(() => {
        expect(result.current.summarizeTranscript.isError).toBe(true);
      });
    });
  });

  describe('retry logic', () => {
    it('should retry on rate limit error', async () => {
      let callCount = 0;
      mockSupabase.functions.invoke.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({
            data: null,
            error: new Error('Rate limit exceeded'),
          });
        }
        return Promise.resolve({
          data: {
            success: true,
            dry_run: false,
            summary: 'Retry successful summary',
            retry_attempts: 1,
          },
          error: null,
        });
      });

      const { result } = renderHook(() => useSummarize(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.summarizeTranscript.mutateAsync({
          transcript: 'Test transcript...',
        });
      });

      expect(callCount).toBe(2);
      expect(result.current.summarizeTranscript.isSuccess).toBe(true);
    });

    it('should retry on 429 status error', async () => {
      let callCount = 0;
      mockSupabase.functions.invoke.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({
            data: null,
            error: new Error('HTTP 429: Too Many Requests'),
          });
        }
        return Promise.resolve({
          data: {
            success: true,
            dry_run: false,
            summary: 'Second attempt successful',
            retry_attempts: 1,
          },
          error: null,
        });
      });

      const { result } = renderHook(() => useSummarize(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.summarizeTranscript.mutateAsync({
          transcript: 'Test transcript...',
        });
      });

      expect(callCount).toBe(2);
      expect(result.current.summarizeTranscript.isSuccess).toBe(true);
    });

    it('should fail after max retries', async () => {
      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: new Error('Rate limit exceeded'),
      });

      const { result } = renderHook(() => useSummarize(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.summarizeTranscript.mutateAsync({
            transcript: 'Test transcript...',
          });
        } catch (error) {
          expect(error.message).toContain('Rate limit exceeded');
        }
      });

      expect(result.current.summarizeTranscript.isError).toBe(true);
      // Should have called 3 times (initial + 2 retries)
      expect(mockSupabase.functions.invoke).toHaveBeenCalledTimes(3);
    });

    it('should not retry on non-retryable errors', async () => {
      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: new Error('INVALID_API_KEY'),
      });

      const { result } = renderHook(() => useSummarize(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.summarizeTranscript.mutate({
          transcript: 'Test transcript...',
        });
      });

      // Should only call once, no retries
      expect(mockSupabase.functions.invoke).toHaveBeenCalledTimes(1);
      
      await waitFor(() => {
        expect(result.current.summarizeTranscript.isError).toBe(true);
      });
    });
  });

  describe('error handling', () => {
    it('should handle API failure response', async () => {
      mockSupabase.functions.invoke.mockResolvedValue({
        data: {
          success: false,
          error: 'Transcript too short for meaningful summary',
        },
        error: null,
      });

      const { result } = renderHook(() => useSummarize(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.summarizeTranscript.mutate({
          transcript: 'Short text',
        });
      });

      await waitFor(() => {
        expect(result.current.summarizeTranscript.isError).toBe(true);
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Summarization Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    });

    it('should handle network errors', async () => {
      mockSupabase.functions.invoke.mockRejectedValue(new Error('Network connection failed'));

      const { result } = renderHook(() => useSummarize(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.summarizeTranscript.mutateAsync({
            transcript: 'Test transcript...',
          });
        } catch (error) {
          expect(error.message).toBe('Network connection failed');
        }
      });

      expect(result.current.summarizeTranscript.isError).toBe(true);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Summarization Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    });

    it('should handle service errors with specific messaging', async () => {
      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: new Error('Service temporarily unavailable'),
      });

      const { result } = renderHook(() => useSummarize(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.summarizeTranscript.mutateAsync({
            transcript: 'Test transcript...',
          });
        } catch (error) {
          expect(error.message).toBe('Service temporarily unavailable');
        }
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Summarization Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    });

    it('should handle unexpected errors', async () => {
      mockSupabase.functions.invoke.mockResolvedValue({
        data: {
          success: false,
          // No error message provided
        },
        error: null,
      });

      const { result } = renderHook(() => useSummarize(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.summarizeTranscript.mutateAsync({
            transcript: 'Test transcript...',
          });
        } catch (error) {
          expect(error.message).toBe('Summarization failed');
        }
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Summarization Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    });
  });

  describe('slack integration', () => {
    it('should handle Slack notification failures gracefully', async () => {
      const mockResponse = {
        success: true,
        dry_run: false,
        summary: 'Test summary',
        processing_time_ms: 2000,
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      // Mock Slack service to fail (using implementation to avoid unhandled rejection)
      mockSlackService.notifyMeetingSummary.mockImplementation(() => {
        throw new Error('Slack API error');
      });

      const { result } = renderHook(() => useSummarize(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.summarizeTranscript.mutate({
          transcript: 'Test transcript...',
          dry_run: false,
          audio_name: 'Test Meeting',
        });
      });

      // Should still be successful even if Slack fails
      await waitFor(() => {
        expect(result.current.summarizeTranscript.isSuccess).toBe(true);
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Summary Generated! 📝',
        description: 'Meeting summary has been created successfully',
      });
    });

    it('should not send Slack notification for dry runs', async () => {
      const mockResponse = {
        success: true,
        dry_run: true,
        summary: 'Dry run summary',
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const { result } = renderHook(() => useSummarize(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.summarizeTranscript.mutateAsync({
          transcript: 'Test transcript...',
          dry_run: true,
        });
      });

      expect(mockSlackService.notifyMeetingSummary).not.toHaveBeenCalled();
    });
  });

  describe('query invalidation', () => {
    it('should invalidate summaries query on successful non-dry run', async () => {
      const mockResponse = {
        success: true,
        dry_run: false,
        summary: 'Test summary',
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const queryClient = new QueryClient();
      const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useSummarize(), {
        wrapper: ({ children }) => (
          QueryClientProvider({ client: queryClient, children })
        ),
      });

      await act(async () => {
        await result.current.summarizeTranscript.mutateAsync({
          transcript: 'Test transcript...',
          dry_run: false,
        });
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['summaries'] });
    });

    it('should not invalidate queries on dry run', async () => {
      const mockResponse = {
        success: true,
        dry_run: true,
        summary: 'Dry run summary',
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const queryClient = new QueryClient();
      const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useSummarize(), {
        wrapper: ({ children }) => (
          QueryClientProvider({ client: queryClient, children })
        ),
      });

      await act(async () => {
        await result.current.summarizeTranscript.mutateAsync({
          transcript: 'Test transcript...',
          dry_run: true,
        });
      });

      expect(invalidateQueriesSpy).not.toHaveBeenCalled();
    });
  });

  describe('state management', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useSummarize(), {
        wrapper: createWrapper(),
      });

      expect(result.current.summarizeTranscript.isPending).toBe(false);
      expect(result.current.summarizeTranscript.isError).toBe(false);
      expect(result.current.summarizeTranscript.isSuccess).toBe(false);
      expect(result.current.summarizeTranscript.error).toBeNull();
    });

    it('should expose required methods', () => {
      const { result } = renderHook(() => useSummarize(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty('summarizeTranscript');
      expect(typeof result.current.summarizeTranscript.mutate).toBe('function');
      expect(typeof result.current.summarizeTranscript.mutateAsync).toBe('function');
    });
  });

  describe('input validation', () => {
    it('should handle empty transcript', async () => {
      const { result } = renderHook(() => useSummarize(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.summarizeTranscript.mutateAsync({
          transcript: '',
        });
      });

      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('summarize', {
        body: {
          transcript: '',
          dry_run: false,
          audio_name: undefined,
        },
        headers: {
          Authorization: 'Bearer mock-token',
        },
      });
    });

    it('should handle very long transcript', async () => {
      const longTranscript = 'This is a test transcript. '.repeat(1000);
      
      mockSupabase.functions.invoke.mockResolvedValue({
        data: {
          success: true,
          dry_run: false,
          summary: 'Summary of very long meeting.',
        },
        error: null,
      });

      const { result } = renderHook(() => useSummarize(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.summarizeTranscript.mutate({
          transcript: longTranscript,
        });
      });

      await waitFor(() => {
        expect(result.current.summarizeTranscript.isSuccess).toBe(true);
      });
    });
  });
}); 