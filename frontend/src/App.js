import React, { useState, useEffect } from "react";
import axios from "axios";

import Welcome from "./components/Welcome";
import QuestionsForm from "./components/QuestionsForm";
import SongsPage from "./components/SongsPage";
import ThankYou from "./components/ThankYou";

export default function App() {
  const [step, setStep] = useState(0);
  const [participantId, setId] = useState(null);
  const [formData, setFormData] = useState({
    daily_practice_years: "",
    musical_preformer_compliment: "",
    num_instruments_played: "",
    not_musician_agreement: null,
    talk_emotions_ability: null,
    evoke_past: null,
    rare_emotions: null,
    music_motivation: null,
  });
  const [songResponses, setSongResponses] = useState({});

  useEffect(() => {
    const handler = (e) => {
      if (step > 0 && step < 3) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [step]);

  const handleFormChange = (key, val) => {
    setFormData((fd) => ({ ...fd, [key]: val }));
  };

  const handleFormContinue = () => {
    setStep(2);
  };

  const handleSongAnswer = (songId, ans) => {
    setSongResponses((sr) => ({
      ...sr,
      [songId]: ans,
    }));
  };

  const handleBackToQuestions = () => {
    setStep(1);
  };

  const handleSubmitAll = async () => {
    let pid;
    try {
      console.log("Submitting formData:", formData); 
      const { data } = await axios.post("/participants", formData);
      pid = data.participant_id;
      setId(pid);
    } catch {
      alert("Failed to save your info. Please try again.");
      return;
    }

    await axios.post("/submit", {
      pid: pid,
      songResponses: songResponses,
    });

    setStep(3);
  };

  return (
    <>
      {step === 0 && <Welcome onStart={() => setStep(1)} />}

      {step === 1 && (
        <QuestionsForm
          formData={formData}
          onChange={handleFormChange}
          onContinue={handleFormContinue}
        />
      )}

      {step === 2 && (
        <SongsPage
          initialResponses={songResponses}
          onAnswer={handleSongAnswer}
          onBack={handleBackToQuestions}
          onSubmitAll={handleSubmitAll}
        />
      )}

      {step === 3 && <ThankYou participantId={participantId} />}
    </>
  );
}
