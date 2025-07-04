import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useZoomAuth } from '../useZoomAuth';

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

describe('useZoomAuth', () => {
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

  describe('fetching zoom token', () => {
    it('should fetch zoom token successfully', async () => {
      const mockToken = {
        id: '1',
        user_id: 'test-user-id',
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        scope: 'meeting:read',
        created_at: new Date().toISOString(),
      };

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: mockToken,
                error: null,
              }),
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useZoomAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.zoomToken).toEqual(mockToken);
      expect(result.current.isConnected).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should handle no token found', async () => {
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useZoomAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.zoomToken).toBeNull();
      expect(result.current.isConnected).toBe(false);
    });

    it('should handle expired token', async () => {
      const expiredToken = {
        id: '1',
        user_id: 'test-user-id',
        access_token: 'expired-token',
        refresh_token: 'test-refresh-token',
        expires_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        scope: 'meeting:read',
        created_at: new Date().toISOString(),
      };

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: expiredToken,
                error: null,
              }),
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useZoomAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.zoomToken).toEqual(expiredToken);
      expect(result.current.isConnected).toBe(false); // Expired token should not be connected
    });

    it('should handle fetch error', async () => {
      const fetchError = new Error('Database connection failed');

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: null,
                error: fetchError,
              }),
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useZoomAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.error).toEqual(fetchError);
      });
    });
  });

  describe('saving zoom token', () => {
    it.skip('should save zoom token successfully', async () => {
      const tokenData = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        scope: 'meeting:read',
      };

      const savedToken = {
        id: '2',
        user_id: 'test-user-id',
        ...tokenData,
        created_at: new Date().toISOString(),
      };

      // Mock both delete and insert operations
      let callCount = 0;
      mockSupabase.from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // First call: delete existing token
          return {
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          };
        } else {
          // Second call: insert new token
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: savedToken,
                  error: null,
                }),
              }),
            }),
          };
        }
      });

      const { result } = renderHook(() => useZoomAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.saveToken.mutate(tokenData);
      });

      await waitFor(() => {
        expect(result.current.saveToken.isSuccess).toBe(true);
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Zoom account connected successfully',
      });
    });

    it('should handle authentication error when saving token', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Not authenticated'),
      });

      const { result } = renderHook(() => useZoomAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.saveToken.mutate({
          access_token: 'test-token',
          expires_at: new Date().toISOString(),
        });
      });

      await waitFor(() => {
        expect(result.current.saveToken.isError).toBe(true);
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Not authenticated',
        variant: 'destructive',
      });
    });

    it.skip('should handle database error when saving token', async () => {
      const dbError = new Error('Insert failed');

      // Mock delete success then insert failure
      let callCount = 0;
      mockSupabase.from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // First call: delete existing token (success)
          return {
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          };
        } else {
          // Second call: insert new token (failure)
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: dbError,
                }),
              }),
            }),
          };
        }
      });

      const { result } = renderHook(() => useZoomAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.saveToken.mutate({
          access_token: 'test-token',
          expires_at: new Date().toISOString(),
        });
      });

      await waitFor(() => {
        expect(result.current.saveToken.isError).toBe(true);
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Insert failed',
        variant: 'destructive',
      });
    });
  });

  describe('disconnecting zoom', () => {
    it('should disconnect zoom successfully', async () => {
      mockSupabase.from.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: null,
          }),
        }),
      });

      const { result } = renderHook(() => useZoomAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.disconnectZoom.mutate();
      });

      await waitFor(() => {
        expect(result.current.disconnectZoom.isSuccess).toBe(true);
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Zoom account disconnected',
      });
    });

    it('should handle authentication error when disconnecting', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Not authenticated'),
      });

      const { result } = renderHook(() => useZoomAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.disconnectZoom.mutate();
      });

      await waitFor(() => {
        expect(result.current.disconnectZoom.isError).toBe(true);
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Not authenticated',
        variant: 'destructive',
      });
    });

    it('should handle delete error when disconnecting', async () => {
      const deleteError = new Error('Delete failed');

      mockSupabase.from.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: deleteError,
          }),
        }),
      });

      const { result } = renderHook(() => useZoomAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.disconnectZoom.mutate();
      });

      await waitFor(() => {
        expect(result.current.disconnectZoom.isError).toBe(true);
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Delete failed',
        variant: 'destructive',
      });
    });
  });

  describe('connection status', () => {
    it('should correctly identify connected status with valid token', async () => {
      const validToken = {
        id: '1',
        user_id: 'test-user-id',
        access_token: 'valid-token',
        refresh_token: 'test-refresh-token',
        expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        scope: 'meeting:read',
        created_at: new Date().toISOString(),
      };

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: validToken,
                error: null,
              }),
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useZoomAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isConnected).toBe(true);
    });

    it('should correctly identify disconnected status with expired token', async () => {
      const expiredToken = {
        id: '1',
        user_id: 'test-user-id',
        access_token: 'expired-token',
        refresh_token: 'test-refresh-token',
        expires_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        scope: 'meeting:read',
        created_at: new Date().toISOString(),
      };

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: expiredToken,
                error: null,
              }),
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useZoomAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isConnected).toBe(false);
    });

    it('should correctly identify disconnected status with no token', async () => {
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useZoomAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isConnected).toBe(false);
    });
  });

  describe('state management', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useZoomAuth(), {
        wrapper: createWrapper(),
      });

      expect(result.current.zoomToken).toBeUndefined();
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.isConnected).toBe(false);
      expect(result.current.saveToken.isPending).toBe(false);
      expect(result.current.disconnectZoom.isPending).toBe(false);
    });

    it('should expose all required methods and properties', () => {
      const { result } = renderHook(() => useZoomAuth(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty('zoomToken');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('isConnected');
      expect(result.current).toHaveProperty('saveToken');
      expect(result.current).toHaveProperty('disconnectZoom');

      expect(typeof result.current.saveToken.mutate).toBe('function');
      expect(typeof result.current.disconnectZoom.mutate).toBe('function');
    });
  });

  describe('token lifecycle', () => {
    it('should handle token replacement correctly', async () => {
      const oldTokenData = {
        access_token: 'old-token',
        refresh_token: 'old-refresh-token',
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        scope: 'meeting:read',
      };

      const newTokenData = {
        access_token: 'new-token',
        refresh_token: 'new-refresh-token',
        expires_at: new Date(Date.now() + 7200000).toISOString(),
        scope: 'meeting:read meeting:write',
      };

      // Mock delete call for old token
      let deleteCallCount = 0;
      const mockDelete = vi.fn().mockImplementation(() => {
        deleteCallCount++;
        return {
          eq: vi.fn().mockResolvedValue({ error: null }),
        };
      });

      // Mock insert call for new token
      let insertCallCount = 0;
      const mockInsert = vi.fn().mockImplementation(() => {
        insertCallCount++;
        return {
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: `token-${insertCallCount}`, user_id: 'test-user-id', ...newTokenData },
              error: null,
            }),
          }),
        };
      });

      mockSupabase.from.mockImplementation(() => ({
        delete: mockDelete,
        insert: mockInsert,
      }));

      const { result } = renderHook(() => useZoomAuth(), {
        wrapper: createWrapper(),
      });

      // Save first token
      await act(async () => {
        result.current.saveToken.mutate(oldTokenData);
      });

      await waitFor(() => {
        expect(result.current.saveToken.isSuccess).toBe(true);
      });

      // Save second token (should replace first)
      await act(async () => {
        result.current.saveToken.mutate(newTokenData);
      });

      await waitFor(() => {
        expect(result.current.saveToken.isSuccess).toBe(true);
      });

      // Verify delete was called twice (once for each save)
      expect(deleteCallCount).toBe(2);
      // Verify insert was called twice
      expect(insertCallCount).toBe(2);
    });
  });
}); 