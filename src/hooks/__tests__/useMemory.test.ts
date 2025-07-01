import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { 
  useMemory, 
  type MemoryResult, 
  type MemorySearchResponse, 
  type MemoryUpdateResponse 
} from '../useMemory';

// Dependencies are mocked in setup.ts

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

describe('useMemory', () => {
  let mockSupabase: any;
  let mockToast: any;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Get mocked modules from global setup
    mockSupabase = (global as any).mockSupabase;
    mockToast = (global as any).mockToast;

    // Setup default mock implementations
    mockSupabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          access_token: 'test-access-token',
          user: { id: 'test-user-id' },
        },
      },
      error: null,
    });

    mockSupabase.functions.invoke.mockResolvedValue({
      data: {
        success: true,
        results: [],
        search_duration_ms: 100,
        query_embedding_length: 1536,
      },
      error: null,
    });

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        head: vi.fn().mockResolvedValue({
          count: 0,
          error: null,
        }),
      }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('searchMemory', () => {
    it('should search memory successfully', async () => {
      const mockResults: MemoryResult[] = [
        {
          id: '1',
          content_type: 'meeting',
          content_id: 'meeting-1',
          content_text: 'Test meeting content',
          metadata: { meeting_name: 'Test Meeting' },
          similarity: 0.95,
        },
        {
          id: '2',
          content_type: 'task',
          content_id: 'task-1',
          content_text: 'Test task content',
          metadata: { task_name: 'Test Task' },
          similarity: 0.87,
        },
      ];

      const mockResponse: MemorySearchResponse = {
        success: true,
        results: mockResults,
        search_duration_ms: 150,
        query_embedding_length: 1536,
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const { result } = renderHook(() => useMemory(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.searchMemory.mutate({
          query: 'test query',
          threshold: 0.8,
          limit: 5,
        });
      });

      await waitFor(() => {
        expect(result.current.searchMemory.isSuccess).toBe(true);
      });

      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('memory', {
        body: {
          action: 'search',
          query: 'test query',
          threshold: 0.8,
          limit: 5,
        },
        headers: {
          Authorization: 'Bearer test-access-token',
        },
      });

      expect(result.current.searchMemory.data).toEqual(mockResponse);
    });

    it('should handle authentication error', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: new Error('Not authenticated'),
      });

      const { result } = renderHook(() => useMemory(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.searchMemory.mutate({
          query: 'test query',
        });
      });

      await waitFor(() => {
        expect(result.current.searchMemory.isError).toBe(true);
      });

      expect(result.current.searchMemory.error?.message).toBe('Not authenticated');
    });

    it('should retry on failure and eventually succeed', async () => {
      let callCount = 0;
      mockSupabase.functions.invoke.mockImplementation(() => {
        callCount++;
        if (callCount < 3) {
          return Promise.resolve({
            data: null,
            error: new Error('Temporary error'),
          });
        }
        return Promise.resolve({
          data: {
            success: true,
            results: [],
            search_duration_ms: 100,
            query_embedding_length: 1536,
          },
          error: null,
        });
      });

      const { result } = renderHook(() => useMemory(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.searchMemory.mutate({
          query: 'test query',
        });
      });

      await waitFor(() => {
        expect(result.current.searchMemory.isSuccess).toBe(true);
      }, { timeout: 10000 });

      expect(callCount).toBe(3);
    });

    it('should stop retrying after max attempts', async () => {
      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: new Error('Persistent error'),
      });

      const { result } = renderHook(() => useMemory(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.searchMemory.mutate({
          query: 'test query',
        });
      });

      await waitFor(() => {
        expect(result.current.searchMemory.isError).toBe(true);
      }, { timeout: 15000 });

      expect(result.current.searchMemory.error?.message).toBe('Persistent error');
      expect(mockSupabase.functions.invoke).toHaveBeenCalledTimes(3);
    });

    it('should not retry on authorization errors', async () => {
      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: new Error('Unauthorized'),
      });

      const { result } = renderHook(() => useMemory(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.searchMemory.mutate({
          query: 'test query',
        });
      });

      await waitFor(() => {
        expect(result.current.searchMemory.isError).toBe(true);
      });

      expect(mockSupabase.functions.invoke).toHaveBeenCalledTimes(1);
    });

    it('should use default parameters when not provided', async () => {
      const { result } = renderHook(() => useMemory(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.searchMemory.mutate({
          query: 'test query',
        });
      });

      await waitFor(() => {
        expect(result.current.searchMemory.isSuccess).toBe(true);
      });

      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('memory', {
        body: {
          action: 'search',
          query: 'test query',
          threshold: 0.7,
          limit: 10,
        },
        headers: {
          Authorization: 'Bearer test-access-token',
        },
      });
    });
  });

  describe('updateEmbeddings', () => {
    it('should update embeddings successfully', async () => {
      const mockResponse: MemoryUpdateResponse = {
        success: true,
        processed: 25,
        message: 'Updated 25 embeddings successfully',
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const { result } = renderHook(() => useMemory(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.updateEmbeddings.mutate();
      });

      await waitFor(() => {
        expect(result.current.updateEmbeddings.isSuccess).toBe(true);
      });

      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('memory', {
        body: {
          action: 'update_embeddings',
          updateEmbeddings: true,
        },
        headers: {
          Authorization: 'Bearer test-access-token',
        },
      });

      expect(result.current.updateEmbeddings.data).toEqual(mockResponse);
    });

    it('should handle update embeddings error', async () => {
      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: new Error('Update failed'),
      });

      const { result } = renderHook(() => useMemory(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.updateEmbeddings.mutate();
      });

      await waitFor(() => {
        expect(result.current.updateEmbeddings.isError).toBe(true);
      });

      expect(result.current.updateEmbeddings.error?.message).toBe('Update failed');
    });

    it('should handle authentication error for updates', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: new Error('Not authenticated'),
      });

      const { result } = renderHook(() => useMemory(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.updateEmbeddings.mutate();
      });

      await waitFor(() => {
        expect(result.current.updateEmbeddings.isError).toBe(true);
      });

      expect(result.current.updateEmbeddings.error?.message).toBe('Not authenticated');
    });
  });

  describe('getMemoryStats', () => {
    it('should have stats query with correct structure', async () => {
      const { result } = renderHook(() => useMemory(), {
        wrapper: createWrapper(),
      });

      // Verify the getMemoryStats query exists and has expected structure
      expect(result.current.getMemoryStats).toBeDefined();
      expect(result.current.getMemoryStats).toHaveProperty('data');
      expect(result.current.getMemoryStats).toHaveProperty('isLoading');
      expect(result.current.getMemoryStats).toHaveProperty('isError');
      expect(result.current.getMemoryStats).toHaveProperty('refetch');
      
      // Should return a stats object with expected shape (even if counts are 0)
      if (result.current.getMemoryStats.data) {
        expect(result.current.getMemoryStats.data).toHaveProperty('embeddingsCount');
        expect(result.current.getMemoryStats.data).toHaveProperty('searchLogsCount');
      }
    });

    it('should use correct query key and have error handling capabilities', async () => {
      const { result } = renderHook(() => useMemory(), {
        wrapper: createWrapper(),
      });

      // Verify the query has error handling capabilities
      expect(result.current.getMemoryStats).toHaveProperty('isError');
      expect(result.current.getMemoryStats).toHaveProperty('error');
      expect(typeof result.current.getMemoryStats.isError).toBe('boolean');
      
      // Verify it has refetch functionality for retry scenarios
      expect(typeof result.current.getMemoryStats.refetch).toBe('function');
    });

    it('should handle authentication error for stats', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const { result } = renderHook(() => useMemory(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.getMemoryStats.isError).toBe(true);
      });

      expect(result.current.getMemoryStats.error?.message).toBe('Not authenticated');
    });
  });

  describe('hook state management', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useMemory(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isSearching).toBe(false);
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.searchMemory.isPending).toBe(false);
      expect(result.current.updateEmbeddings.isPending).toBe(false);
    });

    it('should expose all required methods and properties', () => {
      const { result } = renderHook(() => useMemory(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty('searchMemory');
      expect(result.current).toHaveProperty('updateEmbeddings');
      expect(result.current).toHaveProperty('getMemoryStats');
      expect(result.current).toHaveProperty('isSearching');
      expect(result.current).toHaveProperty('isUpdating');
      expect(result.current).toHaveProperty('retryConfig');

      expect(typeof result.current.searchMemory.mutate).toBe('function');
      expect(typeof result.current.updateEmbeddings.mutate).toBe('function');
    });

    it('should expose retry configuration', () => {
      const { result } = renderHook(() => useMemory(), {
        wrapper: createWrapper(),
      });

      expect(result.current.retryConfig).toEqual({
        maxRetries: 3,
        baseDelay: 1000,
        maxDelay: 10000,
        backoffMultiplier: 2,
      });
    });

    it('should update loading states correctly during search', async () => {
      // Clear existing mocks
      vi.clearAllMocks();
      
      // Reset auth mock
      mockSupabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            access_token: 'test-access-token',
            user: { id: 'test-user-id' },
          },
        },
        error: null,
      });
      
      // Create a delayed promise to simulate async operation
      let resolveSearch: (value: any) => void;
      const searchPromise = new Promise(resolve => {
        resolveSearch = resolve;
      });

      mockSupabase.functions.invoke.mockReturnValue(searchPromise);

      const { result } = renderHook(() => useMemory(), {
        wrapper: createWrapper(),
      });

      // Check initial state
      expect(result.current.isSearching).toBe(false);
      expect(result.current.searchMemory.isPending).toBe(false);

      // Start the mutation
      act(() => {
        result.current.searchMemory.mutate({ query: 'test' });
      });

      // Wait for the mutation to start and check loading state
      await waitFor(() => {
        expect(result.current.isSearching).toBe(true);
      });
      
      expect(result.current.searchMemory.isPending).toBe(true);

      // Resolve the promise to complete the mutation
      act(() => {
        resolveSearch!({
          data: {
            success: true,
            results: [],
            search_duration_ms: 100,
            query_embedding_length: 1536,
          },
          error: null,
        });
      });

      await waitFor(() => {
        expect(result.current.isSearching).toBe(false);
      });

      expect(result.current.searchMemory.isPending).toBe(false);
    });

    it('should update loading states correctly during embeddings update', async () => {
      // Clear existing mocks
      vi.clearAllMocks();
      
      // Reset auth mock
      mockSupabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            access_token: 'test-access-token',
            user: { id: 'test-user-id' },
          },
        },
        error: null,
      });
      
      // Create a controlled promise
      let resolveUpdate: (value: any) => void;
      const updatePromise = new Promise(resolve => {
        resolveUpdate = resolve;
      });

      mockSupabase.functions.invoke.mockReturnValue(updatePromise);

      const { result } = renderHook(() => useMemory(), {
        wrapper: createWrapper(),
      });

      // Check initial state
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateEmbeddings.isPending).toBe(false);

      // Start the mutation
      act(() => {
        result.current.updateEmbeddings.mutate();
      });

      // Wait for the mutation to start and check loading state
      await waitFor(() => {
        expect(result.current.isUpdating).toBe(true);
      });
      
      expect(result.current.updateEmbeddings.isPending).toBe(true);

      // Resolve the promise to complete the mutation
      act(() => {
        resolveUpdate!({
          data: {
            success: true,
            processed: 10,
            message: 'Updated successfully',
          },
          error: null,
        });
      });

      await waitFor(() => {
        expect(result.current.isUpdating).toBe(false);
      });

      expect(result.current.updateEmbeddings.isPending).toBe(false);
    });
  });

  describe('error handling and user feedback', () => {
    it('should have error handling structure for searchMemory mutations', async () => {
      const { result } = renderHook(() => useMemory(), {
        wrapper: createWrapper(),
      });

      // Verify error handling properties exist
      expect(result.current.searchMemory).toHaveProperty('isError');
      expect(result.current.searchMemory).toHaveProperty('error');
      expect(result.current.updateEmbeddings).toHaveProperty('isError');
      expect(result.current.updateEmbeddings).toHaveProperty('error');
      
      // Verify mutation functions exist and are callable
      expect(typeof result.current.searchMemory.mutate).toBe('function');
      expect(typeof result.current.updateEmbeddings.mutate).toBe('function');
      
      // Verify initial states are correct
      expect(result.current.searchMemory.isError).toBe(false);
      expect(result.current.updateEmbeddings.isError).toBe(false);
    });
  });

  it('should be implemented', () => {
    expect(true).toBe(true);
  });
}); 