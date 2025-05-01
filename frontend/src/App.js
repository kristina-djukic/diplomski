import React, { useState } from 'react'
import axios from 'axios'

import Welcome       from './components/Welcome'
import QuestionsForm from './components/QuestionsForm'
import SongsPage     from './components/SongsPage'
import ThankYou      from './components/ThankYou'

export default function App() {
  const [step, setStep]           = useState(0)
  const [formData, setFormData]   = useState({
    daily_practice_years:   '',
    formal_training_years:  '',
    music_theory_years:     '',
    not_musician_agreement: null,
    talk_emotions_ability:  null,
    trigger_shivers:        null,
    rare_emotions:          null,
    music_motivation:       null
  })
  const [participantId, setParticipantId] = useState(null)
  const [songResponses, setSongResponses] = useState({})

  // field‐by‐field update from QuestionsForm
  const handleFormChange = (key, val) => {
    setFormData(fd => ({ ...fd, [key]: val }))
  }

  // when QuestionsForm is complete → POST /participants → move to songs
  const handleFormContinue = async () => {
    try {
      const { data } = await axios.post('/participants', formData)
      setParticipantId(data.participant_id)
      setStep(2)
    } catch (err) {
      console.error(err)
      alert('Failed to save your info. Please try again.')
    }
  }

  // collect answers from each SongCard
  const handleSongAnswer = (songId, ans) => {
    setSongResponses(sr => ({
      ...sr,
      [songId]: ans
    }))
  }

  // back button from songs → questions
  const handleBackToQuestions = () => {
    setStep(1)
  }

  // submit all button clicked
  const handleSubmitAll = () => {
    // all the per‐song endpoints already fired as you answered each card,
    // so here we only advance to ThankYou
    setStep(3)
  }

  return (
    <>
      {step === 0 && (
        <Welcome onStart={() => setStep(1)} />
      )}

      {step === 1 && (
        <QuestionsForm
          formData={formData}
          onChange={handleFormChange}
          onContinue={handleFormContinue}
        />
      )}

      {step === 2 && (
        <SongsPage
          participantId={participantId}
          initialResponses={songResponses}
          onAnswer={handleSongAnswer}
          onBack={handleBackToQuestions}
          onSubmitAll={handleSubmitAll}
        />
      )}

      {step === 3 && (
        <ThankYou id={participantId} />
      )}
    </>
  )
}
