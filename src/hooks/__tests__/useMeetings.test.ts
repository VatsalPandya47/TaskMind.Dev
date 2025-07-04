import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useMeetings } from '../useMeetings';

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

  return ({ children }: { children: ReactNode }) => 
    QueryClientProvider({ client: queryClient, children });
};

describe('useMeetings', () => {
  let mockSupabase: any;
  let mockToast: any;
  let mockSlackService: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockSupabase = (global as any).mockSupabase;
    mockToast = (global as any).mockToast;
    mockSlackService = (global as any).mockSlackService;
    
    // Setup default auth mock
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('fetching meetings', () => {
    it('should fetch meetings successfully', async () => {
      const mockMeetings = [
        {
          id: '1',
          title: 'Team Standup',
          date: '2024-01-15',
          participants: ['John', 'Jane'],
          duration: '30 minutes',
          summary: 'Daily standup meeting',
          user_id: 'test-user-id',
        },
        {
          id: '2',
          title: 'Project Review',
          date: '2024-01-16',
          participants: ['Alice', 'Bob'],
          duration: '60 minutes',
          summary: 'Quarterly project review',
          user_id: 'test-user-id',
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: mockMeetings,
            error: null,
          }),
        }),
      });

      const { result } = renderHook(() => useMeetings(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.meetings).toEqual(mockMeetings);
      expect(result.current.error).toBeNull();
    });

    it('should handle fetch error', async () => {
      const mockError = new Error('Database connection failed');

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: null,
            error: mockError,
          }),
        }),
      });

      const { result } = renderHook(() => useMeetings(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.error).toEqual(mockError);
      });

      expect(result.current.meetings).toEqual([]);
    });
  });

  describe('creating meetings', () => {
    it('should create a meeting successfully', async () => {
      const newMeeting = {
        title: 'New Meeting',
        date: '2024-01-17',
        participants: ['John', 'Jane'],
        duration: '45 minutes',
        summary: 'Important meeting',
      };

      const createdMeeting = {
        id: '3',
        ...newMeeting,
        user_id: 'test-user-id',
      };

      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: createdMeeting,
              error: null,
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useMeetings(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.createMeeting.mutate(newMeeting);
      });

      await waitFor(() => {
        expect(result.current.createMeeting.isSuccess).toBe(true);
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Meeting created successfully',
      });
      expect(mockSlackService.notifyMeetingCreated).toHaveBeenCalledWith(createdMeeting);
    });

    it('should handle authentication error when creating meeting', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Not authenticated'),
      });

      const { result } = renderHook(() => useMeetings(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.createMeeting.mutate({
          title: 'Test Meeting',
          date: '2024-01-17',
          participants: [],
        });
      });

      await waitFor(() => {
        expect(result.current.createMeeting.isError).toBe(true);
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Not authenticated',
        variant: 'destructive',
      });
    });

    it('should handle database error when creating meeting', async () => {
      const dbError = new Error('Database insert failed');

      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: dbError,
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useMeetings(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.createMeeting.mutate({
          title: 'Test Meeting',
          date: '2024-01-17',
          participants: [],
        });
      });

      await waitFor(() => {
        expect(result.current.createMeeting.isError).toBe(true);
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Database insert failed',
        variant: 'destructive',
      });
    });
  });

  describe('updating meetings', () => {
    it('should update a meeting successfully', async () => {
      const meetingUpdate = {
        id: '1',
        title: 'Updated Meeting Title',
        summary: 'Updated summary',
      };

      const updatedMeeting = {
        id: '1',
        title: 'Updated Meeting Title',
        date: '2024-01-15',
        participants: ['John', 'Jane'],
        duration: '30 minutes',
        summary: 'Updated summary',
        user_id: 'test-user-id',
      };

      mockSupabase.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: updatedMeeting,
                error: null,
              }),
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useMeetings(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.updateMeeting.mutate(meetingUpdate);
      });

      await waitFor(() => {
        expect(result.current.updateMeeting.isSuccess).toBe(true);
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Meeting updated successfully',
      });
      expect(mockSlackService.notifyMeetingUpdated).toHaveBeenCalledWith(updatedMeeting);
    });

    it('should handle update error', async () => {
      const updateError = new Error('Update failed');

      mockSupabase.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: updateError,
              }),
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useMeetings(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.updateMeeting.mutate({
          id: '1',
          title: 'Failed Update',
        });
      });

      await waitFor(() => {
        expect(result.current.updateMeeting.isError).toBe(true);
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Update failed',
        variant: 'destructive',
      });
    });
  });

  describe('deleting meetings', () => {
    it('should delete a meeting successfully', async () => {
      mockSupabase.from.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: null,
          }),
        }),
      });

      const { result } = renderHook(() => useMeetings(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.deleteMeeting.mutate('meeting-id-1');
      });

      await waitFor(() => {
        expect(result.current.deleteMeeting.isSuccess).toBe(true);
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Meeting deleted successfully',
      });
    });

    it('should handle delete error', async () => {
      const deleteError = new Error('Delete failed');

      mockSupabase.from.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: deleteError,
          }),
        }),
      });

      const { result } = renderHook(() => useMeetings(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.deleteMeeting.mutate('meeting-id-1');
      });

      await waitFor(() => {
        expect(result.current.deleteMeeting.isError).toBe(true);
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Delete failed',
        variant: 'destructive',
      });
    });
  });

  describe('state management', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useMeetings(), {
        wrapper: createWrapper(),
      });

      expect(result.current.meetings).toEqual([]);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.createMeeting.isPending).toBe(false);
      expect(result.current.updateMeeting.isPending).toBe(false);
      expect(result.current.deleteMeeting.isPending).toBe(false);
    });

    it('should expose all required methods and properties', () => {
      const { result } = renderHook(() => useMeetings(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty('meetings');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('createMeeting');
      expect(result.current).toHaveProperty('updateMeeting');
      expect(result.current).toHaveProperty('deleteMeeting');

      expect(typeof result.current.createMeeting.mutate).toBe('function');
      expect(typeof result.current.updateMeeting.mutate).toBe('function');
      expect(typeof result.current.deleteMeeting.mutate).toBe('function');
    });
  });

  describe('slack integration', () => {
    it('should handle slack notification failure gracefully', async () => {
      const newMeeting = {
        title: 'Meeting with Slack Error',
        date: '2024-01-17',
        participants: ['John'],
        duration: '30 minutes',
        summary: 'Test meeting',
      };

      const createdMeeting = {
        id: '4',
        ...newMeeting,
        user_id: 'test-user-id',
      };

      // Mock successful database creation
      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: createdMeeting,
              error: null,
            }),
          }),
        }),
      });

      // Mock Slack service to fail silently (handled by try/catch in hook)
      mockSlackService.notifyMeetingCreated.mockImplementation(() => {
        throw new Error('Slack API error');
      });

      const { result } = renderHook(() => useMeetings(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.createMeeting.mutate(newMeeting);
      });

      // Should still be successful even if Slack fails
      await waitFor(() => {
        expect(result.current.createMeeting.isSuccess).toBe(true);
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Meeting created successfully',
      });
    });
  });
}); 