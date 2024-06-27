import React  from 'react';
import { ToggleButton, ChangeTimeInput } from './Inputs'; 
import CircleTimer from './CircleTimer'; 
import { useState } from 'react';
import TimerMessage from './TimerMessage';


export default function Timer (props)  {
    const {scenicMode} = props
    const [timer, setTimer] = useState('00:00');
    const [timerValue, setTimerValue] = useState('00:00');
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasTimeElapsed, setHasTimeElapsed] = useState(true);
    const [key, setKey] = useState(0);
    const [displayMessage, setDisplayMessage] = useState(false);

    function toggleTimer() {
        setIsPlaying(!isPlaying);
    }

    function startTimer() {
        if (hasTimeElapsed) {
            if (timerValue != '00:00') {
                setDisplayMessage(false);
                setTimer(timerValue);
                setKey(timer)
                setIsPlaying(true);
                setHasTimeElapsed(false);
            }

        } else {
            setTimer('00:00');
            setKey((prevKey) => prevKey + 1); // Increment key to reset CountdownCircleTimer
            setIsPlaying(false);
            setHasTimeElapsed(true);
        }
    }

    const handleTimerComplete = () => {
        if (isPlaying) {
            setDisplayMessage(true);
        }
        setIsPlaying(false); 
        setHasTimeElapsed(true);
        setTimer('00:00');
        setKey(timer);
        return { shouldRepeat: false }; 
    };

    function handleMessageOnClick () {
        setDisplayMessage(false);
    }

    return (
        <div id='timerArea'>
            {displayMessage && <TimerMessage handleMessageOnClick = {handleMessageOnClick}/>}
            <div id='circleTimer'>
                <CircleTimer 
                    scenicMode = {scenicMode}
                    timer = {timer} 
                    isPlaying = {isPlaying} 
                    setTimer = {setTimer} 
                    setIsPlaying = {setIsPlaying} 
                    setHasTimeElapsed = {setHasTimeElapsed} 
                    ki = {key} 
                    handleTimerComplete = {handleTimerComplete} 
                    />
            </div>
            <div id='buttons'>
                <ToggleButton toggleTimer={toggleTimer} isPlaying={isPlaying}  />
                <ChangeTimeInput  startTimer={startTimer} setTimerValue={setTimerValue} timerValue = {timerValue} hasTimeElapsed={hasTimeElapsed} />
            </div>
        </div>
    );
}
