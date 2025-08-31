import React, { useState } from 'react';
import { useStore } from '../store';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
`;

const AddTodoForm: React.FC = () => {
  const [text, setText] = useState('');
  const { addTodo } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTodo({ todo: text });
    setText('');
  };

  return (
    <Form onSubmit={handleSubmit} aria-label="add todo form">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task"
        aria-label="New todo"
      />
      <button type="submit">Add</button>
    </Form>
  );
};

export default AddTodoForm;
