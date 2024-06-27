import React from 'react'

export default function TimerMessage(props) {
    const {handleMessageOnClick} = props
  return (
    <div id = 'timerMessage'>
        Time's Up!
        <button className = 'timerButton' id = "messageButton" onClick={handleMessageOnClick}> OK </button>
    </div>
  )
}
