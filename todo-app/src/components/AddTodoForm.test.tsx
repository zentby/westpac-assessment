import { render, screen, fireEvent } from '@testing-library/react';
import AddTodoForm from './AddTodoForm';
import { useStore } from '../store';

vi.mock('../store', () => ({
  useStore: vi.fn(),
}));

describe('AddTodoForm', () => {
  const mockAddTodo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useStore).mockReturnValue({
      addTodo: mockAddTodo,
    });
  });

  it('renders form with input and submit button', () => {
    render(<AddTodoForm />);

    expect(screen.getByLabelText('add todo form')).toBeInTheDocument();
    expect(screen.getByLabelText('New todo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    render(<AddTodoForm />);

    const input = screen.getByLabelText('New todo');
    fireEvent.change(input, { target: { value: 'New task' } });

    expect(input).toHaveValue('New task');
  });

  it('calls addTodo and clears input when form is submitted with valid text', () => {
    render(<AddTodoForm />);

    const input = screen.getByLabelText('New todo');
    const form = screen.getByLabelText('add todo form');

    fireEvent.change(input, { target: { value: 'New task' } });
    fireEvent.submit(form);

    expect(mockAddTodo).toHaveBeenCalledWith({ todo: 'New task' });
    expect(input).toHaveValue('');
  });

  it('does not call addTodo when form is submitted with empty text', () => {
    render(<AddTodoForm />);

    const form = screen.getByLabelText('add todo form');
    fireEvent.submit(form);

    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  it('does not call addTodo when form is submitted with whitespace only', () => {
    render(<AddTodoForm />);

    const input = screen.getByLabelText('New todo');
    const form = screen.getByLabelText('add todo form');

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(form);

    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  it('clears input after successful submission', () => {
    render(<AddTodoForm />);

    const input = screen.getByLabelText('New todo');
    const form = screen.getByLabelText('add todo form');

    fireEvent.change(input, { target: { value: 'New task' } });
    fireEvent.submit(form);

    expect(input).toHaveValue('');
  });

  it('maintains input value if submission fails validation', () => {
    render(<AddTodoForm />);

    const input = screen.getByLabelText('New todo');
    const form = screen.getByLabelText('add todo form');

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.submit(form);

    expect(input).toHaveValue('');
  });
});
