import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  fetchTodos: () => Promise<void>;
  addTodo: (todo: Omit<Todo, 'id' | 'completed'>) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

export const useStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      fetchTodos: async () => {
        if (get().todos.length > 0) {
          return;
        }
        const response = await fetch('https://dummyjson.com/todos');
        const data: { todos: Todo[] } = await response.json();
        set({ todos: data.todos });
      },
      addTodo: (newTodo) => {
        set((state) => ({
          todos: [
            {
              id: Date.now(),
              ...newTodo,
              completed: false,
            },
            ...state.todos,
          ],
        }));
      },
      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo,
          ),
        }));
      },
      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },
    }),
    { name: 'todos' },
  ),
);
