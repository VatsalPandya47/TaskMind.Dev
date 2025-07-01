import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useTasks, type Task, type TaskInsert } from '../useTasks';

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

describe('useTasks', () => {
  let mockSupabase: any;
  let mockToast: any;
  let mockSlackService: any;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Get mocked modules from global setup
    mockSupabase = (global as any).mockSupabase;
    mockToast = (global as any).mockToast;
    mockSlackService = (global as any).mockSlackService;

    // Setup default mock implementations
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }),
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: null,
        }),
      }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('fetching tasks', () => {
    it('should fetch tasks successfully', async () => {
      const mockTasks: Task[] = [
        {
          id: '1',
          task: 'Test Task 1',
          description: 'Test Description 1',
          assignee: 'John Doe',
          due_date: '2024-01-01',
          priority: 'high',
          meeting_id: 'meeting-1',
          completed: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          user_id: 'test-user-id',
        },
        {
          id: '2',
          task: 'Test Task 2',
          description: 'Test Description 2',
          assignee: 'Jane Doe',
          due_date: '2024-01-02',
          priority: 'medium',
          meeting_id: 'meeting-2',
          completed: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          user_id: 'test-user-id',
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: mockTasks,
            error: null,
          }),
        }),
      });

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.tasks).toEqual(mockTasks);
      expect(result.current.error).toBeNull();
    });

    it('should handle fetch error', async () => {
      const mockError = new Error('Failed to fetch tasks');

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: null,
            error: mockError,
          }),
        }),
      });

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.tasks).toEqual([]);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('creating tasks', () => {
    it('should create a task successfully', async () => {
      const newTask: TaskInsert = {
        task: 'New Task',
        description: 'New Task Description',
        assignee: 'John Doe',
        due_date: '2024-01-01',
        priority: 'high',
        meeting_id: 'meeting-1',
      };

      const createdTask: Task = {
        id: 'new-task-id',
        ...newTask,
        completed: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        user_id: 'test-user-id',
      };

      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: createdTask,
              error: null,
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.createTask.mutate(newTask);
      });

      await waitFor(() => {
        expect(result.current.createTask.isSuccess).toBe(true);
      });

      // Verify Supabase was called correctly
      expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
      expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    });

    it('should handle authentication error when creating task', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Not authenticated'),
      });

      const newTask: TaskInsert = {
        task: 'New Task',
        assignee: 'John Doe',
        priority: 'high',
      };

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.createTask.mutate(newTask);
      });

      await waitFor(() => {
        expect(result.current.createTask.isError).toBe(true);
      });

      expect(result.current.createTask.error?.message).toBe('Not authenticated');
    });

    it('should handle Supabase error when creating task', async () => {
      const mockError = new Error('Database error');

      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: mockError,
            }),
          }),
        }),
      });

      const newTask: TaskInsert = {
        task: 'New Task',
        assignee: 'John Doe',
        priority: 'high',
      };

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.createTask.mutate(newTask);
      });

      await waitFor(() => {
        expect(result.current.createTask.isError).toBe(true);
      });
    });
  });

  describe('updating tasks', () => {
    it('should update a task successfully', async () => {
      const taskUpdate = {
        id: 'task-1',
        completed: true,
        priority: 'low',
      };

      const updatedTask: Task = {
        id: 'task-1',
        task: 'Updated Task',
        assignee: 'John Doe',
        priority: 'low',
        completed: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        user_id: 'test-user-id',
      };

      mockSupabase.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: updatedTask,
                error: null,
              }),
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.updateTask.mutate(taskUpdate);
      });

      await waitFor(() => {
        expect(result.current.updateTask.isSuccess).toBe(true);
      });

      // Verify Slack notification for completed task
      expect(mockSlackService.notifyTaskCompleted).toHaveBeenCalledWith(updatedTask);
    });

    it('should handle update error', async () => {
      const mockError = new Error('Update failed');

      mockSupabase.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: mockError,
              }),
            }),
          }),
        }),
      });

      const taskUpdate = {
        id: 'task-1',
        completed: true,
      };

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.updateTask.mutate(taskUpdate);
      });

      await waitFor(() => {
        expect(result.current.updateTask.isError).toBe(true);
      });
    });
  });

  describe('deleting tasks', () => {
    it('should delete a task successfully', async () => {
      mockSupabase.from.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: null,
          }),
        }),
      });

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.deleteTask.mutate('task-1');
      });

      await waitFor(() => {
        expect(result.current.deleteTask.isSuccess).toBe(true);
      });

      // Verify Supabase was called correctly
      expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
    });

    it('should handle delete error', async () => {
      const mockError = new Error('Delete failed');

      mockSupabase.from.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: mockError,
          }),
        }),
      });

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.deleteTask.mutate('task-1');
      });

      await waitFor(() => {
        expect(result.current.deleteTask.isError).toBe(true);
      });
    });
  });

  describe('state management', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(),
      });

      expect(result.current.tasks).toEqual([]);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.createTask.isPending).toBe(false);
      expect(result.current.updateTask.isPending).toBe(false);
      expect(result.current.deleteTask.isPending).toBe(false);
    });

    it('should expose all required methods and properties', () => {
      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty('tasks');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('createTask');
      expect(result.current).toHaveProperty('updateTask');
      expect(result.current).toHaveProperty('deleteTask');

      expect(typeof result.current.createTask.mutate).toBe('function');
      expect(typeof result.current.updateTask.mutate).toBe('function');
      expect(typeof result.current.deleteTask.mutate).toBe('function');
    });
  });
}); 