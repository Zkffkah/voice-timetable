import React, { useState, useEffect, useRef } from 'react';

import classes from './TimeReader.module.scss';
const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

// const template = {
//     five: [
//         '00',
//         '05',
//         '10',
//         '15',
//         '20',
//         '25',
//         '30',
//         '35',
//         '40',
//         '45',
//         '50',
//         '55',
//     ],
//     ten: ['00', '10', '20', '30', '40', '50'],
//     fifteen: ['00', '15', '30', '45'],
//     twenty: ['00', '20', '40'],
//     thirty: ['00', '30'],
//     hour: ['00'],
// };

const courseTemplate = {
    morning: [
        '09:25-10:05',
        '10:15-10:55',
        '11:05-11:45',
    ],
    afternoon: [
        '13:30-14:10',
        '14:20-15:00',
        '15:10-15:50',
        '16:00-16:40',
        '16:50-17:30',
    ],
    night: [
        '19:25-20:05',
        '20:15-20:55',
        '21:05-21:45',
    ],

};

const TextReader = ({ hours, min }) => {
    const voices = useRef(null);

    const [settings, setSettings] = useState({
        rate: 1,
        pitch: 1,
        volume: 0.1,
        period: 'hour',
        voice: 0,
    });

    const utterance = new SpeechSynthesisUtterance();
    // eslint-disable-next-line
    const voicesAvailable = speechSynthesis.getVoices();

    useEffect(() => {
        const getSettings = JSON.parse(localStorage.getItem('settings'));

        if (getSettings === null) {
            setLocalStorage();
        } else {
            setSettings({
                rate: getSettings.rate,
                pitch: getSettings.pitch,
                volume: getSettings.volume,
                period: getSettings.period,
                voice: getSettings.voice,
            });
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        courseTemplate.morning.forEach((item, index) => {
            if (hours === item.split('-')[0].split(':')[0] && item.split('-')[0].split(':')[1] === min) {
                handlerSpeak(`现在的时间是${hours}:${min}，上午第${index + 1}节课上课啦，集中精神哦！`);
                ipcRenderer.send('update-title-tray-window-event', item);
            }

            if (hours === item.split('-')[1].split(':')[0] && item.split('-')[1].split(':')[1] === min) {
                handlerSpeak(`现在的时间是${hours}:${min}，上午第${index + 1}节课下课啦，休息一下吧！`);
            }
        });
        courseTemplate.afternoon.forEach((item, index) => {
            if (hours === item.split('-')[0].split(':')[0] && item.split('-')[0].split(':')[1] === min) {
                handlerSpeak(`现在的时间是${hours}:${min}，下午第${index + 1}节课上课啦，集中精神哦！`);
                ipcRenderer.send('update-title-tray-window-event', item);
            }

            if (hours === item.split('-')[1].split(':')[0] && item.split('-')[1].split(':')[1] === min) {
                handlerSpeak(`现在的时间是${hours}:${min}，下午第${index + 1}节课下课啦，休息一下吧！`);
            }
        });
        courseTemplate.night.forEach((item, index) => {
            if (hours === item.split('-')[0].split(':')[0] && item.split('-')[0].split(':')[1] === min) {
                handlerSpeak(`现在的时间是${hours}:${min}，晚上第${index + 1}节课上课啦，集中精神哦！`);
                ipcRenderer.send('update-title-tray-window-event', item);
            }

            if (hours === item.split('-')[1].split(':')[0] && item.split('-')[1].split(':')[1] === min) {
                handlerSpeak(`现在的时间是${hours}:${min}，晚上第${index + 1}节课下课啦，休息一下吧！`);
            }
        });
        // eslint-disable-next-line
    }, [settings, hours, min]);

    useEffect(() => {
        setTimeout(() => {
            injectVoices(voices.current, speechSynthesis.getVoices());
            voices.current.selectedIndex = settings.voice;
        }, 1000);
        // eslint-disable-next-line
    }, [voices, settings]);

    const injectVoices = (voicesElement, voices) => {
        voicesElement.innerHTML = voices
            .map((voice) => {
                let option = document.createElement('option');
                option.value = voice.lang;
                option.textContent =
                    voice.name + (voice.default ? ' (default)' : '');
                option.setAttribute('data-voice-uri', voice.voiceURI);
                return option;
            })
            .map((option) => {
                return option.outerHTML;
            })
            .join('');
    };

    const handlerSpeak = (time) => {
        // let selectedOption =
        //     voices.current.options[voices.current.selectedIndex];
        //
        let selectedVoice = speechSynthesis
            .getVoices()
            .filter((voice) => {
                return (
                    voice.voiceURI === 'Mei-Jia'
                );
            })
            .pop();
        //     .getVoices())

        utterance.text = time;
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
        utterance.rate = settings.rate;
        utterance.pitch = settings.pitch;
        utterance.volume = settings.volume;

        speechSynthesis.speak(utterance);
    };

    const setLocalStorage = () => {
        localStorage.setItem('settings', JSON.stringify(settings));
    };

    const handlerVoice = () => {
        setSettings((set) => ({ ...set, voice: voices.current.selectedIndex }));
        localStorage.setItem(
            'settings',
            JSON.stringify({
                ...settings,
                voice: voices.current.selectedIndex,
            }),
        );
        speechSynthesis.cancel();
    };

    const handlerRate = (e) => {
        let currentRate = e.target.value;
        setSettings((set) => ({ ...set, rate: currentRate }));
        setLocalStorage();
        speechSynthesis.cancel();
    };

    const handlerPitch = (e) => {
        let currentPitch = e.target.value;
        setSettings((set) => ({ ...set, pitch: currentPitch }));
        setLocalStorage();
        speechSynthesis.cancel();
    };

    const handlerVolume = (e) => {
        let currentVolume = e.target.value;
        setSettings((set) => ({ ...set, volume: currentVolume }));
        setLocalStorage();
        speechSynthesis.cancel();
    };

    const handlerReset = (e) => {
        setSettings({
            rate: 1,
            pitch: 1,
            volume: 0.1,
            period: 'hour',
            voice: 0,
        });
        injectVoices(voices.current, speechSynthesis.getVoices());
        setLocalStorage();
        speechSynthesis.cancel();
    };

    const handlerSelectTime = (e) => {
        let currentSelectTime = e.target.value;
        setSettings((set) => ({ ...set, period: currentSelectTime }));
        localStorage.setItem(
            'settings',
            JSON.stringify({ ...settings, period: currentSelectTime }),
        );
        speechSynthesis.cancel();
    };

    return (
        <div className={classes.settings}>
            <div className={classes.settingsContent}>
                <div className={classes.settingsLeftColumn}>
                    <div className={classes.settingsMinutes}>
                        <label htmlFor="selectTime">Period of time</label>
                        <select
                            name="selectTime"
                            id="selectTime"
                            onChange={(e) => handlerSelectTime(e)}
                            value={settings.period}
                        >
                            <option default value="hour">
                                Every Hour
                            </option>
                            <option value="five">Every Five Minutes</option>
                            <option value="ten">Every Ten Minutes</option>
                            <option value="fifteen">
                                Every Fifteen Minutes
                            </option>
                            <option value="twenty">Every Twenty Minutes</option>
                            <option value="thirty">Every Thirty Minutes</option>
                        </select>
                    </div>
                    <div className={classes.settingsVoice}>
                        <label htmlFor="voice">Voice:</label>
                        <select
                            id="voice"
                            ref={voices}
                            onChange={handlerVoice}
                        ></select>
                    </div>
                    <button
                        className={classes.testButton}
                        type="button"
                        id="button-speak"
                        onClick={() => handlerSpeak(`${hours}:${min}`)}
                    >
                        <i className="fas fa-play"></i> Test
                    </button>
                    <button
                        className={classes.testButton}
                        type="button"
                        id="button-speak"
                        onClick={handlerReset}
                    >
                        <i className="fas fa-redo-alt"></i> Reset
                    </button>
                </div>

                <div className={classes.settingsRightColumn}>
                    <div className={classes.settingsRange}>
                        <label htmlFor="rate">
                            Rate: <b>{settings.rate}</b>
                        </label>
                        <input
                            className={classes.range}
                            type="range"
                            id="rate"
                            min="0.1"
                            max="2"
                            value={settings.rate}
                            step="0.1"
                            onChange={(e) => handlerRate(e)}
                        />

                        <label htmlFor="pitch">
                            Pitch: <b>{settings.pitch}</b>
                        </label>
                        <input
                            className={classes.range}
                            type="range"
                            id="pitch"
                            min="0.1"
                            max="2"
                            value={settings.pitch}
                            step="0.1"
                            onChange={(e) => handlerPitch(e)}
                        />

                        <label htmlFor="volume">
                            Volume: <b>{settings.volume}</b>
                        </label>
                        <input
                            className={classes.range}
                            type="range"
                            id="volume"
                            min="0.1"
                            max="2"
                            value={settings.volume}
                            step="0.1"
                            onChange={(e) => handlerVolume(e)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextReader;
