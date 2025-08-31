import { render, screen } from '@testing-library/react';
import TodoList from './TodoList';
import { useStore } from '../store';
import type { Todo } from '../store';

vi.mock('../store', () => ({
  useStore: vi.fn(),
}));

describe('TodoList', () => {
  const mockTodos: Todo[] = [
    { id: 1, todo: 'First todo', completed: false },
    { id: 2, todo: 'Second todo', completed: true },
    { id: 3, todo: 'Third todo', completed: false },
  ];

  const mockToggleTodo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useStore).mockReturnValue({
      todos: mockTodos,
      toggleTodo: mockToggleTodo,
    });
  });

  it('renders list container', () => {
    render(<TodoList />);

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
  });

  it('renders all todo items', () => {
    render(<TodoList />);

    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('todo-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('todo-item-3')).toBeInTheDocument();
  });

  it('displays correct todo text for each item', () => {
    render(<TodoList />);

    expect(screen.getByText('First todo')).toBeInTheDocument();
    expect(screen.getByText('Second todo')).toBeInTheDocument();
    expect(screen.getByText('Third todo')).toBeInTheDocument();
  });

  it('shows correct checkbox states', () => {
    render(<TodoList />);

    const checkbox1 = screen.getByTestId('checkbox-1');
    const checkbox2 = screen.getByTestId('checkbox-2');
    const checkbox3 = screen.getByTestId('checkbox-3');

    expect(checkbox1).not.toBeChecked();
    expect(checkbox2).toBeChecked();
    expect(checkbox3).not.toBeChecked();
  });

  it('passes toggleTodo function to each TodoItem', () => {
    render(<TodoList />);

    const checkbox1 = screen.getByTestId('checkbox-1');
    checkbox1.click();

    expect(mockToggleTodo).toHaveBeenCalledWith(1);
  });

  it('renders empty list when no todos', () => {
    vi.mocked(useStore).mockReturnValue({
      todos: [],
      toggleTodo: mockToggleTodo,
    });

    render(<TodoList />);

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list.children).toHaveLength(0);
  });

  it('renders single todo item', () => {
    const singleTodo: Todo[] = [
      { id: 1, todo: 'Single todo', completed: false },
    ];
    vi.mocked(useStore).mockReturnValue({
      todos: singleTodo,
      toggleTodo: mockToggleTodo,
    });

    render(<TodoList />);

    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument();
    expect(screen.getByText('Single todo')).toBeInTheDocument();
    expect(screen.getByRole('list').children).toHaveLength(1);
  });

  it('handles todos with special characters', () => {
    const specialTodos: Todo[] = [
      { id: 1, todo: 'Todo with emojis 🎉🚀', completed: false },
      { id: 2, todo: 'Todo with symbols !@#$%', completed: true },
    ];

    vi.mocked(useStore).mockReturnValue({
      todos: specialTodos,
      toggleTodo: mockToggleTodo,
    });

    render(<TodoList />);

    expect(screen.getByText('Todo with emojis 🎉🚀')).toBeInTheDocument();
    expect(screen.getByText('Todo with symbols !@#$%')).toBeInTheDocument();
  });

  it('maintains correct order of todos', () => {
    render(<TodoList />);

    const list = screen.getByRole('list');
    const items = Array.from(list.children);

    expect(items[0]).toHaveTextContent('First todo');
    expect(items[1]).toHaveTextContent('Second todo');
    expect(items[2]).toHaveTextContent('Third todo');
  });
});
