import React, { useEffect, useState } from 'react';
import * as moment from 'moment';

import Header from './components/Header/Header';
import Clock from './components/Clock/Clock';
import TimeReader from './components/TimeReader/TimeReader';
import classes from './App.module.scss';

// import 'moment/locale/ru';
// import 'moment/locale/en';

const App = () => {
    const [isSettings, setIsSettings] = useState(false);
    const [time, setTime] = useState(moment().format('HH:mm:ss'));
    const [date, setData] = useState(moment().format('Do MMMM YYYY'));
    const [hours, setHours] = useState(moment().format('HH'));
    const [min, setMin] = useState(moment().format('mm'));
    const [week, setWeek] = useState(moment().format('dddd'));
    const [pm, setPm] = useState(moment().format('a'));

    useEffect(() => {
        setInterval(() => {
            setTime(moment().format('HH:mm:ss'));
            setData(moment().format('Do MMMM YYYY'));
            setHours(moment().format('HH'));
            setMin(moment().format('mm'));
            setWeek(moment().format('dddd'));
            setPm(moment().format('a'));
        }, 1000);
    });

    return (
        <main className={classes.mainContent}>
            <Header setIsSettings={setIsSettings} isSettings={isSettings} />
            <Clock time={time} date={date} week={week} pm={pm} />
            <div
                className={[
                    classes.settingsContent,
                    isSettings ? null : classes.settingsContentHide,
                ].join(' ')}
            >
                <TimeReader
                    hours={hours}
                    min={min}
                    currentTime={`${hours}:${min}`}
                />
            </div>
        </main>
    );
};

export default App;
