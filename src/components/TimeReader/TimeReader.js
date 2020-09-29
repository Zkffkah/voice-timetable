import React, { useState, useEffect, useRef } from 'react';

// import classes from './TimeReader.module.scss';

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
    const compatibility = useRef(true);
    const voices = useRef(null);

    const [text, setText] = useState(currentTime);
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [volume, setVolume] = useState(1);

    const [isPaused, setIsPaused] = useState(true);
    const [isSpeak, setIsSpeak] = useState(true);

    const utterance = new SpeechSynthesisUtterance();
    const voicesAvailable = speechSynthesis.getVoices();

    if (window.SpeechSynthesisUtterance === undefined && !voicesAvailable) {
        compatibility.current = false;
    } else {
        compatibility.current = true;
    }

    useEffect(() => {
        setTimeout(() => {
            injectVoices(voices.current, speechSynthesis.getVoices());
        }, 1000);
    }, [voices]);

    useEffect(() => {
        setInterval(() => {
            // setText(currentTime);
            console.log(currentTime);
            // handlerSpeak();
        }, 1000);
    }, [currentTime]);

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
        setIsPaused(false);
        setIsSpeak(false);
    };

    const handlerStop = () => {
        speechSynthesis.cancel();
        setIsPaused(false);
        setIsSpeak(true);
    };

    const handlerPause = () => {
        speechSynthesis.pause();
        setIsPaused(true);
    };

    const handlerContinue = () => {
        speechSynthesis.resume();
        setIsPaused(false);
    };

    const handlerVoice = () => {
        speechSynthesis.cancel();
        setIsPaused(false);
        setIsSpeak(true);
    };

    const handlerRate = (e) => {
        setRate(e.target.value);
        speechSynthesis.cancel();
        setIsPaused(false);
        setIsSpeak(true);
    };

    const handlerPitch = (e) => {
        setPitch(e.target.value);
        speechSynthesis.cancel();
        setIsPaused(false);
        setIsSpeak(true);
    };

    const handlerVolume = (e) => {
        setVolume(e.target.value);
        speechSynthesis.cancel();
        setIsPaused(false);
        setIsSpeak(true);
    };

    const handlerText = (e) => {
        setText(e.target.value);
        if (text === '') {
            setIsSpeak(true);
        }
        speechSynthesis.cancel();
        setIsPaused(false);
        setIsSpeak(true);
    };

    function handler(e) {
        speechSynthesis.cancel();
        setIsPaused(false);
        setIsSpeak(true);
    }

    return (
        <>
            <div>
                <ul>
                    <li>
                        <input type="radio" name="time_ratio" id="" />
                        every five minutes
                    </li>
                    <li>
                        <input type="radio" name="time_ratio" id="" />
                        every ten minutes
                    </li>
                    <li>
                        <input type="radio" name="time_ratio" id="" />
                        every fifteen minutes
                    </li>
                    <li>
                        <input type="radio" name="time_ratio" id="" />
                        every twenty minutes
                    </li>
                    <li>
                        <input type="radio" name="time_ratio" id="" />
                        every thirty minutes
                    </li>
                    <li>
                        <input type="radio" name="time_ratio" id="" />
                        every hour
                    </li>
                </ul>
                <div>
                    <form action="" method="get">
                        <div>
                            <input
                                type="textarea"
                                id="text"
                                value={text}
                                onChange={(e) => handlerText(e)}
                                onClick={(e) => handler(e)}
                            ></input>
                        </div>
                        <div>
                            <label for="voice">Voice:</label>
                            <select
                                id="voice"
                                ref={voices}
                                onChange={handlerVoice}
                            ></select>
                        </div>
                        <div>
                            <div>
                                <div>
                                    <label for="rate">
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
                                    <label for="pitch">
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
                                    <label for="volume">
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
                            {isSpeak ? (
                                <button
                                    disabled={!text ? true : false}
                                    type="button"
                                    id="button-speak"
                                    onClick={handlerSpeak}
                                >
                                    <i className="fas fa-play"></i> Speak
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    id="button-continue"
                                    color="info"
                                    onClick={handlerContinue}
                                >
                                    <i className="fas fa-play"></i> Speak
                                </button>
                            )}
                            <button
                                disabled={!isPaused ? false : true}
                                type="button"
                                id="button-pause"
                                color="info"
                                onClick={handlerPause}
                            >
                                <i className="fas fa-pause"></i> Pause
                            </button>

                            <button
                                disabled={!text ? true : false}
                                type="button"
                                id="button-stop"
                                color="danger"
                                onClick={handlerStop}
                            >
                                <i className="fas fa-stop"></i> Stop
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default TextReader;
