import React from "react";
import "./QuestionsForm.css";

const SCALE_LABELS = {
  1: "Completely Disagree",
  2: "Strongly Disagree",
  3: "Disagree",
  4: "Neither Agree Nor Disagree",
  5: "Agree",
  6: "Strongly Agree",
  7: "Completely Agree",
};

export default function QuestionsForm({ formData, onChange, onContinue }) {
  const yearsOpts = ["0", "1", "2", "3", "4-5", "6-9", "10 or more"];
  const yearsInstrument = ["0", "1", "2", "3", "4","5","6 or more"];

  const allFilled =
    formData.daily_practice_years &&
    formData.num_instruments_played &&
    formData.musical_preformer_compliment !== null &&
    formData.not_musician_agreement !== null &&
    formData.talk_emotions_ability !== null &&
    formData.evoke_past !== null &&
    formData.rare_emotions !== null &&
    formData.music_motivation !== null;

  const renderScale = (key, label) => (
    <div className="qf-group" key={key}>
      <label className="qf-label">{label}</label>
      <div className="qf-scale-row">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <div className="qf-scale-item" key={n}>
            <button
              type="button"
              className={`btn btn-outline-secondary ${formData[key] === n ? "active" : ""
                }`}
              style={{ borderColor: "#16a2b9" }}
              onClick={() => onChange(key, n)}>
              {n}
            </button>
            <div className="qf-scale-label">{SCALE_LABELS[n]}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="questions-background">
      <div className="questions-intro">
        <h2>Musical background questions</h2>
        <p>Please answer all of the following before moving on to the songs.</p>
      </div>

      <div className="questions-card">
        <div className="qf-group">
          <label className="qf-label">
            I engaged in regular, daily practice of a musical instrument (including voice) for:
          </label>
          <select
            className="qf-select"
            value={formData.daily_practice_years}
            onChange={(e) => onChange("daily_practice_years", e.target.value)}>
            <option value="" disabled>
              — select years —
            </option>
            {yearsOpts.map((y) => (
              <option key={y} value={y}>
                {y} years
              </option>
            ))}
          </select>
        </div>

        <div className="qf-group">
          <label className="qf-label">
           I can play _ musical instruments.
          </label>
          <select
            className="qf-select"
            value={formData.num_instruments_played}
            onChange={(e) => onChange("num_instruments_played", e.target.value)}>
            <option value="" disabled>
              — select number —
            </option>
            {yearsInstrument.map((y) => (
              <option key={y} value={y}>
                {y} 
              </option>
            ))}
          </select>
        </div>

        {renderScale(
          "musical_preformer_compliment",
          "I have never been complimented for my talents as a musical performer."
        )}

        {renderScale(
          "not_musician_agreement",
          "I would not consider myself a musician."
        )}
        {renderScale(
          "talk_emotions_ability",
          "I am able to talk about the emotions that a piece of music evokes for me."
        )}
        {renderScale(
          "evoke_past",
          "Music can evoke my memories of past people and places."
        )}
        {renderScale(
          "rare_emotions",
          "Pieces of music rarely evoke emotions for me."
        )}
        {renderScale(
          "music_motivation",
          "I often pick certain music to motivate or excite me."
        )}

        <button
          className="btn btn-info btn-lg"
          style={{ width: "100%" }}
          onClick={() => {
            if (!allFilled) {
              alert("Please fill in all fields before continuing.");
              return;
            }
            onContinue();
          }}>
          Continue to songs
        </button>
      </div>
    </div>
  );
}
