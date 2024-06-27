import React, { useEffect, useRef, useState } from 'react';
import ScenicMode from './ScenicMode';

export default function Settings(props) {
    const { handleScenicChange } = props;
    const [open, setOpen] = useState(false);

    const settingsRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); 

    return (
        <div className='settings' ref={settingsRef}>
            <i onClick={() => setOpen(!open)} className="fa-solid fa-gear fa-2x"></i>
            <div className={`settingsMenu ${open ? 'settingMenuActive' : 'settingsMenuInactive'}`}>
                <ScenicMode handleScenicChange = {handleScenicChange}/>
                <hr/>
                <div>Hello</div>
            </div>
        </div>
    );
}
