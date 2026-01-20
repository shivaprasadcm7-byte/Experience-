import { useEffect, useState, useRef } from "react";
import { getInsights } from "../services/api";
import MonthlyTrendGraph from "./MonthlyTrendGraph";

export default function SmartInsights({ refresh }) {
  const [data, setData] = useState(null);
  const [popup, setPopup] = useState(null);

  // Ref to keep utterance alive (prevent GC)
  const utteranceRef = useRef(null);

  // 🔊 Voice function with retry logic + LOGS + AUTOPLAY FALLBACK
  const speak = (text) => {
    if (!("speechSynthesis" in window)) {
      console.error("Browser does not support speech synthesis");
      return;
    }

    const synth = window.speechSynthesis;

    // Function to actually speak
    const play = () => {
      synth.cancel(); // kill active audio

      if (synth.paused) synth.resume();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance; // Prevent GC

      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voices = synth.getVoices();
      if (voices.length > 0) {
        utterance.voice = voices.find(v => v.lang.startsWith("en")) || voices[0];
      }

      utterance.onstart = () => console.log("🗣️ TRACE: Speech started");

      // Handle blockage
      utterance.onerror = (e) => {
        console.error("🗣️ TRACE: Speech error:", e.error);
        if (e.error === 'not-allowed') {
          console.log("⚠️ Autoplay blocked. Waiting for user interaction...");
          // Fallback: Speak on next click
          const retryOnInteraction = () => {
            console.log("🖱️ User interacted. Retrying speech...");
            synth.resume();
            synth.speak(utterance);
            window.removeEventListener('click', retryOnInteraction);
            window.removeEventListener('keydown', retryOnInteraction);
          };
          window.addEventListener('click', retryOnInteraction);
          window.addEventListener('keydown', retryOnInteraction);
        }
      };

      try {
        synth.speak(utterance);
        if (synth.paused) synth.resume();
      } catch (e) {
        console.warn("Speech blocked:", e);
      }
    };

    // If voices are already loaded, speak immediately
    if (synth.getVoices().length > 0) {
      play();
    } else {
      synth.onvoiceschanged = () => {
        play();
        synth.onvoiceschanged = null; // cleanup
      };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await getInsights();
        setData(res.data);

        const messages = res.data.popupMessages || [];

        // Pick a random message for this refresh
        let message = "Welcome back! Check your latest expense insights.";
        if (messages.length > 0) {
          const randomIndex = Math.floor(Math.random() * messages.length);
          message = messages[randomIndex];
        }

        // Show popup
        setPopup({ message, type: res.data.status });

        // 🗣️ CONSTRUCT FULL DETAILS STRING
        // "Smart Insights. Spent this month: 5000. Spent last month: 2000. [Tip]"
        const detailedSpeech = `Smart Insights. Spent this month: ${res.data.currentMonthTotal}. Spent last month: ${res.data.previousMonthTotal}. ${message}`;

        // Speak full details
        speak(detailedSpeech);

        // Auto hide after 5s
        setTimeout(() => setPopup(null), 5000);
      } catch (err) {
        console.error("SMART INSIGHT ERROR:", err);
      }
    };

    fetchData();

    // Cleanup on unmount
    return () => window.speechSynthesis.cancel();
  }, [refresh]);

  if (!data) return null;

  return (
    <>
      {/* 🔔 FLOATING POPUP */}
      {popup && (
        <div className={`glass-toast ${popup.type}`}>
          <strong>🧠 Smart Insight</strong>
          <p>{popup.message}</p>
        </div>
      )}

      {/* 🧠 MAIN INSIGHTS CARD */}
      <div className={`insight-glass ${data.status}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>🧠 Smart Insights</h3>
          {/* 🔊 Manual Play Button */}
          <button
            onClick={() => speak(popup?.message || "Here are your smart insights.")}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#ffffff"
            }}
            title="Read Insights"
          >
            🔊
          </button>
        </div>

        <p>This Month: ₹{data.currentMonthTotal}</p>
        <p>Last Month: ₹{data.previousMonthTotal}</p>

        {/* 📊 GRAPH */}
        <MonthlyTrendGraph
          current={data.currentMonthTotal}
          previous={data.previousMonthTotal}
        />

        {/* 📋 Detailed messages */}
        <ul>
          {data.messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
