import React, { useState, useEffect } from 'react'
import './Card.css'

export default function SongCard({
  song,
  emotions,
  initialResponse = { knows:null, score:0, emotion:null },
  onAnswer
}) {
  const [knows, setKnows]                   = useState(initialResponse.knows)
  const [score, setScore]                   = useState(initialResponse.score)
  const [hoverScore, setHoverScore]         = useState(0)
  const [selectedEmotion, setSelectedEmotion] = useState(initialResponse.emotion)

  useEffect(() => {
    onAnswer(song.id, { knows, score, emotion: selectedEmotion })
  }, [knows, score, selectedEmotion, song.id, onAnswer])

  let embed = song.url
  try {
    const v = new URL(song.url).searchParams.get('v')
    embed = `https://www.youtube.com/embed/${v}`
  } catch {}

  const renderLabel = name => {
    if (name.includes('/')) {
      const [a,b] = name.split('/')
      return <>{a}/<br/>{b}</>
    }
    return name
  }

  return (
    <div className="player-card p-4">
      <div className="row g-4 align-items-center">
        <div className="col-12 col-md-6">
          <div className="ratio ratio-16x9">
            <iframe src={embed} title={song.title} allowFullScreen/>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <h3>{song.title}</h3>
          <h5 className="text-muted">{song.artist}</h5>

          <div className="mb-3">
            <label className="form-label">Did you know this song?</label>
            <div className="btn-group w-100">
              {['Yes','No'].map((lab,i)=> {
                const val = i===0
                return (
                  <button
                    key={lab}
                    className="btn btn-outline-primary"
                    onClick={()=>setKnows(val)}
                    style={{
                      color: knows===val? '#fff':'#000',
                      backgroundColor: knows===val? '#16a2b9':'transparent',
                      borderColor: '#000'
                    }}
                    onMouseOver={e=>{
                      e.target.style.backgroundColor = '#16a2b9'
                      e.target.style.color = '#fff'
                    }}
                    onMouseOut={e=>{
                      if (knows!==val) {
                        e.target.style.backgroundColor='transparent'
                        e.target.style.color='#000'
                      }
                    }}
                  >{lab}</button>
                )
              })}
            </div>
          </div>

          <div className="mb-3 rating-row">
            <label className="form-label">Rate this song:</label>
            <div
              className="star-rating"
              onMouseLeave={()=>setHoverScore(0)}
              style={{ userSelect:'none' }}
            >
              {[1,2,3,4,5].map(n=>(
                <span
                  key={n}
                  onMouseEnter={()=>setHoverScore(n)}
                  onClick={()=>setScore(n)}
                  style={{
                    cursor:'pointer',
                    fontSize:'2.5rem',
                    color: (hoverScore||score) >= n ? '#ffd700':'#ccc',
                    marginRight:'4px'
                  }}
                >★</span>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Select the emotion this song evoked:</label>
            <div className="emotion-grid">
              {emotions.map(e=>(
                <div className="form-check" key={e.id}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`emo-${song.id}`}
                    id={`emo-${song.id}-${e.id}`}
                    checked={selectedEmotion===e.id}
                    onChange={()=>setSelectedEmotion(e.id)}
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
