import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { useStore } from './store';

// Mock the store
vi.mock('./store', () => ({
  useStore: vi.fn(),
}));

// Mock child components
vi.mock('./components/AddTodoForm', () => ({
  default: () => <div data-testid="add-todo-form">Add Todo Form</div>,
}));

vi.mock('./components/TodoList', () => ({
  default: () => <div data-testid="todo-list">Todo List Component</div>,
}));

describe('App', () => {
  const mockFetchTodos = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      fetchTodos: mockFetchTodos,
    });
  });

  it('renders main app container', () => {
    render(<App />);

    const appContainer = screen.getByTestId('app-container');
    expect(appContainer).toBeInTheDocument();
  });

  it('renders app title', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Todo List')).toBeInTheDocument();
  });

  it('renders AddTodoForm component', () => {
    render(<App />);

    expect(screen.getByTestId('add-todo-form')).toBeInTheDocument();
  });

  it('renders TodoList component', () => {
    render(<App />);

    expect(screen.getByTestId('todo-list')).toBeInTheDocument();
  });

  it('calls fetchTodos on mount', () => {
    render(<App />);

    expect(mockFetchTodos).toHaveBeenCalledTimes(1);
  });

  it('has correct app structure', () => {
    render(<App />);

    const appContainer = screen.getByTestId('app-container');
    const title = screen.getByRole('heading', { level: 1 });
    const addForm = screen.getByTestId('add-todo-form');
    const todoList = screen.getByTestId('todo-list');

    expect(appContainer).toContainElement(title);
    expect(appContainer).toContainElement(addForm);
    expect(appContainer).toContainElement(todoList);
  });

  it('applies global styles', () => {
    render(<App />);

    // Check that the app container has the expected styling
    const appContainer = screen.getByTestId('app-container');
    expect(appContainer).toHaveStyle('text-align: center');
    expect(appContainer).toHaveStyle('max-width: 640px');
  });

  it('maintains component hierarchy', () => {
    render(<App />);

    const appContainer = screen.getByTestId('app-container');
    const title = appContainer.querySelector('h1');
    const addForm = appContainer.querySelector('[data-testid="add-todo-form"]');
    const todoList = appContainer.querySelector('[data-testid="todo-list"]');

    expect(title).toBeInTheDocument();
    expect(addForm).toBeInTheDocument();
    expect(todoList).toBeInTheDocument();
  });
});
