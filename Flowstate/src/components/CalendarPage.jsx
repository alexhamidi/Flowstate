import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ToDoInput from './Calendar/ToDoInput';
import ToDoList from './Calendar/ToDoList';
import Calendars from './Calendar/Calendars';
import { useNavigate } from 'react-router-dom';

export default function CalendarPage() {
    const [token, setToken] = useState('');
    const [todos, setTodos] = useState([]);
    const [todoValue, setTodoValue] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [todosOnBoard, setTodosOnBoard] = useState([]);
    const [todosOnBoardMap, setTodosOnBoardMap] = useState({});
    const [todosOnBoardLoaded, setTodosOnBoardLoaded] = useState(false); // Track loaded state
    const navigate = useNavigate();

    useEffect(() => {
        const t = localStorage.getItem('token');
        if (t) {
            setAuthenticated(true);
            setToken(t);
        } else {
            setAuthenticated(false);
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:443/api/todos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
            .then(response => response.data)
            .then(data => setTodos(data))
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    console.error('Error:', error);
                }
            });
        }
    }, [token, navigate]);

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:443/api/boardtodos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
            .then(response => response.data)
            .then(data => {
                let newTodosOnBoard = data.map(item => ({
                    todo: item.todo,
                    day: item.day,
                    time: item.time
                }));
                setTodosOnBoard(newTodosOnBoard);
                setTodosOnBoardLoaded(true); // Set loaded to true when data is fetched
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    console.error('Error:', error);
                }
            });
        }
    }, [token, navigate]);

    function addTodos(newTodo) {
        setTodos(prevTodos => Array.isArray(prevTodos) ? [...prevTodos, newTodo] : [newTodo]);
        axios.post('http://localhost:443/api/todos',
            { newTodo },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        .catch(error => console.error('Error:', error));
    }

    function deleteTodo(index) {
        const todoToBeDeleted = todos[index];
        const newTodos = todos.filter((todo, idx) => idx !== index); 
        setTodos(newTodos);

        axios.delete('http://localhost:443/api/todos',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: {
                    todo: todoToBeDeleted
                }
            }
        )
        .catch(error => console.error('Error:', error));
    }

    function editTodo(index) {
        const todo = todos[index];
        setTodoValue(todo);
        deleteTodo(index);
    }

    function addTodoToBoard(todo, day, time) {
        const newTodo = {
            time: time,
            day: day,
            todo: todo
        };

        setTodosOnBoard(prevTodosOnBoard => 
            Array.isArray(prevTodosOnBoard) ? [...prevTodosOnBoard, newTodo] : [newTodo]
        );
        
        axios.post('http://localhost:443/api/boardtodos',
            {
                time: time,
                day: day,
                todo: todo
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        .catch(error => console.error('Error:', error));
    }

    function handleOnDrag(e, todo) {
        e.dataTransfer.setData("todo", todo);
        /* DB MANIP */
    }

    function handleOnDrop(e, day, time) {
        const todo = e.dataTransfer.getData("todo");
        addTodoToBoard(todo, day, time);
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    useEffect(() => {
        const newTodosOnBoardMap = {};
        todosOnBoard.forEach(todo => {
            const key = `${todo.day}-${todo.time}`;
            newTodosOnBoardMap[key] = todo;
        });
        setTodosOnBoardMap(newTodosOnBoardMap);
    }, [todosOnBoard]);

    function handleDeleteFromBoard(todo, day, time) {
        setTodosOnBoard(prevTodosOnBoard => 
            prevTodosOnBoard.filter(t => 
                !(t.time === time && t.day === day && t.todo === todo)
            )
        );

        axios.delete('http://localhost:443/api/boardtodos', {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {  
                todo: todo,
                day: day,
                time: time,
            }
        })
        .catch(error => {
            console.error('Error deleting todo from board:', error);
        });
    }

    return (
        <main id="calMain">
            {authenticated ? (
                <>
                    <ToDoInput addTodos={addTodos} todoValue={todoValue} setTodoValue={setTodoValue} />
                    <section id='calendarArea'>
                        {todosOnBoardLoaded && (
                            <Calendars
                                todosOnBoard={todosOnBoard}
                                handleOnDrop={handleOnDrop}
                                handleDragOver={handleDragOver}
                                handleDeleteFromBoard={handleDeleteFromBoard}
                                setTodosOnBoardMap = {setTodosOnBoardMap}
                                todosOnBoardMap={todosOnBoardMap}
                            />
                        )}
                        <div id='itemsContainer'>
                            <header>Tasks</header>
                            {todos && <ToDoList deleteTodo={deleteTodo} editTodo={editTodo} todos={todos} handleOnDrag={handleOnDrag} />}
                        </div>
                    </section>
                </>
            ) : (
                <div>Loading...</div>
            )}
        </main>
    );
}



/*


        // axios.delete('http://localhost:443/api/boardtodos', {
        //     headers: { 'Authorization': `Bearer ${token}` },
        //     data: {  
        //         todo: todo,
        //         day: day,
        //         time: time,
        //     }
        // })
        // .catch(error => {
        //     console.error('Error deleting todo from board:', error);
        //     setTodosOnBoard(prevTodosOnBoard => [...prevTodosOnBoard, { time, day, todo }]);
        // });
*/