import type { Todo } from '../store';
import styled from 'styled-components';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const Item = styled.li`
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #ccc;
  gap: 12px;
`;

const TodoText = styled.span<{ $completed: boolean }>`
  text-decoration: ${(p) => (p.$completed ? 'line-through' : 'none')};
  flex: 1;
`;

const DeleteButton = styled.button`
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: #cc0000;
  }
`;

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <Item data-testid={`todo-item-${todo.id}`}>
      <input
        type="checkbox"
        data-testid={`checkbox-${todo.id}`}
        aria-label={`Complete ${todo.todo}`}
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <TodoText $completed={todo.completed}>{todo.todo}</TodoText>
      <DeleteButton
        onClick={() => onDelete(todo.id)}
        data-testid={`delete-${todo.id}`}
        aria-label={`Delete ${todo.todo}`}
      >
        Delete
      </DeleteButton>
    </Item>
  );
};

export default TodoItem;
