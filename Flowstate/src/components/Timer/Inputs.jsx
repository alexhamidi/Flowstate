import React from 'react';

export function ToggleButton(props) {
    const { toggleTimer, isPlaying } = props;
    return <button className = 'timerButton' onClick={toggleTimer} id="toggle"> {isPlaying?'Pause':'Resume'} </button>;
}

export function ChangeTimeInput(props) {
    const { startTimer, setTimerValue, hasTimeElapsed, timerValue} = props


    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            startTimer();
        }
    };


    return (
        <>
            <input type = 'text' onChange={(e) => setTimerValue(e.target.value.substring(0, 5))} value={timerValue} id="changeTime" placeholder='mm:ss' onKeyDown={handleKeyDown} />
            <button className='timerButton' onClick={startTimer} id = 'timeButton'> {hasTimeElapsed?'Start':'Restart'} </button>
        </>
    )
}
