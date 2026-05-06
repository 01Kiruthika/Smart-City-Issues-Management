import React, { useState, useEffect, useRef } from "react";
import './user.css'
const VoiceInput = ({ onTextDetected }) => {
    const [listening, setListening] = useState(false);
    const [language, setLanguage] = useState("en");

    const recognitionRef = useRef(null);

    useEffect(() => {
        if ("webkitSpeechRecognition" in window) {
            const recognition = new window.webkitSpeechRecognition();

            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = language === "ta" ? "ta-IN" : "en-IN";

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;

                setListening(false);


                if (onTextDetected) {
                    onTextDetected(transcript);
                }
            };

            recognition.onerror = () => {
                setListening(false);
            };

            recognition.onend = () => {
                setListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, [language, onTextDetected]);

    const startListening = () => {
        if (!recognitionRef.current) {
            alert("Speech Recognition not supported");
            return;
        }

        recognitionRef.current.start();
        setListening(true);
    };

    return (
        <div className="voice-container">
            <button onClick={startListening} className="Voice-start" disabled={listening}>
                {listening ? "Listening..." : "Speak"}
            </button>

            <button className="change-voice" onClick={() => setLanguage(language === "en" ? "ta" : "en")}>
                {language === "en" ? "Turn on Tamil" : "Turn on English"}
            </button>
        </div>
    );
};

export default VoiceInput;