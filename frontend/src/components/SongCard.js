// src/components/SongCard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Card.css';

export default function SongCard({
  song,
  emotions,
  participantId,
  initialResponse = { knows: null, score: 0, emotion: null },
  onAnswer
}) {
  // 1) Local state, seeded from parent
  const [knows, setKnows]               = useState(initialResponse.knows);
  const [score, setScore]               = useState(initialResponse.score);
  const [hoverScore, setHoverScore]     = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState(initialResponse.emotion);

  // 2) Whenever any of the three answers change, bubble them all up at once:
  useEffect(() => {
    if (typeof onAnswer === 'function') {
      onAnswer(song.id, {
        knows,
        score,
        emotion: selectedEmotion
      });
    }
  }, [knows, score, selectedEmotion, song.id, onAnswer]);

  // 3) build embed URL
  let embedUrl;
  try {
    const vid = new URL(song.url).searchParams.get('v');
    embedUrl = `https://www.youtube.com/embed/${vid}`;
  } catch {
    embedUrl = song.url;
  }

  // 4) Handlers that update local state + call your API
  const handleKnow = (val) => {
    setKnows(val);
    axios.post('/knowledge', {
      participant_id: participantId,
      song_id: song.id,
      knows_song: val ? 1 : 0,
    }).catch(console.error);
  };

  const handleStar = (n) => {
    setScore(n);
    axios.put('/ratings', {
      participant_id: participantId,
      song_id: song.id,
      score: n,
    }).catch(console.error);
  };

  const handleEmotion = (e) => {
    const id = parseInt(e.target.value, 10);
    setSelectedEmotion(id);
    axios.post('/song_emotions', {
      participant_id: participantId,
      song_id: song.id,
      emotions: [id],
    }).catch(console.error);
  };

  // 5) Render
  const renderLabel = (name) => {
    if (name.includes('/')) {
      const [a, b] = name.split('/');
      return (
        <>
          {a}/<br />
          {b}
        </>
      );
    }
    return name;
  };

  return (
    <div className="player-card p-4">
      <div className="row g-4 align-items-center">

        {/* Video */}
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

        {/* Controls */}
        <div className="col-12 col-md-6">
          <h3>{song.title}</h3>
          <h5 className="text-muted">{song.artist}</h5>

          {/* Know */}
          <div className="mb-3">
            <label className="form-label">Did you know this song?</label>
            <div className="btn-group w-100">
              <button
                className="btn btn-outline-primary"
                onClick={() => handleKnow(true)}
                style={{
                  color:           knows === true ? '#fff' : '#000',
                  backgroundColor: knows === true ? '#16a2b9' : 'transparent',
                  borderColor:     '#000'
                }}
                onMouseOver={e => {
                  e.target.style.color = '#fff';
                  e.target.style.backgroundColor = '#16a2b9';
                }}
                onMouseOut={e => {
                  if (knows !== true) {
                    e.target.style.color = '#000';
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Yes
              </button>
              <button
                className="btn btn-outline-primary"
                onClick={() => handleKnow(false)}
                style={{
                  color:           knows === false ? '#fff' : '#000',
                  backgroundColor: knows === false ? '#16a2b9' : 'transparent',
                  borderColor:     '#000'
                }}
                onMouseOver={e => {
                  e.target.style.color = '#fff';
                  e.target.style.backgroundColor = '#16a2b9';
                }}
                onMouseOut={e => {
                  if (knows !== false) {
                    e.target.style.color = '#000';
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                No
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-3 rating-row">
            <label className="form-label">Rate this song:</label>
            <div
              className="star-rating"
              onMouseLeave={() => setHoverScore(0)}
              style={{ fontSize: '2.5rem', userSelect: 'none' }}
            >
              {[1, 2, 3, 4, 5].map(n => (
                <span
                  key={n}
                  onMouseEnter={() => setHoverScore(n)}
                  onClick={() => handleStar(n)}
                  style={{
                    cursor:      'pointer',
                    color:       (hoverScore || score) >= n ? '#ffd700' : '#ccc',
                    marginRight: '4px'
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Emotions */}
          <div className="mb-3">
            <label className="form-label small-label">
              Select one emotion that this song evoked in you:
            </label>
            <div className="emotion-grid">
              {emotions.map(e => (
                <div className="form-check" key={e.id}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`emotion-${song.id}`}
                    id={`emotion-${song.id}-${e.id}`}
                    value={e.id}
                    checked={selectedEmotion === e.id}
                    onChange={handleEmotion}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`emotion-${song.id}-${e.id}`}
                  >
                    {renderLabel(e.name)}
                  </label>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
