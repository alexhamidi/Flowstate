import React from 'react';
import ToDoCard from './ToDoCard';

export default function ToDoList(props) {
    const {todos, deleteTodo , editTodo, handleOnDrag} = props;
    
    return (
        <ul className='items'>
            {todos.map((todo, index) => (
                <ToDoCard key={index} index = {index} todo={todo} deleteTodo={deleteTodo} editTodo={editTodo} handleOnDrag={handleOnDrag}/>
            ))}
        </ul>
    );
}
