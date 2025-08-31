import { useStore } from '../store';
import TodoItem from './TodoItem';
import styled from 'styled-components';

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const TodoList: React.FC = () => {
  const { todos, toggleTodo, deleteTodo } = useStore();

  return (
    <List>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      ))}
    </List>
  );
};

export default TodoList;
