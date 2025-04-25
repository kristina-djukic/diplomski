// src/components/SongCard.js
import React, { useState } from 'react';
import axios from 'axios';
import './Card.css';

export default function SongCard({ song, emotions, participantId }) {
  const [knows, setKnows] = useState(null);
  const [score, setScore] = useState(0);
  const [hoverScore, setHoverScore] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  // build embed URL
  let embedUrl;
  try {
    const vid = new URL(song.url).searchParams.get('v');
    embedUrl = `https://www.youtube.com/embed/${vid}`;
  } catch {
    embedUrl = song.url;
  }

  // record know/no
  const onKnow = (val) => {
    setKnows(val);
    axios.post('/knowledge', {
      participant_id: participantId,
      song_id: song.id,
      knows_song: val ? 1 : 0,
    }).catch(console.error);
  };

  // record star rating
  const onStarClick = (n) => {
    setScore(n);
    axios.put('/ratings', {
      participant_id: participantId,
      song_id: song.id,
      score: n,
    }).catch(console.error);
  };

  // record emotion
  const onEmotionChange = (e) => {
    const id = parseInt(e.target.value, 10);
    setSelectedEmotion(id);
    axios.post('/song_emotions', {
      participant_id: participantId,
      song_id: song.id,
      emotions: [id],
    }).catch(console.error);
  };

  // helper to split labels on slash
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
        {/* video */}
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

        {/* controls */}
        <div className="col-12 col-md-6">
          <h3>{song.title}</h3>
          <h5 className="text-muted">{song.artist}</h5>

          {/* Know */}
          <div className="mb-3">
            <label className="form-label">Did you know this song?</label>
            <div className="btn-group w-100">
  <button
    className="btn btn-outline-primary"
    onClick={() => onKnow(true)}
    style={{
      color: knows === true ? '#fff' : '#000', // Black text initially
      backgroundColor: knows === true ? '#16a2b9' : 'transparent', // Blue background when selected
      borderColor: '#000', // Black border initially
    }}
    onMouseOver={(e) => {
      e.target.style.color = '#fff'; // White text on hover
      e.target.style.backgroundColor = '#16a2b9'; // Blue background on hover
    }}
    onMouseOut={(e) => {
      if (knows !== true) {
        e.target.style.color = '#000'; // Revert to black text if not selected
        e.target.style.backgroundColor = 'transparent'; // Revert to transparent background if not selected
      }
    }}
  >
    Yes
  </button>
  <button
    className="btn btn-outline-primary"
    onClick={() => onKnow(false)}
    style={{
      color: knows === false ? '#fff' : '#000', // Black text initially
      backgroundColor: knows === false ? '#16a2b9' : 'transparent', // Blue background when selected
      borderColor: '#000', // Black border initially
    }}
    onMouseOver={(e) => {
      e.target.style.color = '#fff'; // White text on hover
      e.target.style.backgroundColor = '#16a2b9'; // Blue background on hover
    }}
    onMouseOut={(e) => {
      if (knows !== false) {
        e.target.style.color = '#000'; // Revert to black text if not selected
        e.target.style.backgroundColor = 'transparent'; // Revert to transparent background if not selected
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
              style={{ fontSize: '3rem', userSelect: 'none' }}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  onMouseEnter={() => setHoverScore(n)}
                  onClick={() => onStarClick(n)}
                  style={{
                    cursor: 'pointer',
                    color: (hoverScore || score) >= n ? '#ffd700' : '#ccc',
                    marginRight: '4px',
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
                    onChange={onEmotionChange}
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
