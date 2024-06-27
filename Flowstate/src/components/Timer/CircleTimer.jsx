import { useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

export default function CircleTimer(props) {
    const {isPlaying, ki, timer , handleTimerComplete, scenicMode} = props;

    const renderTime = ({ remainingTime }) => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        return <div style={{ fontSize: '30px', color: `${scenicMode?'#FFFFFF':'#000000'}` }}  className="timerText">{`${minutes}:${seconds < 10 ? '0' + seconds : seconds}`}</div>;
    };

    function getTime(timer) {
        const minutes = Number(timer.split(':')[0]);
        const seconds = Number(timer.split(':')[1])
        console.log(seconds);
        return minutes * 60 + seconds;
    }

    const duration = getTime(timer);

    return (
        <CountdownCircleTimer 
            size={250}
            strokeWidth = {8}
            key={ki} 
            onComplete={handleTimerComplete}
            isPlaying={isPlaying}
            duration={duration}
            colors={['#099100', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[duration * 4/5,duration * 2/5, duration * 1/5, 0]}
            >
                {renderTime}
        </CountdownCircleTimer>
    );
}
