import React, { useState } from 'react';

import Header from './components/Header/Header';
import Clock from './components/Clock/Clock';
import TextReader from './components/TextReader/TextReader';
import './App.css';

const App = () => {
    const [currentTime, setCurrentTime] = useState('');
    return (
        <div>
            <header className="App-header">
                <Header />
                <Clock setCurrentTime={setCurrentTime} />
                <TextReader currentTime={currentTime} />
            </header>
        </div>
    );
};

export default App;
