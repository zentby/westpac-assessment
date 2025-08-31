import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from './TodoItem';
import type { Todo } from '../store';

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: 1,
    todo: 'Test todo item',
    completed: false,
  };

  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders todo text and checkbox', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    expect(screen.getByText('Test todo item')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('displays todo text without line-through when not completed', () => {
    const incompleteTodo: Todo = { ...mockTodo, completed: false };
    render(
      <TodoItem
        todo={incompleteTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    const todoText = screen.getByText('Test todo item');
    expect(todoText).not.toHaveStyle('text-decoration: line-through');
  });

  it('displays todo text with line-through when completed', () => {
    const completedTodo: Todo = { ...mockTodo, completed: true };
    render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    const todoText = screen.getByText('Test todo item');
    expect(todoText).toHaveStyle('text-decoration: line-through');
  });

  it('shows checkbox as unchecked when todo is not completed', () => {
    const incompleteTodo: Todo = { ...mockTodo, completed: false };
    render(
      <TodoItem
        todo={incompleteTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('shows checkbox as checked when todo is completed', () => {
    const completedTodo: Todo = { ...mockTodo, completed: true };
    render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onToggle with todo id when checkbox is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledWith(1);
  });

  it('calls onToggle with correct id for different todo', () => {
    const differentTodo: Todo = {
      ...mockTodo,
      id: 42,
      todo: 'Different todo',
    };
    render(
      <TodoItem
        todo={differentTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledWith(42);
  });

  it('has correct accessibility label for checkbox', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    const checkbox = screen.getByLabelText('Complete Test todo item');
    expect(checkbox).toBeInTheDocument();
  });

  it('renders with different todo text', () => {
    const longTodo: Todo = {
      ...mockTodo,
      todo: 'This is a very long todo item that should still display properly',
    };
    render(
      <TodoItem
        todo={longTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    expect(
      screen.getByText(
        'This is a very long todo item that should still display properly',
      ),
    ).toBeInTheDocument();
  });

  it('handles special characters in todo text', () => {
    const specialTodo: Todo = {
      ...mockTodo,
      todo: 'Todo with special chars: !@#$%^&*()',
    };
    render(
      <TodoItem
        todo={specialTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    expect(
      screen.getByText('Todo with special chars: !@#$%^&*()'),
    ).toBeInTheDocument();
  });

  it('renders delete button', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls onDelete with todo id when delete button is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it('has correct accessibility label for delete button', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    const deleteButton = screen.getByLabelText('Delete Test todo item');
    expect(deleteButton).toBeInTheDocument();
  });
});
