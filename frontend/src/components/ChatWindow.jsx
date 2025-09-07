import React, { useState, useRef } from "react";

export default function ChatWindow() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [speakLang, setSpeakLang] = useState("en-IN"); // default language
  const recognitionRef = useRef(null);

  // 🎤 Start speech recognition
  const startListening = (lang = "en-IN") => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition. Try Chrome.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = lang;

    recognitionRef.current.onstart = () => setListening(true);
    recognitionRef.current.onend = () => setListening(false);

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognitionRef.current.start();
  };

  // ⏹ Stop recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // 🗣 Speak text using SpeechSynthesis API
  const speak = (text, lang = "en-IN") => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1; // speed
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  // Send message to backend
  const sendMessage = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem("token");
    const res = await fetch("http://127.0.0.1:8000/chat/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ question: input }),
    });

    const data = await res.json();
    const newMessages = [...messages, { user: input, bot: data.response }];
    setMessages(newMessages);
    setInput("");

    // Speak bot reply
    speak(data.response, speakLang);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="h-80 overflow-y-auto border p-3 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className="mb-3">
            <p><strong>You:</strong> {msg.user}</p>
            <p className="bg-gray-100 p-2 rounded"><strong>Bot:</strong> {msg.bot}</p>
          </div>
        ))}
      </div>

      {/* Input + Send + Voice */}
      <div className="flex items-center gap-2">
        <input
          className="flex-grow border p-2 rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a disease..."
        />
        <button
          className="bg-blue-600 text-white px-4"
          onClick={sendMessage}
        >
          Send
        </button>

        {/* 🎤 Microphone Button */}
        {!listening ? (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => startListening(speakLang)}
          >
            🎤
          </button>
        ) : (
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={stopListening}
          >
            ⏹
          </button>
        )}
      </div>

      {/* Language Options */}
      <div className="mt-2">
        <p className="text-sm text-gray-600">🌍 Choose Language for Voice:</p>
        <div className="flex gap-2 mt-1 flex-wrap">
          <button
            className="bg-gray-200 px-2 rounded"
            onClick={() => setSpeakLang("en-IN")}
          >
            English
          </button>
          <button
            className="bg-gray-200 px-2 rounded"
            onClick={() => setSpeakLang("hi-IN")}
          >
            Hindi
          </button>
          <button
            className="bg-gray-200 px-2 rounded"
            onClick={() => setSpeakLang("bn-IN")}
          >
            Bengali
          </button>
          <button
            className="bg-gray-200 px-2 rounded"
            onClick={() => setSpeakLang("ta-IN")}
          >
            Tamil
          </button>
          <button
            className="bg-gray-200 px-2 rounded"
            onClick={() => setSpeakLang("te-IN")}
          >
            Telugu
          </button>
        </div>
      </div>
    </div>
  );
}
