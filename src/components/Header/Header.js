import React, { useState } from 'react';

import classes from './Header.module.scss';

const { remote } = window.require('electron');
const mainWindow = remote.getCurrentWindow();

const Header = ({ setIsSettings, isSettings }) => {
    const [status, setStatus] = useState(false);

    const handleMinimizeWindow = () => {
        mainWindow.hide();
    };

    const handleMaximizeWindow = () => {
        if (status) {
            mainWindow.unmaximize();
            setStatus(!status);
        } else {
            mainWindow.maximize();
            setStatus(!status);
        }
    };

    const handleCloseWindow = () => {
        mainWindow.close();
    };

    const handleIsSettings = () => {
        console.log(isSettings);
        setIsSettings(!isSettings);
    };

    return (
        <div className={classes.header}>
            <div className={classes.topBar}>
                <div className={classes.title}>
                    <i className="fas fa-podcast"></i> Voice Clock
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
                    {!status ? (
                        <button
                            className={classes.btnWindow}
                            onClick={handleMaximizeWindow}
                        >
                            <i className="fal fa-window-maximize" />
                        </button>
                    ) : (
                        <button
                            className={classes.btnWindow}
                            onClick={handleMaximizeWindow}
                        >
                            <i className="fal fa-window-restore"></i>
                        </button>
                    )}
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
