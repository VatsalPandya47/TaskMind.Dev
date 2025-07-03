import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useZoomMeetings } from '../useZoomMeetings';

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

describe('useZoomMeetings', () => {
  let mockSupabase: any;
  let mockToast: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockSupabase = (global as any).mockSupabase;
    mockToast = (global as any).mockToast;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('fetching zoom meetings', () => {
    it('should fetch zoom meetings successfully', async () => {
      const mockMeetings = [
        {
          id: '1',
          user_id: 'test-user-id',
          zoom_meeting_id: '123456789',
          zoom_uuid: 'uuid-123',
          topic: 'Daily Standup',
          start_time: '2024-01-15T10:00:00Z',
          duration: 30,
          recording_files: [
            {
              id: 'recording-1',
              recording_type: 'shared_screen_with_speaker_view',
              download_url: 'https://zoom.us/download/recording1',
              play_url: 'https://zoom.us/play/recording1',
              file_type: 'MP4',
              file_size: 1024000,
              recording_start: '2024-01-15T10:00:00Z',
              recording_end: '2024-01-15T10:30:00Z',
            },
          ],
          transcript_file_url: null,
          meeting_id: null,
          created_at: '2024-01-15T09:00:00Z',
          updated_at: '2024-01-15T09:00:00Z',
        },
        {
          id: '2',
          user_id: 'test-user-id',
          zoom_meeting_id: '987654321',
          zoom_uuid: 'uuid-456',
          topic: 'Project Review',
          start_time: '2024-01-16T14:00:00Z',
          duration: 60,
          recording_files: [],
          transcript_file_url: 'https://zoom.us/transcript/meeting2.vtt',
          meeting_id: 'meeting-456',
          created_at: '2024-01-16T13:00:00Z',
          updated_at: '2024-01-16T13:00:00Z',
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

      const { result } = renderHook(() => useZoomMeetings(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.zoomMeetings).toEqual(mockMeetings);
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

      const { result } = renderHook(() => useZoomMeetings(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.error).toEqual(mockError);
      });

      expect(result.current.zoomMeetings).toEqual([]);
    });
  });

  describe('recording URL extraction', () => {
    it('should extract recording URLs correctly', () => {
      const meeting = {
        id: '1',
        user_id: 'test-user-id',
        zoom_meeting_id: '123456789',
        zoom_uuid: 'uuid-123',
        topic: 'Test Meeting',
        start_time: '2024-01-15T10:00:00Z',
        duration: 30,
        recording_files: [
          {
            id: 'recording-1',
            recording_type: 'shared_screen_with_speaker_view',
            download_url: 'https://zoom.us/download/recording1',
            play_url: 'https://zoom.us/play/recording1',
            file_type: 'MP4',
            file_size: 1024000,
            recording_start: '2024-01-15T10:00:00Z',
            recording_end: '2024-01-15T10:30:00Z',
          },
          {
            id: 'recording-2',
            recording_type: 'speaker_view',
            download_url: 'https://zoom.us/download/recording2',
            play_url: 'https://zoom.us/play/recording2',
            file_type: 'MP4',
            file_size: 512000,
            recording_start: '2024-01-15T10:00:00Z',
            recording_end: '2024-01-15T10:30:00Z',
          },
          {
            id: 'recording-3',
            recording_type: 'audio_only',
            download_url: 'https://zoom.us/download/recording3',
            play_url: 'https://zoom.us/play/recording3',
            file_type: 'M4A',
            file_size: 256000,
            recording_start: '2024-01-15T10:00:00Z',
            recording_end: '2024-01-15T10:30:00Z',
          },
        ],
        transcript_file_url: null,
        meeting_id: null,
        created_at: '2024-01-15T09:00:00Z',
        updated_at: '2024-01-15T09:00:00Z',
      };

      const { result } = renderHook(() => useZoomMeetings(), {
        wrapper: createWrapper(),
      });

      const recordingUrls = result.current.getRecordingUrls(meeting);

      // Should only include shared_screen_with_speaker_view and speaker_view
      expect(recordingUrls).toHaveLength(2);
      expect(recordingUrls[0]).toEqual({
        id: 'recording-1',
        recording_type: 'shared_screen_with_speaker_view',
        download_url: 'https://zoom.us/download/recording1',
        play_url: 'https://zoom.us/play/recording1',
        file_type: 'MP4',
        file_size: 1024000,
        recording_start: '2024-01-15T10:00:00Z',
        recording_end: '2024-01-15T10:30:00Z',
      });
      expect(recordingUrls[1]).toEqual({
        id: 'recording-2',
        recording_type: 'speaker_view',
        download_url: 'https://zoom.us/download/recording2',
        play_url: 'https://zoom.us/play/recording2',
        file_type: 'MP4',
        file_size: 512000,
        recording_start: '2024-01-15T10:00:00Z',
        recording_end: '2024-01-15T10:30:00Z',
      });
    });

    it('should handle meeting with no recording files', () => {
      const meeting = {
        id: '1',
        user_id: 'test-user-id',
        zoom_meeting_id: '123456789',
        zoom_uuid: 'uuid-123',
        topic: 'Test Meeting',
        start_time: '2024-01-15T10:00:00Z',
        duration: 30,
        recording_files: null,
        transcript_file_url: null,
        meeting_id: null,
        created_at: '2024-01-15T09:00:00Z',
        updated_at: '2024-01-15T09:00:00Z',
      };

      const { result } = renderHook(() => useZoomMeetings(), {
        wrapper: createWrapper(),
      });

      const recordingUrls = result.current.getRecordingUrls(meeting);
      expect(recordingUrls).toEqual([]);
    });

    it('should handle meeting with empty recording files array', () => {
      const meeting = {
        id: '1',
        user_id: 'test-user-id',
        zoom_meeting_id: '123456789',
        zoom_uuid: 'uuid-123',
        topic: 'Test Meeting',
        start_time: '2024-01-15T10:00:00Z',
        duration: 30,
        recording_files: [],
        transcript_file_url: null,
        meeting_id: null,
        created_at: '2024-01-15T09:00:00Z',
        updated_at: '2024-01-15T09:00:00Z',
      };

      const { result } = renderHook(() => useZoomMeetings(), {
        wrapper: createWrapper(),
      });

      const recordingUrls = result.current.getRecordingUrls(meeting);
      expect(recordingUrls).toEqual([]);
    });
  });

  describe('fetching recording data', () => {
    it('should fetch recording data successfully', async () => {
      const mockResponse = {
        success: true,
        recordingFiles: [
          {
            id: 'new-recording-1',
            recording_type: 'shared_screen_with_speaker_view',
            download_url: 'https://zoom.us/download/new-recording1',
            play_url: 'https://zoom.us/play/new-recording1',
            file_type: 'MP4',
            file_size: 2048000,
          },
        ],
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const { result } = renderHook(() => useZoomMeetings(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.fetchRecordingData.mutateAsync('123456789');
      });

      expect(result.current.fetchRecordingData.isSuccess).toBe(true);
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('get-meeting-recordings', {
        body: { zoomMeetingId: '123456789' },
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Recording data fetched successfully',
      });
    });

    it('should handle recording data fetch error', async () => {
      const mockError = new Error('Failed to fetch recordings');

      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const { result } = renderHook(() => useZoomMeetings(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.fetchRecordingData.mutateAsync('123456789');
        } catch (error) {
          expect(error.message).toBe('Failed to fetch recordings');
        }
      });

      expect(result.current.fetchRecordingData.isError).toBe(true);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to fetch recordings',
        variant: 'destructive',
      });
    });
  });

  describe('syncing meetings', () => {
    it('should sync meetings successfully', async () => {
      const mockResponse = {
        success: true,
        syncedCount: 5,
        message: 'Successfully synced 5 meetings',
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const { result } = renderHook(() => useZoomMeetings(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.syncMeetings.mutateAsync();
      });

      expect(result.current.syncMeetings.isSuccess).toBe(true);
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('sync-zoom-meetings');
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Synced 5 meetings successfully',
      });
    });

    it('should handle sync error', async () => {
      const mockError = new Error('Sync failed');

      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const { result } = renderHook(() => useZoomMeetings(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.syncMeetings.mutateAsync();
        } catch (error) {
          expect(error.message).toBe('Sync failed');
        }
      });

      expect(result.current.syncMeetings.isError).toBe(true);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Sync failed',
        variant: 'destructive',
      });
    });

    it('should handle sync with no synced count', async () => {
      const mockResponse = {
        success: true,
        message: 'Sync completed',
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const { result } = renderHook(() => useZoomMeetings(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.syncMeetings.mutateAsync();
      });

      expect(result.current.syncMeetings.isSuccess).toBe(true);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Synced 0 meetings successfully',
      });
    });
  });

  describe('extracting transcript', () => {
    it('should extract transcript successfully', async () => {
      const mockResponse = {
        success: true,
        tasksExtracted: 3,
        transcript: 'Meeting transcript content...',
        message: 'Transcript extracted and 3 tasks created',
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const { result } = renderHook(() => useZoomMeetings(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.extractTranscript.mutateAsync('123456789');
      });

      expect(result.current.extractTranscript.isSuccess).toBe(true);
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('extract-zoom-transcript', {
        body: { zoomMeetingId: '123456789' },
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success! 🎉',
        description: 'Transcript extracted and 3 tasks created',
      });
    });

    it('should handle no transcript file error with specific message', async () => {
      const mockError = new Error('No transcript file available for this meeting');

      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const { result } = renderHook(() => useZoomMeetings(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.extractTranscript.mutateAsync('123456789');
        } catch (error) {
          expect(error.message).toBe('No transcript file available for this meeting');
        }
      });

      expect(result.current.extractTranscript.isError).toBe(true);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'No transcript available for this meeting recording',
        variant: 'destructive',
      });
    });

    it('should handle rate limit error with specific message', async () => {
      const mockError = new Error('AI service rate limit exceeded');

      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const { result } = renderHook(() => useZoomMeetings(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.extractTranscript.mutateAsync('123456789');
        } catch (error) {
          expect(error.message).toBe('AI service rate limit exceeded');
        }
      });

      expect(result.current.extractTranscript.isError).toBe(true);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'AI service is busy. Please try again in a few minutes.',
        variant: 'destructive',
      });
    });

    it('should handle generic transcript extraction error', async () => {
      const mockError = new Error('Extraction failed');

      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const { result } = renderHook(() => useZoomMeetings(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.extractTranscript.mutateAsync('123456789');
        } catch (error) {
          expect(error.message).toBe('Extraction failed');
        }
      });

      expect(result.current.extractTranscript.isError).toBe(true);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Extraction failed',
        variant: 'destructive',
      });
    });

    it('should handle extract with no tasks extracted', async () => {
      const mockResponse = {
        success: true,
        tasksExtracted: 0,
        transcript: 'Short meeting transcript...',
        message: 'Transcript extracted but no tasks found',
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const { result } = renderHook(() => useZoomMeetings(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.extractTranscript.mutateAsync('123456789');
      });

      expect(result.current.extractTranscript.isSuccess).toBe(true);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success! 🎉',
        description: 'Transcript extracted and 0 tasks created',
      });
    });
  });

  describe('state management', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useZoomMeetings(), {
        wrapper: createWrapper(),
      });

      expect(result.current.zoomMeetings).toEqual([]);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.syncMeetings.isPending).toBe(false);
      expect(result.current.extractTranscript.isPending).toBe(false);
      expect(result.current.fetchRecordingData.isPending).toBe(false);
    });

    it('should expose all required methods and properties', () => {
      const { result } = renderHook(() => useZoomMeetings(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty('zoomMeetings');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('syncMeetings');
      expect(result.current).toHaveProperty('extractTranscript');
      expect(result.current).toHaveProperty('getRecordingUrls');
      expect(result.current).toHaveProperty('fetchRecordingData');

      expect(typeof result.current.syncMeetings.mutate).toBe('function');
      expect(typeof result.current.extractTranscript.mutate).toBe('function');
      expect(typeof result.current.getRecordingUrls).toBe('function');
      expect(typeof result.current.fetchRecordingData.mutate).toBe('function');
    });
  });

  describe('query invalidation', () => {
    it('should invalidate correct queries on successful sync', async () => {
      const mockResponse = {
        success: true,
        syncedCount: 2,
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const queryClient = new QueryClient();
      const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useZoomMeetings(), {
        wrapper: ({ children }) => {
          const { QueryClientProvider } = require('@tanstack/react-query');
          return QueryClientProvider({ client: queryClient, children });
        },
      });

      await act(async () => {
        await result.current.syncMeetings.mutateAsync();
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['zoom-meetings'] });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['meetings'] });
    });

    it('should invalidate correct queries on successful transcript extraction', async () => {
      const mockResponse = {
        success: true,
        tasksExtracted: 1,
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const queryClient = new QueryClient();
      const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useZoomMeetings(), {
        wrapper: ({ children }) => {
          const { QueryClientProvider } = require('@tanstack/react-query');
          return QueryClientProvider({ client: queryClient, children });
        },
      });

      await act(async () => {
        await result.current.extractTranscript.mutateAsync('123456789');
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['zoom-meetings'] });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['meetings'] });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['tasks'] });
    });
  });
}); 