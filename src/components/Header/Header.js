import React from 'react';

import classes from './Header.module.scss';

const { remote } = window.require('electron');
const mainWindow = remote.getCurrentWindow();

const Header = ({ setIsSettings, isSettings }) => {
    const handleMinimizeWindow = () => {
        mainWindow.hide();
    };

    const handleCloseWindow = () => {
        mainWindow.close();
    };

    const handleIsSettings = () => {
        setIsSettings(!isSettings);
    };

    return (
        <div className={classes.header}>
            <div className={classes.topBar}>
                <div className={classes.title}>
                    <img
                        src="./icons/16x16.png"
                        alt="Logo"
                        className={classes.logo}
                    />{' '}
                    Voice Clock
                </div>
                <div>
                    <button
                        className={classes.btnWindow}
                        onClick={handleIsSettings}
                    >
                        <i className="fal fa-bars"></i>
                    </button>
                    <button
                        className={classes.btnWindow}
                        onClick={handleMinimizeWindow}
                    >
                        <i className="fal fa-window-minimize" />
                    </button>
                    <button
                        className={
                            classes.btnWindow + ' ' + classes.closeWindow
                        }
                        onClick={handleCloseWindow}
                    >
                        <i className="fal fa-window-close" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;
