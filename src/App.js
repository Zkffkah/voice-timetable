import React, { Component } from 'react';

import Clock from './components/Clock/Clock';
import './App.css';

class App extends Component {
    render() {
        return (
            <div>
                <header className="App-header">
                    VoiceClock
                    <Clock />
                </header>
            </div>
        );
    }
}

export default App;
