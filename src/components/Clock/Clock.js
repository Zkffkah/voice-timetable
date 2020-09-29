import React from 'react';

import classes from './Clock.module.scss';

const Clock = ({ date, time }) => {
    return (
        <div className={classes.clockContent}>
            <div className={classes.digitalTime}>{time}</div>
            <div className={classes.digitalDate}>{date}</div>
        </div>
    );
};

export default Clock;
