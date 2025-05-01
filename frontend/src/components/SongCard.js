import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Card.css'

export default function SongCard({
  song,
  emotions,
  participantId,
  initialResponse = { knows: null, score: 0, emotion: null },
  onAnswer
}) {
  const [knows, setKnows]                   = useState(initialResponse.knows)
  const [score, setScore]                   = useState(initialResponse.score)
  const [hoverScore, setHoverScore]         = useState(0)
  const [selectedEmotion, setSelectedEmotion] = useState(initialResponse.emotion)

  // BUBBLE UP **ALL THREE** whenever any piece changes
  useEffect(() => {
    onAnswer(song.id, {
      knows,
      score,
      emotion: selectedEmotion
    })
  }, [knows, score, selectedEmotion, song.id, onAnswer])

  // build embed URL
  let embedUrl = song.url
  try {
    const v = new URL(song.url).searchParams.get('v')
    embedUrl = `https://www.youtube.com/embed/${v}`
  } catch {}

  const renderLabel = name => {
    if (name.includes('/')) {
      const [a,b] = name.split('/')
      return <> {a}/<br/>{b} </>
    }
    return name
  }

  return (
    <div className="player-card p-4">
      <div className="row g-4 align-items-center">
        <div className="col-12 col-md-6">
          <div className="ratio ratio-16x9">
            <iframe
              src={embedUrl}
              title={song.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <h3>{song.title}</h3>
          <h5 className="text-muted">{song.artist}</h5>

          {/* Know */}
          <div className="mb-3">
            <label className="form-label">Did you know this song?</label>
            <div className="btn-group w-100">
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  setKnows(true)
                  axios.post('/knowledge', {
                    participant_id: participantId,
                    song_id: song.id,
                    knows_song: 1
                  }).catch(()=>{})
                }}
                style={{
                  color:           knows===true? '#fff':'#000',
                  backgroundColor: knows===true? '#16a2b9':'transparent',
                  borderColor:     '#000'
                }}
                onMouseOver={e=>{
                  e.target.style.color='#fff'
                  e.target.style.backgroundColor='#16a2b9'
                }}
                onMouseOut={e=>{
                  if(!knows){
                    e.target.style.color='#000'
                    e.target.style.backgroundColor='transparent'
                  }
                }}
              >Yes</button>
              <button
                className="btn btn-outline-primary"
                onClick={()=>{
                  setKnows(false)
                  axios.post('/knowledge', {
                    participant_id: participantId,
                    song_id: song.id,
                    knows_song: 0
                  }).catch(()=>{})
                }}
                style={{
                  color:           knows===false? '#fff':'#000',
                  backgroundColor: knows===false? '#16a2b9':'transparent',
                  borderColor:     '#000'
                }}
                onMouseOver={e=>{
                  e.target.style.color='#fff'
                  e.target.style.backgroundColor='#16a2b9'
                }}
                onMouseOut={e=>{
                  if(knows!==false){
                    e.target.style.color='#000'
                    e.target.style.backgroundColor='transparent'
                  }
                }}
              >No</button>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-3 rating-row">
            <label className="form-label">Rate this song:</label>
            <div
              className="star-rating"
              onMouseLeave={() => setHoverScore(0)}
              style={{ userSelect:'none' }}
            >
              {[1,2,3,4,5].map(n=>(
                <span
                  key={n}
                  onMouseEnter={()=>setHoverScore(n)}
                  onClick={()=>{
                    setScore(n)
                    axios.put('/ratings', {
                      participant_id: participantId,
                      song_id: song.id,
                      score: n
                    }).catch(()=>{})
                  }}
                  style={{
                    cursor:'pointer',
                    fontSize:'2.5rem',
                    color: (hoverScore||score)>=n? '#ffd700':'#ccc',
                    marginRight:'4px'
                  }}
                >★</span>
              ))}
            </div>
          </div>

          {/* Emotions */}
          <div className="mb-3">
            <label className="form-label">Select one emotion this song evoked:</label>
            <div className="emotion-grid">
              {emotions.map(e=>(
                <div className="form-check" key={e.id}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`emo-${song.id}`}
                    id={`emo-${song.id}-${e.id}`}
                    checked={selectedEmotion===e.id}
                    onChange={()=>{
                      setSelectedEmotion(e.id)
                      axios.post('/song_emotions', {
                        participant_id: participantId,
                        song_id: song.id,
                        emotions: [e.id]
                      }).catch(()=>{})
                    }}
                  />
                  <label className="form-check-label" htmlFor={`emo-${song.id}-${e.id}`}>
                    {renderLabel(e.name)}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
