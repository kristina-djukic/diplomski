import React, { useState } from 'react';
import Welcome from './components/Welcome';
import QuestionsForm from './components/QuestionsForm';
import SongsPage from './components/SongsPage';

function App() {
  const [step, setStep] = useState(0);
  const [participantId, setParticipantId] = useState(null);

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
        <SongsPage participantId={participantId} />
      )}
    </>
  );
}

export default App;
