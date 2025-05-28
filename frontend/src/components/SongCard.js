import React, { useState, useEffect } from "react";
import "./Card.css";

export default function SongCard({
  song,
  emotions = [],
  initialResponse = {},
  onAnswer,
  isUnanswered,
}) {
  const emptyRatings = emotions.reduce((acc, e) => {
    acc[e.id] = null;
    return acc;
  }, {});

  const [knows, setKnows] = useState(
    initialResponse.knows != null ? initialResponse.knows : null
  );
  const [score, setScore] = useState(
    initialResponse.score != null ? initialResponse.score : null
  );
  const [hoverScore, setHoverScore] = useState(0);
  const [emotionRatings, setEmotionRatings] = useState(
    initialResponse.emotionRatings || emptyRatings
  );

  useEffect(() => {
    onAnswer(song.id, { knows, score, emotionRatings });
  }, [knows, score, emotionRatings, song.id, onAnswer]);

  let embed = song.url;
  try {
    const vid = new URL(song.url).searchParams.get("v");
    embed = `https://www.youtube.com/embed/${vid}`;
  } catch {}

  const handleEmotionRating = (id, val) => {
    setEmotionRatings((prev) => ({ ...prev, [id]: val }));
  };

  const handleKnows = (val) => {
    setKnows(val);
    if (val === false) {
      setScore(null);
      setEmotionRatings(
        emotions.reduce((acc, e) => {
          acc[e.id] = null;
          return acc;
        }, {})
      );
    }
  };

  const disabledClass = knows === false ? "disabled-section" : "";

  return (
    <div
      className="player-card p-4"
      id={`song-card-${song.id}`}
      style={{
        position: "relative",
        ...(isUnanswered
          ? {
              border: "3px solid #dc3545",
              boxShadow: "0 0 12px #dc3545",
            }
          : {}),
      }}
    >
      <div className="row g-4 align-items-center">
        {/* video */}
        <div className="col-12 col-md-6">
          <div className="ratio ratio-16x9">
            <iframe src={embed} title={song.title} allowFullScreen />
          </div>
        </div>

        <div className="col-12 col-md-6">
          <h3>{song.title}</h3>
          <h5 className="text-muted">{song.artist}</h5>

          <div className="mb-3">
            <label className="form-label">Did you know this song?</label>
            <div className="btn-group w-100">
              {["Yes", "No"].map((lab, i) => {
                const val = i === 0;
                return (
                  <button
                    key={lab}
                    className="btn btn-outline-primary"
                    onClick={() => handleKnows(val)}
                    style={{
                      backgroundColor:
                        knows === val ? "#16a2b9" : "transparent",
                      color: knows === val ? "#fff" : "#000",
                      borderColor: "#000",
                    }}
                  >
                    {lab}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`mb-3 rating-row ${disabledClass}`}>
            <label className="form-label">Rate this song:</label>
            <div className="star-rating" onMouseLeave={() => setHoverScore(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  onMouseEnter={() => knows !== false && setHoverScore(n)}
                  onClick={() => knows !== false && setScore(n)}
                  style={{
                    cursor: knows === false ? "not-allowed" : "pointer",
                    color: (hoverScore || score) >= n ? "#ffd700" : "#ccc",
                    marginRight: "4px",
                    fontSize: "2.5rem",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={disabledClass}>
        <div className="mb-3">
          <label className="form-label">
            How much did you feel each emotion?
          </label>
          <div className="emotion-scale-labels mb-2 d-flex justify-content-between">
            <span>1 Not at all</span>
            <span>2 Somewhat</span>
            <span>3 Moderately</span>
            <span>4 Quite a lot</span>
            <span>5 Very much</span>
          </div>
          <div className="emotion-grid">
            {emotions
              .slice()
              .sort((a, b) => a.id - b.id)
              .map((e) => (
                <div key={e.id} className="emotion-item">
                  <div
                    className="emotion-label"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    {e.name}
                  </div>
                  <div className="emotion-options">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <label key={n} className="emotion-radio">
                        <input
                          type="radio"
                          name={`emo-${song.id}-${e.id}`}
                          value={n}
                          checked={emotionRatings[e.id] === n}
                          onChange={() =>
                            knows !== false && handleEmotionRating(e.id, n)
                          }
                          disabled={knows === false}
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
    </div>
  );
}
