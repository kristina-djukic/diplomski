import React, { useState } from 'react';
import axios from 'axios';
import './QuestionsForm.css';

export default function QuestionsForm({ onComplete }) {
  const [form, setForm] = useState({
    daily_practice_years: '0',
    not_musician_agreement: 4,
    formal_training_years: '0',
    music_theory_years: '0',
    talk_emotions_ability: 4,
    trigger_shivers: 4,
    rare_emotions: 4,
    music_motivation: 4,
  });
  const [loading, setLoading] = useState(false);

  const yearsOpts = ['0','1','2','3','4-5','6-9','10 or more'];
  const theoryOpts = ['0','0.5','1','2','3','4-6','7 or more'];

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/participants', form);
      onComplete(data.participant_id);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="questions-background">
      <div className="questions-card">
        <h2 className="qf-heading">Musical background questions</h2>
        <form onSubmit={handleSubmit} className="qf-form">

          {/* 1 */}
          <div className="qf-group">
            <label className="qf-label">
              I engaged in regular, daily practice of an instrument (incl. voice) for:
            </label>
            <select
              className="qf-select"
              name="daily_practice_years"
              value={form.daily_practice_years}
              onChange={handleChange}
            >
              {yearsOpts.map(y =>
                <option key={y} value={y}>{y} years</option>
              )}
            </select>
          </div>

          {/* 2 */}
          

          {/* 3 */}
          <div className="qf-group">
            <label className="qf-label">
              I have had formal training on an instrument for:
            </label>
            <select
              className="qf-select"
              name="formal_training_years"
              value={form.formal_training_years}
              onChange={handleChange}
            >
              {yearsOpts.map(y =>
                <option key={y} value={y}>{y} years</option>
              )}
            </select>
          </div>

          {/* 4 */}
          <div className="qf-group">
            <label className="qf-label">
              I have had formal training in music theory for:
            </label>
            <select
              className="qf-select"
              name="music_theory_years"
              value={form.music_theory_years}
              onChange={handleChange}
            >
              {theoryOpts.map(y =>
                <option key={y} value={y}>{y} years</option>
              )}
            </select>
          </div>

          {/* Legend */}
          <div className="qf-legend">
            <small>1 = Strongly disagree • 7 = Strongly agree</small>
          </div>

          <div className="qf-group">
            <label className="qf-label">
              I would not consider myself a musician.
            </label>
            <select
              className="qf-select"
              name="not_musician_agreement"
              value={form.not_musician_agreement}
              onChange={handleChange}
            >
              {[1,2,3,4,5,6,7].map(n =>
                <option key={n} value={n}>{n}</option>
              )}
            </select>
          </div>

          {/* Agreement scales */}
          {[
            { name: 'talk_emotions_ability', label: 'I am able to talk about the emotions that a piece of music evokes for me.' },
            { name: 'trigger_shivers',        label: 'I sometimes choose music that can trigger shivers down my spine.' },
            { name: 'rare_emotions',          label: 'Pieces of music rarely evoke emotions for me.' },
            { name: 'music_motivation',       label: 'I often pick certain music to motivate or excite me.' },
          ].map(q => (
            <div className="qf-group" key={q.name}>
              <label className="qf-label">{q.label}</label>
              <select
                className="qf-select"
                name={q.name}
                value={form[q.name]}
                onChange={handleChange}
              >
                {[1,2,3,4,5,6,7].map(n =>
                  <option key={n} value={n}>{n}</option>
                )}
              </select>
            </div>
          ))}

          <button 
            type="submit"
            className="btn btn-info btn-lg"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Saving…' : 'Continue to songs'}
          </button>
        </form>
      </div>
    </div>
  );
}
