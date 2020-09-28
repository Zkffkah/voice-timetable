import React from 'react';

import Header from './components/Header/Header';
import Clock from './components/Clock/Clock';
import TextReader from './components/TextReader/TextReader';
import './App.css';

const App = () => {
    // eslint-disable-next-line
    return (
        <div>
            <header className="App-header">
                <Header />
                <Clock />
                <TextReader currentTime={'wwwwwwwwwww'} />
            </header>
        </div>
    );
};

export default App;
