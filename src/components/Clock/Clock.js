import React, { useState, useRef, useEffect } from 'react';

import classes from './Clock.module.scss';

const Clock = ({ setCurrentTime }) => {
    const [date, setData] = useState(new Date());
    const time = useRef(null);
    const day = useRef(new Date().getDay());
    const month = useRef(new Date().getMonth());
    const year = useRef(new Date().getFullYear());

    useEffect(() => {
        time.current = setInterval(() => setData(new Date()), 1000);
        setTimeout(() => {
            setCurrentTime(time.current);
            console.log(time.current);
        }, 50000);
    });

    return (
        <div>
            <div className={classes.digitalTime}>
                {date.toLocaleTimeString()}
            </div>
            <div className={classes.digitalDate}>
                {month.current}/0{day.current}/{year.current}
            </div>
        </div>
    );
};

export default Clock;
