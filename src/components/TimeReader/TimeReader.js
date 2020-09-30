import React, { useState, useEffect, useRef } from 'react';

import classes from './TimeReader.module.scss';

// eslint-disable-next-line
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

const TextReader = ({ hours, min, currentTime }) => {
    const voices = useRef(null);

    const [text, setText] = useState(currentTime);
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [volume, setVolume] = useState(1);

    const utterance = new SpeechSynthesisUtterance();
    // eslint-disable-next-line
    const voicesAvailable = speechSynthesis.getVoices();

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

    const handlerSpeak = () => {
        let selectedOption =
            voices.current.options[voices.current.selectedIndex];
        let selectedVoice = speechSynthesis
            .getVoices()
            .filter(function (voice) {
                return (
                    voice.voiceURI ===
                    selectedOption.getAttribute('data-voice-uri')
                );
            })
            .pop();

        utterance.text = text;
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        speechSynthesis.speak(utterance);
    };

    const handlerVoice = () => {
        speechSynthesis.cancel();
    };

    const handlerRate = (e) => {
        setRate(e.target.value);
        speechSynthesis.cancel();
    };

    const handlerPitch = (e) => {
        setPitch(e.target.value);
        speechSynthesis.cancel();
    };

    const handlerVolume = (e) => {
        setVolume(e.target.value);
        speechSynthesis.cancel();
    };

    const handlerText = (e) => {
        setText(e.target.value);
        if (text === '') {
        }
        speechSynthesis.cancel();
    };

    function handler(e) {
        speechSynthesis.cancel();
    }

    return (
        <>
            <div className={classes.settingsContent}>
                <ul className={classes.settingsMinutes}>
                    <li>
                        <input
                            type="radio"
                            name="time_ratio"
                            id="five-minutes"
                        />
                        <label htmlFor="five-minutes">every five minutes</label>
                    </li>
                    <li>
                        <input
                            type="radio"
                            name="time_ratio"
                            id="ten-minutes"
                        />
                        <label htmlFor="ten-minutes">every ten minutes</label>
                    </li>
                    <li>
                        <input
                            type="radio"
                            name="time_ratio"
                            id="fifteen-minutes"
                        />
                        <label htmlFor="fifteen-minutes">
                            every fifteen minutes
                        </label>
                    </li>
                    <li>
                        <input
                            type="radio"
                            name="time_ratio"
                            id="twenty-minutes"
                        />
                        <label htmlFor="twenty-minutes">
                            every twenty minutes
                        </label>
                    </li>
                    <li>
                        <input
                            type="radio"
                            name="time_ratio"
                            id="thirty-minutes"
                        />
                        <label htmlFor="thirty-minutes">
                            every thirty minutes
                        </label>
                    </li>
                    <li>
                        <input type="radio" name="time_ratio" id="every-hour" />
                        <label htmlFor="every-hour">every hour</label>
                    </li>
                </ul>
                <div>
                    <form action="" method="get">
                        <div>
                            <input
                                type="hidden"
                                id="text"
                                value={text}
                                onChange={(e) => handlerText(e)}
                                onClick={(e) => handler(e)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="voice">Voice:</label>
                            <select
                                id="voice"
                                ref={voices}
                                onChange={handlerVoice}
                            ></select>
                        </div>
                        <div>
                            <div>
                                <div>
                                    <label htmlFor="rate">
                                        Rate: <b>{rate}</b>
                                    </label>
                                    <input
                                        type="range"
                                        id="rate"
                                        min="0.1"
                                        max="2"
                                        value={rate}
                                        step="0.1"
                                        onChange={(e) => handlerRate(e)}
                                    />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label htmlFor="pitch">
                                        Pitch: <b>{pitch}</b>
                                    </label>
                                    <input
                                        type="range"
                                        id="pitch"
                                        min="0.1"
                                        max="2"
                                        value={pitch}
                                        step="0.1"
                                        onChange={(e) => handlerPitch(e)}
                                    />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label htmlFor="volume">
                                        Volume: <b>{volume}</b>
                                    </label>
                                    <input
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

                        <div>
                            <button
                                disabled={!text ? true : false}
                                type="button"
                                id="button-speak"
                                onClick={handlerSpeak}
                            >
                                <i className="fas fa-play"></i> Test
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default TextReader;
