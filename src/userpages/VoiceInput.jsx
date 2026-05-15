import React, {
    useState,
    useEffect,
    useRef
} from "react";

import {
    FaMicrophone,
    FaMicrophoneSlash,
    FaLanguage
} from "react-icons/fa";

import "./user.css";

const VoiceInput = ({
    onTextDetected
}) => {

    const [listening, setListening] =
        useState(false);

    const [language, setLanguage] =
        useState("en");

    const recognitionRef =
        useRef(null);



    useEffect(() => {

        if (
            "webkitSpeechRecognition" in window
        ) {

            const recognition =
                new window.webkitSpeechRecognition();

            recognition.continuous = false;

            recognition.interimResults = false;

            recognition.lang =
                language === "ta"
                    ? "ta-IN"
                    : "en-IN";



            recognition.onresult = (
                event
            ) => {

                const transcript =
                    event.results[0][0]
                        .transcript;

                setListening(false);

                if (onTextDetected) {

                    onTextDetected(
                        transcript
                    );

                }

            };



            recognition.onerror = () => {

                setListening(false);

            };



            recognition.onend = () => {

                setListening(false);

            };



            recognitionRef.current =
                recognition;
        }

    }, [language, onTextDetected]);



    const startListening = () => {

        if (
            !recognitionRef.current
        ) {

            alert(
                "Speech Recognition not supported"
            );

            return;
        }

        recognitionRef.current.start();

        setListening(true);
    };



    return (

        <div className="voice-wrapper">

            {/* MIC BUTTON */}
            <button
                type="button"
                onClick={startListening}
                className={`mic-btn ${listening
                    ? "listening"
                    : ""
                    }`}
                disabled={listening}
            >

                {listening ? (
                    <FaMicrophoneSlash />
                ) : (
                    <FaMicrophone />
                )}

            </button>



            {/* LANGUAGE BUTTON */}
            <button
                type="button"
                className="lang-btn"
                onClick={() =>
                    setLanguage(
                        language === "en"
                            ? "ta"
                            : "en"
                    )
                }
            >

                <FaLanguage />

                <span>
                    {language === "en"
                        ? "EN"
                        : "தமிழ்"}
                </span>

            </button>

        </div>
    );
};

export default VoiceInput;