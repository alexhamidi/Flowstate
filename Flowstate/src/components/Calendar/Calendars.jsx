import React, { useEffect } from 'react'

export default function Calendars(props) {
    const  {todosOnBoard, handleOnDrop, handleDragOver, handleDeleteFromBoard, setTodosOnBoardMap, todosOnBoardMap} = props

    
    useEffect(() => {
        const newTodosOnBoardMap = {};
        todosOnBoard.forEach(todo => {
            const key = `${todo.day}-${todo.time}`;
            newTodosOnBoardMap[key] = todo;
        });
        setTodosOnBoardMap(newTodosOnBoardMap);
    }, [todosOnBoard]);

    function hasTodoOnBoard(day, time) {
        const key = `${day}-${time}`;
        return todosOnBoardMap.hasOwnProperty(key);
    }
    
    let times = [];
    for (let i = 8; i < 24; i++) {
        times.push(i);
    }

    let days = [];
    for (let i = 0; i < 7; i++) {
        days.push(i);
    }

    let dayMap = {
        0: 'Monday',
        1: 'Tuesday',
        2: 'Wednesday',
        3: 'Thursday',
        4: 'Friday',
        5: 'Saturday',
        6: 'Sunday', 
    };

    return (
        <div id='calendarContainer'>
            <header> This Week</header>
            <div className = 'days'>
                <Times times = {times}/>
                <Days days = {days} times = {times} dayMap = {dayMap}/>
            </div>
        </div>
    )

    function Days(props) {
        const {days, times, dayMap} = props;
        return (
            <div className = 'days'>
                {days.map((day, index) => (
                    <Day day = {day} key = {index} times = {times} dayMap = {dayMap}/>
                ))}
            </div>
        )
    }


    function Day(props) {
        const {day, times, dayMap } = props;
        return (
            <div className='day'>
                 <hr />
                {dayMap[day]}
                {times.map((time, index) => (
                    <div key={index}>
                        <hr />
                        <Dayblock time={time} day={day} />
                    </div>
                ))}
            </div>
        );
    }

    function handleOnClick () {
        //remove somehow
    }

    function Dayblock (props) {
        const {time, day} = props 
        return (
            <div className='dayblock' onDrop={(e) => handleOnDrop(e, day, time)} onDragOver={handleDragOver} onClick = {handleOnClick}>
                {hasTodoOnBoard(day, time) && <EventInDayBlock time={time} day={day} />}
            </div>
        );
    }

    function Times(props) {
        const {times} = props
        return (
            <div className='times'>
                <hr />
                Times
                {times.map((time, index) => (
                    <div key={index}>
                        <hr />
                        <Time time={time} key = {index}/>
                    </div>
                ))}
            </div>
        )
    }

    function Time (props) {
        const {time} = props;
        return (
            <div className='time'>{(time%12===0?12:time%12) + ' ' + (time<12?'am':'pm')}</div>
        );
    }



    function EventInDayBlock(props) {
        const { time, day } = props;
        const key = `${day}-${time}`;
        const todo = todosOnBoardMap[key];
    
        const handleClick = () => {
            if (todo) {
                handleDeleteFromBoard(todo.todo, day, time);
            }
        };
        
        return todo ? <div onClick={handleClick} className='boardTodo'>{todo.todo}</div> : null;
    }

}

