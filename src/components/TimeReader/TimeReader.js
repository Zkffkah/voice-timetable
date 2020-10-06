import React, { useState, useEffect, useRef } from 'react';

import classes from './TimeReader.module.scss';

const template = {
    five: [
        '00',
        '05',
        '10',
        '15',
        '20',
        '25',
        '30',
        '35',
        '40',
        '45',
        '50',
        '55',
    ],
    ten: ['00', '10', '20', '30', '40', '50'],
    fifteen: ['00', '15', '30', '45'],
    twenty: ['00', '20', '40'],
    thirty: ['00', '30'],
    hour: ['00'],
};

const TextReader = ({ hours, min }) => {
    const voices = useRef(null);

    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [volume, setVolume] = useState(1);
    const [period, setPeriod] = useState('hour');

    const utterance = new SpeechSynthesisUtterance();
    // eslint-disable-next-line
    const voicesAvailable = speechSynthesis.getVoices();

    useEffect(() => {
        const getSettings = JSON.parse(localStorage.getItem('settings'));

        if (getSettings === null) {
            setLocalStorage();
        } else {
            setRate(getSettings.rate);
            setPitch(getSettings.pitch);
            setVolume(getSettings.volume);
            setPeriod(getSettings.period);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        template[period].forEach((item) => {
            if (item === min) {
                handlerSpeak(`${hours}:${min}`);
            }
        });
        // eslint-disable-next-line
    }, [period, hours, min, voices]);

    useEffect(() => {
        setTimeout(() => {
            injectVoices(voices.current, speechSynthesis.getVoices());
        }, 1000);
    }, [voices]);

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
        let selectedOption =
            voices.current.options[voices.current.selectedIndex];

        let selectedVoice = speechSynthesis
            .getVoices()
            .filter((voice) => {
                return (
                    voice.voiceURI ===
                    selectedOption.getAttribute('data-voice-uri')
                );
            })
            .pop();

        utterance.text = time;
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        speechSynthesis.speak(utterance);
    };

    const setLocalStorage = () => {
        localStorage.setItem(
            'settings',
            JSON.stringify({
                rate: rate,
                pitch: pitch,
                volume: volume,
                period: period,
            }),
        );
    };

    const handlerVoice = () => {
        speechSynthesis.cancel();
    };

    const handlerRate = (e) => {
        setRate(e.target.value);
        setLocalStorage();
        speechSynthesis.cancel();
    };

    const handlerPitch = (e) => {
        setPitch(e.target.value);
        setLocalStorage();
        speechSynthesis.cancel();
    };

    const handlerVolume = (e) => {
        setVolume(e.target.value);
        setLocalStorage();
        speechSynthesis.cancel();
    };

    const handlerReset = (e) => {
        setRate(1);
        setPitch(1);
        setVolume(1);
        setPeriod('hour');
        injectVoices(voices.current, speechSynthesis.getVoices());
        setLocalStorage();
        speechSynthesis.cancel();
    };

    const handlerSelectTime = (e) => {
        e.stopPropagation();
        setPeriod(e.target.value);
        setLocalStorage();
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
                            value={period}
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
                            Rate: <b>{rate}</b>
                        </label>
                        <input
                            className={classes.range}
                            type="range"
                            id="rate"
                            min="0.1"
                            max="2"
                            value={rate}
                            step="0.1"
                            onChange={(e) => handlerRate(e)}
                        />

                        <label htmlFor="pitch">
                            Pitch: <b>{pitch}</b>
                        </label>
                        <input
                            className={classes.range}
                            type="range"
                            id="pitch"
                            min="0.1"
                            max="2"
                            value={pitch}
                            step="0.1"
                            onChange={(e) => handlerPitch(e)}
                        />

                        <label htmlFor="volume">
                            Volume: <b>{volume}</b>
                        </label>
                        <input
                            className={classes.range}
                            type="range"
                            id="volume"
                            min="0.1"
                            max="2"
                            value={volume}
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
