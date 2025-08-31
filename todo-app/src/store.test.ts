import { useStore, type Todo } from './store';
import { act } from '@testing-library/react';

const mockTodos: Todo[] = [
  { id: 1, todo: 'Test todo 1', completed: false },
  { id: 2, todo: 'Test todo 2', completed: true },
];

vi.stubGlobal(
  'fetch',
  vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ todos: mockTodos }),
    }),
  ),
);

describe('Zustand Store: useStore', () => {
  const initialState = useStore.getState();
  beforeEach(() => {
    act(() => {
      useStore.setState(initialState, true);
    });
    vi.clearAllMocks();
  });

  it('should have an empty array of todos initially', () => {
    const { todos } = useStore.getState();
    expect(todos).toEqual([]);
  });

  describe('addTodo', () => {
    let dateNowSpy: ReturnType<typeof vi.spyOn>;
    let idCounter = Date.now();

    beforeEach(() => {
      dateNowSpy = vi.spyOn(Date, 'now').mockImplementation(() => idCounter++);
    });

    afterEach(() => {
      dateNowSpy.mockRestore();
    });

    it('should add a new todo', () => {
      const newTodo = { todo: 'A new task' };
      const expectedId = idCounter;

      act(() => {
        useStore.getState().addTodo(newTodo);
      });

      const { todos } = useStore.getState();
      expect(todos.length).toBe(1);
      expect(todos[0]).toEqual({
        id: expectedId,
        todo: 'A new task',
        completed: false,
      });
    });

    it('should add a new todo to the beginning of the list', () => {
      const firstId = idCounter;
      act(() => {
        useStore.getState().addTodo({ todo: 'First task' });
      });

      const secondId = idCounter;
      act(() => {
        useStore.getState().addTodo({ todo: 'Second task' });
      });

      const { todos } = useStore.getState();
      expect(todos.length).toBe(2);
      expect(todos[0].todo).toBe('Second task');
      expect(todos[0].id).toBe(secondId);
      expect(todos[1].todo).toBe('First task');
      expect(todos[1].id).toBe(firstId);
    });
  });

  describe('toggleTodo', () => {
    beforeEach(() => {
      // Set up some initial todos for toggling tests
      act(() => {
        useStore.setState({
          todos: [
            { id: 1, todo: 'Task 1', completed: false },
            { id: 2, todo: 'Task 2', completed: true },
          ],
        });
      });
    });

    it('should toggle an incomplete todo to completed', () => {
      act(() => {
        useStore.getState().toggleTodo(1);
      });
      const todo = useStore.getState().todos.find((t) => t.id === 1);
      expect(todo?.completed).toBe(true);
    });

    it('should toggle a completed todo to incomplete', () => {
      act(() => {
        useStore.getState().toggleTodo(2);
      });
      const todo = useStore.getState().todos.find((t) => t.id === 2);
      expect(todo?.completed).toBe(false);
    });

    it('should not affect other todos when toggling', () => {
      const initialTodo2State = useStore
        .getState()
        .todos.find((t) => t.id === 2)?.completed;

      act(() => {
        useStore.getState().toggleTodo(1);
      });

      const todo1 = useStore.getState().todos.find((t) => t.id === 1);
      const todo2 = useStore.getState().todos.find((t) => t.id === 2);

      expect(todo1?.completed).toBe(true);
      expect(todo2?.completed).toBe(initialTodo2State);
    });

    it('should do nothing for a non-existent todo id', () => {
      const initialTodos = [...useStore.getState().todos];
      act(() => {
        useStore.getState().toggleTodo(999); // non-existent id
      });
      const finalTodos = useStore.getState().todos;
      expect(finalTodos).toEqual(initialTodos);
    });
  });

  describe('fetchTodos', () => {
    it('should fetch and set todos if the store is empty', async () => {
      await act(async () => {
        await useStore.getState().fetchTodos();
      });

      const { todos } = useStore.getState();
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('https://dummyjson.com/todos');
      expect(todos).toEqual(mockTodos);
    });

    it('should not fetch todos if the store already has todos', async () => {
      act(() => {
        useStore.setState({
          todos: [{ id: 1, todo: 'Existing todo', completed: false }],
        });
      });

      await act(async () => {
        await useStore.getState().fetchTodos();
      });

      expect(fetch).not.toHaveBeenCalled();
      const { todos } = useStore.getState();
      expect(todos.length).toBe(1);
      expect(todos[0].todo).toBe('Existing todo');
    });
  });

  describe('deleteTodo', () => {
    beforeEach(() => {
      // Set up some initial todos for deletion tests
      act(() => {
        useStore.setState({
          todos: [
            { id: 1, todo: 'Task 1', completed: false },
            { id: 2, todo: 'Task 2', completed: true },
            { id: 3, todo: 'Task 3', completed: false },
          ],
        });
      });
    });

    it('should delete a todo by id', () => {
      act(() => {
        useStore.getState().deleteTodo(2);
      });
      const todos = useStore.getState().todos;
      expect(todos.length).toBe(2);
      expect(todos.find((t) => t.id === 2)).toBeUndefined();
      expect(todos.find((t) => t.id === 1)).toBeDefined();
      expect(todos.find((t) => t.id === 3)).toBeDefined();
    });

    it('should not affect other todos when deleting', () => {
      act(() => {
        useStore.getState().deleteTodo(2);
      });
      const todos = useStore.getState().todos;
      expect(todos.find((t) => t.id === 1)?.completed).toBe(false);
      expect(todos.find((t) => t.id === 3)?.completed).toBe(false);
    });

    it('should do nothing for a non-existent todo id', () => {
      const initialTodos = [...useStore.getState().todos];
      act(() => {
        useStore.getState().deleteTodo(999); // non-existent id
      });
      const finalTodos = useStore.getState().todos;
      expect(finalTodos).toEqual(initialTodos);
    });

    it('should handle deleting the last todo', () => {
      act(() => {
        useStore.setState({
          todos: [{ id: 1, todo: 'Last task', completed: false }],
        });
      });

      act(() => {
        useStore.getState().deleteTodo(1);
      });

      const { todos } = useStore.getState();
      expect(todos.length).toBe(0);
    });
  });
});
