// src/App.js
import React, { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import QuestionsForm from './components/QuestionsForm';
import SongsPage from './components/SongsPage';
import ThankYouPage from './components/ThankYouPage';

function App() {
  const [step, setStep] = useState(0);
  const [participantId, setParticipantId] = useState(null);

  // Determine “dirty” when user has started but not reached the final Thank You
  const isDirty = step > 0 && step < 3;

  useEffect(() => {
    const handler = (e) => {
      if (!isDirty) return;
      // Standard way to show confirmation dialog
      e.preventDefault();
      e.returnValue = 'Your answers will be lost if you reload or leave—are you sure?';
    };
    window.addEventListener('beforeunload', handler);
    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, [isDirty]);

  return (
    <>
      {step === 0 && <Welcome onStart={() => setStep(1)} />}

      {step === 1 && (
        <QuestionsForm
          onComplete={id => {
            setParticipantId(id);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <SongsPage
          participantId={participantId}
          onSubmitAll={() => setStep(3)}
          onBackToQuestions={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <ThankYouPage participantId={participantId} />
      )}
    </>
  );
}

export default App;
