// src/App.js
import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Welcome       from './components/Welcome'
import QuestionsForm from './components/QuestionsForm'
import SongsPage     from './components/SongsPage'
import ThankYou      from './components/ThankYou'

export default function App() {
  const [step, setStep]           = useState(0)
  const [participantId, setId]    = useState(null)
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
  const [songResponses, setSongResponses] = useState({})

  // warn on reload
  useEffect(() => {
    const handler = e => {
      if (step > 0 && step < 3) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [step])

  const handleFormChange = (key, val) => {
    setFormData(fd => ({ ...fd, [key]: val }))
  }

  const handleFormContinue = () => {
    setStep(2)
  }

  const handleSongAnswer = (songId, ans) => {
    setSongResponses(sr => ({
      ...sr,
      [songId]: ans
    }))
  }

  const handleBackToQuestions = () => {
    setStep(1)
  }

  const handleSubmitAll = async () => {
    // 1) Create participant and get ID
    let pid
    try {
      const { data } = await axios.post('/participants', formData)
      pid = data.participant_id
      setId(pid)
      // 2) immediately advance to Thank-You
      setStep(3)
    } catch {
      alert('Failed to save your info. Please try again.')
      return
    }

    // 3) Fire-and-forget the song responses
    Object.entries(songResponses).forEach(async ([songId, { knows, score, emotion }]) => {
      try {
        await axios.post('/knowledge', {
          participant_id: pid,
          song_id: Number(songId),
          knows_song: knows ? 1 : 0
        })
        await axios.put('/ratings', {
          participant_id: pid,
          song_id: Number(songId),
          score
        })
        await axios.post('/song_emotions', {
          participant_id: pid,
          song_id: Number(songId),
          emotions: [emotion]
        })
      } catch (err) {
        console.error('Failed to save song', songId, err)
      }
    })
  }

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

      {step === 3 && (
        <ThankYou participantId={participantId} />
      )}
    </>
  )
}
