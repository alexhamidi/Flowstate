import React, { useState } from 'react'; 

export default function TodoForm(props) {
    const { addTodos, todoValue, setTodoValue } = props;

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (todoValue.trim() !== '') {
            addTodos(todoValue);
            setTodoValue('');
        }
    };
    return (
        <div id='addTasks'>
            <input
                placeholder="Enter item"
                value={todoValue}
                onChange={(e) => setTodoValue(e.target.value)}
                onKeyDown={handleKeyDown} 
            />
            <button type="button" id="add" onClick={handleSubmit}>
                Add
            </button>
        </div>
    );
}
