// src/components/SongCard.js
import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './Card.css';

export default function SongCard({ song, emotions, participantId }) {
  const [knows, setKnows] = useState(true);
  const [score, setScore] = useState(0);
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
  const onEmotionChange = (opt) => {
    setSelectedEmotion(opt);
    const id = opt ? opt.value : null;
    axios.post('/song_emotions', {
      participant_id: participantId,
      song_id: song.id,
      emotions: id !== null ? [id] : [],
    }).catch(console.error);
  };

  // prepare dropdown options
  const emotionOptions = emotions.map(e => ({
    value: e.id,
    label: e.name,
  }));

  // Updated StarRating with inline styling
  const StarRating = ({ value, onChange }) => (
    <div
      style={{
        fontSize: '3rem',        // much bigger stars
        margin: '0.5rem 0',
        userSelect: 'none',
        display: 'inline-flex'
      }}
    >
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          onClick={() => onChange(n)}
          style={{
            cursor: 'pointer',
            color: n <= value ? '#ffd700' : '#ccc', 
            marginRight: '6px',
            transition: 'color 0.2s'
          }}
        >
          {n <= value ? '★' : '☆'}
        </span>
      ))}
    </div>
  );

  return (
    <div className="player-card p-4">
      <div className="row g-4 align-items-center">
        {/* video takes 7/12 on md+ */}
        <div className="col-12 col-md-7">
          <div className="ratio ratio-16x9 embed-container">
            <iframe
              src={embedUrl}
              title={song.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* controls */}
        <div className="col-12 col-md-5">
          <div className="card-header mb-3">
            <h3 className="mb-1">{song.title}</h3>
            <small className="text-muted">{song.artist}</small>
          </div>

          {/* Know? */}
          <div className="mb-3">
            <label className="form-label">Did you know this song before?</label>
            <div className="btn-group w-100">
              <button
                className={`btn btn-outline-primary ${knows ? 'active' : ''}`}
                onClick={() => onKnow(true)}
              >Yes</button>
              <button
                className={`btn btn-outline-primary ${!knows ? 'active' : ''}`}
                onClick={() => onKnow(false)}
              >No</button>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-3">
            <label className="form-label">Rate this song:</label>
            <StarRating value={score} onChange={onStarClick} />
          </div>

          {/* Emotion */}
          <div className="mb-3">
           <label className="form-label">Select one emotion this song evoked:</label>
            <div className="row row-cols-2 row-cols-md-3 g-2">
              {emotionOptions.map(opt => (
                <div className="col" key={opt.value}>
                  <button
                    type="button"
                    className={`btn btn-outline-primary btn-sm w-100 ${
                      selectedEmotion?.value === opt.value ? 'active' : ''
                    }`}
                    onClick={() => onEmotionChange(opt)}
                  >
                    {opt.label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
