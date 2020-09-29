import React, { useEffect, useState } from 'react';
import * as moment from 'moment';

import Header from './components/Header/Header';
import Clock from './components/Clock/Clock';
import TimeReader from './components/TimeReader/TimeReader';
import './App.css';

// import 'moment/locale/ru';
// import 'moment/locale/en';

const App = () => {
    const [time, setTime] = useState(moment().format('HH:mm:ss'));
    const [date, setData] = useState(moment().format('Do MMMM YYYY'));
    const [hours, setHours] = useState(moment().format('HH'));
    const [min, setMin] = useState(moment().format('mm'));

    useEffect(() => {
        setInterval(() => {
            setTime(moment().format('HH:mm:ss'));
            setData(moment().format('Do MMMM YYYY'));
            setHours(moment().format('HH'));
            setMin(moment().format('mm'));
        }, 1000);
    });

    useEffect(() => {});

    return (
        <div>
            <header className="App-header">
                <Header />
                <Clock time={time} date={date} />
                <TimeReader
                    hours={hours}
                    min={min}
                    currentTime={`${hours}:${min}`}
                />
            </header>
        </div>
    );
};

export default App;
