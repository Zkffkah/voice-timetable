import React, { Component } from 'react';

import Clock from './components/Clock/Clock';
import TextReader from './components/TextReader/TextReader';
import './App.css';

class App extends Component {
    render() {
        return (
            <div>
                <header className="App-header">
                    <Clock />
                    <TextReader currentTime={'Это строка - 8:30'} />
                </header>
            </div>
        );
    }
}

export default App;
