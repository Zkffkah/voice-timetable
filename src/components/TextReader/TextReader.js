import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Row,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Col,
} from 'reactstrap';

import classes from './TextReader.module.scss';

const TextReader = ({ currentTime }) => {
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
            setText(currentTime);
        }, 5000);
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
            {compatibility.current ? (
                <Container className={classes.content}>
                    <ul className={classes.listOption}>
                        <li>
                            <input type="radio" name="time_ratio" id="" /> every
                            five minutes
                        </li>
                        <li>
                            <input type="radio" name="time_ratio" id="" /> every
                            five minutes
                        </li>
                        <li>
                            <input type="radio" name="time_ratio" id="" /> every
                            fifteen minutes
                        </li>
                        <li>
                            <input type="radio" name="time_ratio" id="" /> every
                            thirty minutes
                        </li>
                        <li>
                            <input type="radio" name="time_ratio" id="" /> every
                            hour
                        </li>
                    </ul>
                    <div
                        className={isSpeak ? null : classes.curtainBlocked}
                        onClick={(e) => handler(e)}
                    ></div>
                    <div className={classes.contentWrap}>
                        <Form action="" method="get">
                            <FormGroup className={classes.formGroup}>
                                <div
                                    className={
                                        isSpeak ? null : classes.textareaBlocked
                                    }
                                ></div>
                                <Input
                                    disabled={isSpeak ? false : true}
                                    type="textarea"
                                    id="text"
                                    className={classes.inputText}
                                    value={text}
                                    onChange={(e) => handlerText(e)}
                                    onClick={(e) => handler(e)}
                                ></Input>
                            </FormGroup>
                            <FormGroup className={classes.formGroup}>
                                <Label for="voice">Voice:</Label>
                                <select
                                    className="form-control"
                                    id="voice"
                                    ref={voices}
                                    onChange={handlerVoice}
                                ></select>
                            </FormGroup>
                            <Row form className={classes.formGroup}>
                                <Col md={6}>
                                    <FormGroup className={classes.rangeInput}>
                                        <Label for="rate">
                                            Rate: <b>{rate}</b>
                                        </Label>
                                        <Input
                                            type="range"
                                            id="rate"
                                            min="0.1"
                                            max="2"
                                            value={rate}
                                            step="0.1"
                                            onChange={(e) => handlerRate(e)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup className={classes.rangeInput}>
                                        <Label for="pitch">
                                            Pitch: <b>{pitch}</b>
                                        </Label>
                                        <Input
                                            type="range"
                                            id="pitch"
                                            min="0.1"
                                            max="2"
                                            value={pitch}
                                            step="0.1"
                                            onChange={(e) => handlerPitch(e)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup className={classes.rangeInput}>
                                        <Label for="volume">
                                            Volume: <b>{volume}</b>
                                        </Label>
                                        <Input
                                            type="range"
                                            id="volume"
                                            min="0.1"
                                            max="2"
                                            value={volume}
                                            step="0.1"
                                            onChange={(e) => handlerVolume(e)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <FormGroup className={classes.buttonGroup}>
                                {isSpeak ? (
                                    <Button
                                        disabled={!text ? true : false}
                                        type="button"
                                        id="button-speak"
                                        color="success"
                                        className={classes.button}
                                        onClick={handlerSpeak}
                                    >
                                        <i className="fas fa-play"></i> Speak
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        id="button-continue"
                                        color="info"
                                        className={classes.button}
                                        onClick={handlerContinue}
                                    >
                                        <i className="fas fa-play"></i> Speak
                                    </Button>
                                )}
                                <Button
                                    disabled={!isPaused ? false : true}
                                    type="button"
                                    id="button-pause"
                                    color="info"
                                    className={classes.button}
                                    onClick={handlerPause}
                                >
                                    <i className="fas fa-pause"></i> Pause
                                </Button>

                                <Button
                                    disabled={!text ? true : false}
                                    type="button"
                                    id="button-stop"
                                    color="danger"
                                    className={classes.button}
                                    onClick={handlerStop}
                                >
                                    <i className="fas fa-stop"></i> Stop
                                </Button>
                            </FormGroup>
                        </Form>
                    </div>
                </Container>
            ) : (
                <Container>
                    <Row>
                        <p className={classes.unsupported}>
                            Speech Synthesis API Not Supported!
                        </p>
                    </Row>
                </Container>
            )}
        </>
    );
};

export default TextReader;
