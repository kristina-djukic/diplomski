import React, { useState, useEffect } from "react";
import "./Card.css";

export default function SongCard({
  song,
  emotions = [], // [{ id, name }, …]
  initialResponse = {}, // { knows, score, emotionRatings }
  onAnswer, // (songId, { knows, score, emotionRatings }) → void
}) {
  const emptyRatings = emotions.reduce((acc, e) => {
    acc[e.id] = 0;
    return acc;
  }, {});

  const [knows, setKnows] = useState(
    initialResponse.knows != null ? initialResponse.knows : null
  );
  const [score, setScore] = useState(
    initialResponse.score != null ? initialResponse.score : 0
  );
  const [hoverScore, setHoverScore] = useState(0);
  const [emotionRatings, setEmotionRatings] = useState(
    initialResponse.emotionRatings || emptyRatings
  );

  // bubble up every change
  useEffect(() => {
    onAnswer(song.id, { knows, score, emotionRatings });
  }, [knows, score, emotionRatings, song.id, onAnswer]);

  // YouTube → embed
  let embed = song.url;
  try {
    const vid = new URL(song.url).searchParams.get("v");
    embed = `https://www.youtube.com/embed/${vid}`;
  } catch {}

  const handleEmotionRating = (id, val) => {
    setEmotionRatings((prev) => ({ ...prev, [id]: val }));
  };

  return (
    <div className="player-card p-4">
      <div className="row g-4 align-items-center">
        {/* video */}
        <div className="col-12 col-md-6">
          <div className="ratio ratio-16x9">
            <iframe src={embed} title={song.title} allowFullScreen />
          </div>
        </div>

        {/* controls */}
        <div className="col-12 col-md-6">
          <h3>{song.title}</h3>
          <h5 className="text-muted">{song.artist}</h5>

          {/* know */}
          <div className="mb-3">
            <label className="form-label">Did you know this song?</label>
            <div className="btn-group w-100">
              {["Yes", "No"].map((lab, i) => {
                const val = i === 0;
                return (
                  <button
                    key={lab}
                    className="btn btn-outline-primary"
                    onClick={() => setKnows(val)}
                    style={{
                      backgroundColor:
                        knows === val ? "#16a2b9" : "transparent",
                      color: knows === val ? "#fff" : "#000",
                      borderColor: "#000",
                    }}>
                    {lab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* star */}
          <div className="mb-3 rating-row">
            <label className="form-label">Rate this song:</label>
            <div className="star-rating" onMouseLeave={() => setHoverScore(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  onMouseEnter={() => setHoverScore(n)}
                  onClick={() => setScore(n)}
                  style={{
                    cursor: "pointer",
                    color: (hoverScore || score) >= n ? "#ffd700" : "#ccc",
                    marginRight: "4px",
                    fontSize: "2.5rem",
                  }}>
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 9 emotion‐rating grid */}
      <div className="mb-3">
        <label className="form-label">
          How much did you feel each emotion?
        </label>
        <div className="emotion-grid">
          {emotions.map((e) => (
            <div key={e.id} className="emotion-item">
              <div className="emotion-label">{e.name}</div>
              <div className="emotion-options">
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n} className="emotion-radio">
                    <input
                      type="radio"
                      name={`emo-${song.id}-${e.id}`}
                      value={n}
                      checked={emotionRatings[e.id] === n}
                      onChange={() => handleEmotionRating(e.id, n)}
                    />
                    <span className="emotion-num">{n}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
