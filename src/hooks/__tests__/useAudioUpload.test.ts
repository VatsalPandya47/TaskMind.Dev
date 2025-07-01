import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useAudioUpload } from '../useAudioUpload';

describe('useAudioUpload', () => {
  let mockSupabase: any;
  let mockToast: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockSupabase = (global as any).mockSupabase;
    mockToast = (global as any).mockToast;
    
    // Setup default auth mock
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('file validation', () => {
    it('should accept valid mp3 file', async () => {
      const mockFile = new File(['audio content'], 'test.mp3', {
        type: 'audio/mpeg',
      });

      // Mock successful upload
      mockSupabase.storage.from.mockReturnValue({
        upload: vi.fn().mockResolvedValue({
          data: { path: 'test-user-id/2024-01-15T10-00-00-000Z.mp3' },
          error: null,
        }),
      });

      const { result } = renderHook(() => useAudioUpload());

      let uploadResult;
      await act(async () => {
        uploadResult = await result.current.uploadAudioFile(mockFile);
      });

      expect(uploadResult).toEqual({
        success: true,
        filePath: 'test-user-id/2024-01-15T10-00-00-000Z.mp3',
        fileName: 'test.mp3',
        fileSize: mockFile.size,
      });
    });

    it('should accept valid m4a file', async () => {
      const mockFile = new File(['audio content'], 'test.m4a', {
        type: 'audio/x-m4a',
      });

      mockSupabase.storage.from.mockReturnValue({
        upload: vi.fn().mockResolvedValue({
          data: { path: 'test-user-id/2024-01-15T10-00-00-000Z.m4a' },
          error: null,
        }),
      });

      const { result } = renderHook(() => useAudioUpload());

      let uploadResult;
      await act(async () => {
        uploadResult = await result.current.uploadAudioFile(mockFile);
      });

      expect(uploadResult).toEqual({
        success: true,
        filePath: 'test-user-id/2024-01-15T10-00-00-000Z.m4a',
        fileName: 'test.m4a',
        fileSize: mockFile.size,
      });
    });

    it('should accept valid wav file', async () => {
      const mockFile = new File(['audio content'], 'test.wav', {
        type: 'audio/wav',
      });

      mockSupabase.storage.from.mockReturnValue({
        upload: vi.fn().mockResolvedValue({
          data: { path: 'test-user-id/2024-01-15T10-00-00-000Z.wav' },
          error: null,
        }),
      });

      const { result } = renderHook(() => useAudioUpload());

      let uploadResult;
      await act(async () => {
        uploadResult = await result.current.uploadAudioFile(mockFile);
      });

      expect(uploadResult).toBeTruthy();
      expect(uploadResult.success).toBe(true);
    });

    it('should accept file with correct extension even if MIME type is unknown', async () => {
      const mockFile = new File(['audio content'], 'test.mp3', {
        type: 'application/octet-stream', // Unknown MIME type
      });

      mockSupabase.storage.from.mockReturnValue({
        upload: vi.fn().mockResolvedValue({
          data: { path: 'test-user-id/2024-01-15T10-00-00-000Z.mp3' },
          error: null,
        }),
      });

      const { result } = renderHook(() => useAudioUpload());

      let uploadResult;
      await act(async () => {
        uploadResult = await result.current.uploadAudioFile(mockFile);
      });

      expect(uploadResult.success).toBe(true);
    });

    it('should reject invalid file type', async () => {
      const mockFile = new File(['video content'], 'test.mp4', {
        type: 'video/mp4',
      });

      const { result } = renderHook(() => useAudioUpload());

      await act(async () => {
        try {
          await result.current.uploadAudioFile(mockFile);
        } catch (error) {
          expect(error.message).toBe('Only .mp3, .m4a, and .wav files are supported');
        }
      });

      expect(result.current.isUploading).toBe(false);
    });

    it('should reject file that is too large', async () => {
      // Create a file larger than 100MB
      const largeFileSize = 101 * 1024 * 1024; // 101MB
      const mockFile = new File(['large audio content'], 'large.mp3', {
        type: 'audio/mpeg',
      });
      
      // Mock file size
      Object.defineProperty(mockFile, 'size', {
        value: largeFileSize,
        writable: false,
      });

      const { result } = renderHook(() => useAudioUpload());

      await act(async () => {
        try {
          await result.current.uploadAudioFile(mockFile);
        } catch (error) {
          expect(error.message).toBe('File size must be less than 100MB');
        }
      });

      expect(result.current.isUploading).toBe(false);
    });

    it('should accept file at size limit', async () => {
      // Create a file exactly at 100MB limit
      const maxFileSize = 100 * 1024 * 1024; // 100MB
      const mockFile = new File(['audio content'], 'max-size.mp3', {
        type: 'audio/mpeg',
      });
      
      Object.defineProperty(mockFile, 'size', {
        value: maxFileSize,
        writable: false,
      });

      mockSupabase.storage.from.mockReturnValue({
        upload: vi.fn().mockResolvedValue({
          data: { path: 'test-user-id/2024-01-15T10-00-00-000Z.mp3' },
          error: null,
        }),
      });

      const { result } = renderHook(() => useAudioUpload());

      let uploadResult;
      await act(async () => {
        uploadResult = await result.current.uploadAudioFile(mockFile);
      });

      expect(uploadResult.success).toBe(true);
    });
  });

  describe('authentication', () => {
    it('should handle missing authentication', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Not authenticated'),
      });

      const mockFile = new File(['audio content'], 'test.mp3', {
        type: 'audio/mpeg',
      });

      const { result } = renderHook(() => useAudioUpload());

      await act(async () => {
        try {
          await result.current.uploadAudioFile(mockFile);
        } catch (error) {
          expect(error.message).toBe('Authentication required');
        }
      });

      expect(result.current.isUploading).toBe(false);
    });

    it('should handle authentication error', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Session expired'),
      });

      const mockFile = new File(['audio content'], 'test.mp3', {
        type: 'audio/mpeg',
      });

      const { result } = renderHook(() => useAudioUpload());

      await act(async () => {
        try {
          await result.current.uploadAudioFile(mockFile);
        } catch (error) {
          expect(error.message).toBe('Authentication required');
        }
      });
    });
  });

  describe('upload process', () => {
    it('should track upload progress and state', async () => {
      const mockFile = new File(['audio content'], 'test.mp3', {
        type: 'audio/mpeg',
      });

      mockSupabase.storage.from.mockReturnValue({
        upload: vi.fn().mockResolvedValue({
          data: { path: 'test-user-id/2024-01-15T10-00-00-000Z.mp3' },
          error: null,
        }),
      });

      const { result } = renderHook(() => useAudioUpload());

      // Initial state
      expect(result.current.isUploading).toBe(false);
      expect(result.current.uploadProgress).toBe(0);

      let uploadPromise;
      act(() => {
        uploadPromise = result.current.uploadAudioFile(mockFile);
      });

      // Should be uploading
      expect(result.current.isUploading).toBe(true);
      expect(result.current.uploadProgress).toBe(0);

      await act(async () => {
        await uploadPromise;
      });

      // Should be done
      expect(result.current.isUploading).toBe(false);
    });

    it('should generate unique filename with timestamp', async () => {
      const mockFile = new File(['audio content'], 'recording.mp3', {
        type: 'audio/mpeg',
      });

      const mockUpload = vi.fn().mockResolvedValue({
        data: { path: 'test-user-id/2024-01-15T10-00-00-000Z.mp3' },
        error: null,
      });

      mockSupabase.storage.from.mockReturnValue({
        upload: mockUpload,
      });

      const { result } = renderHook(() => useAudioUpload());

      await act(async () => {
        await result.current.uploadAudioFile(mockFile);
      });

      // Verify upload was called with user-specific path
      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringMatching(/^test-user-id\/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.mp3$/),
        mockFile,
        {
          cacheControl: '3600',
          upsert: false,
        }
      );
    });

    it('should handle upload error from Supabase', async () => {
      const mockFile = new File(['audio content'], 'test.mp3', {
        type: 'audio/mpeg',
      });

      const uploadError = new Error('Storage quota exceeded');
      mockSupabase.storage.from.mockReturnValue({
        upload: vi.fn().mockResolvedValue({
          data: null,
          error: uploadError,
        }),
      });

      const { result } = renderHook(() => useAudioUpload());

      await act(async () => {
        try {
          await result.current.uploadAudioFile(mockFile);
        } catch (error) {
          expect(error.message).toBe('Upload failed: Storage quota exceeded');
        }
      });

      expect(result.current.isUploading).toBe(false);
    });

    it('should handle missing Supabase client', async () => {
      // Mock getSupabase to return null
      vi.doMock('@/integrations/supabase/client', () => ({
        getSupabase: vi.fn().mockReturnValue(null),
      }));

      const mockFile = new File(['audio content'], 'test.mp3', {
        type: 'audio/mpeg',
      });

      const { result } = renderHook(() => useAudioUpload());

      await act(async () => {
        try {
          await result.current.uploadAudioFile(mockFile);
        } catch (error) {
          expect(error.message).toBe('Supabase client not available');
        }
      });
    });
  });

  describe('file name handling', () => {
    it('should preserve file extension', async () => {
      const testCases = [
        { fileName: 'recording.mp3', expectedExt: '.mp3' },
        { fileName: 'meeting.m4a', expectedExt: '.m4a' },
        { fileName: 'interview.wav', expectedExt: '.wav' },
        { fileName: 'audio.MP3', expectedExt: '.MP3' }, // Should preserve case
      ];

      for (const { fileName, expectedExt } of testCases) {
        const mockFile = new File(['content'], fileName, {
          type: 'audio/mpeg',
        });

        const mockUpload = vi.fn().mockResolvedValue({
          data: { path: `test-user-id/timestamp${expectedExt}` },
          error: null,
        });

        mockSupabase.storage.from.mockReturnValue({
          upload: mockUpload,
        });

        const { result } = renderHook(() => useAudioUpload());

        await act(async () => {
          await result.current.uploadAudioFile(mockFile);
        });

        expect(mockUpload).toHaveBeenCalledWith(
          expect.stringContaining(expectedExt),
          mockFile,
          expect.any(Object)
        );

        vi.clearAllMocks();
      }
    });

    it('should handle files with multiple dots in name', async () => {
      const mockFile = new File(['content'], 'my.audio.file.mp3', {
        type: 'audio/mpeg',
      });

      const mockUpload = vi.fn().mockResolvedValue({
        data: { path: 'test-user-id/timestamp.mp3' },
        error: null,
      });

      mockSupabase.storage.from.mockReturnValue({
        upload: mockUpload,
      });

      const { result } = renderHook(() => useAudioUpload());

      await act(async () => {
        await result.current.uploadAudioFile(mockFile);
      });

      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringContaining('.mp3'),
        mockFile,
        expect.any(Object)
      );
    });
  });

  describe('upload configuration', () => {
    it('should use correct storage bucket and options', async () => {
      const mockFile = new File(['content'], 'test.mp3', {
        type: 'audio/mpeg',
      });

      const mockUpload = vi.fn().mockResolvedValue({
        data: { path: 'test-path' },
        error: null,
      });

      const mockFrom = vi.fn().mockReturnValue({
        upload: mockUpload,
      });

      mockSupabase.storage.from = mockFrom;

      const { result } = renderHook(() => useAudioUpload());

      await act(async () => {
        await result.current.uploadAudioFile(mockFile);
      });

      // Verify correct bucket
      expect(mockFrom).toHaveBeenCalledWith('audio-files');

      // Verify upload options
      expect(mockUpload).toHaveBeenCalledWith(
        expect.any(String),
        mockFile,
        {
          cacheControl: '3600',
          upsert: false,
        }
      );
    });
  });

  describe('return value structure', () => {
    it('should return correct success structure', async () => {
      const mockFile = new File(['content'], 'test-recording.mp3', {
        type: 'audio/mpeg',
      });

      const mockPath = 'test-user-id/2024-01-15T10-00-00-000Z.mp3';
      mockSupabase.storage.from.mockReturnValue({
        upload: vi.fn().mockResolvedValue({
          data: { path: mockPath },
          error: null,
        }),
      });

      const { result } = renderHook(() => useAudioUpload());

      let uploadResult;
      await act(async () => {
        uploadResult = await result.current.uploadAudioFile(mockFile);
      });

      expect(uploadResult).toEqual({
        success: true,
        filePath: mockPath,
        fileName: 'test-recording.mp3',
        fileSize: mockFile.size,
      });
    });

    it('should have consistent error handling structure', async () => {
      const mockFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      });

      const { result } = renderHook(() => useAudioUpload());

      await act(async () => {
        try {
          await result.current.uploadAudioFile(mockFile);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(typeof error.message).toBe('string');
        }
      });
    });
  });

  describe('state reset', () => {
    it('should reset state after failed upload', async () => {
      const mockFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      });

      const { result } = renderHook(() => useAudioUpload());

      await act(async () => {
        try {
          await result.current.uploadAudioFile(mockFile);
        } catch {
          // Expected to fail
        }
      });

      // State should be reset
      expect(result.current.isUploading).toBe(false);
      expect(result.current.uploadProgress).toBe(0);
    });

    it('should reset state after successful upload', async () => {
      const mockFile = new File(['content'], 'test.mp3', {
        type: 'audio/mpeg',
      });

      mockSupabase.storage.from.mockReturnValue({
        upload: vi.fn().mockResolvedValue({
          data: { path: 'test-path' },
          error: null,
        }),
      });

      const { result } = renderHook(() => useAudioUpload());

      await act(async () => {
        await result.current.uploadAudioFile(mockFile);
      });

      expect(result.current.isUploading).toBe(false);
    });
  });
}); 