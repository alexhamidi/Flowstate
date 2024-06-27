import React from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

export default function ToDoCard(props) {
    const { children, deleteTodo, editTodo, index, todo, handleOnDrag} = props;

    const [open, setOpen] = useState(false);

    let menuRef = useRef(null);

    useEffect(()=>{ 
        let handler = () => {
            setOpen(false);
        }
        document.addEventListener('mouseup', handler);

        return () => {
            document.removeEventListener('mouseup', handler);
        };
    });

    

    return (
        <li className='todoItem'
        draggable
        onDragStart = {(e) => {handleOnDrag(e, todo)}}>
            <p id = 'todoCardText'>{todo}</p>
            <div className='right'>
                <i onClick ={()=>setOpen(!open)} className="fa-solid fa-ellipsis"/>
                <div className = {`todoMenu ${open?'todoMenuActive':'todoMenuInactive'}`} ref = {menuRef}>
                    <button className = 'delete' onClick={() => deleteTodo(index)}> delete </button>
                    <button className = 'edit' onClick={() => editTodo(index)}> edit </button>
                </div>
            </div>
        </li>
    );
}
