import React from 'react'
import './QuestionsForm.css'

const SCALE_LABELS = {
  1: 'Completely Disagree',
  2: 'Strongly Disagree',
  3: 'Disagree',
  4: 'Neither Agree Nor Disagree',
  5: 'Agree',
  6: 'Strongly Agree',
  7: 'Completely Agree'
}

export default function QuestionsForm({ formData, onChange, onContinue }) {
  const yearsOpts  = ['0','1','2','3','4-5','6-9','10 or more']
  const theoryOpts = ['0','0.5','1','2','3','4-6','7 or more']

  const allFilled =
    formData.daily_practice_years &&
    formData.formal_training_years &&
    formData.music_theory_years &&
    formData.not_musician_agreement   !== null &&
    formData.talk_emotions_ability    !== null &&
    formData.trigger_shivers          !== null &&
    formData.rare_emotions            !== null &&
    formData.music_motivation         !== null

  const renderScale = (key, label) => (
    <div className="qf-group" key={key}>
      <label className="qf-label">{label}</label>
      <div className="qf-scale-row">
        {[1,2,3,4,5,6,7].map(n => (
          <div className="qf-scale-item" key={n}>
            <button
              type="button"
              className={`btn btn-outline-secondary ${
                formData[key] === n ? 'active' : ''
              }`}
              style={{ borderColor: '#16a2b9' }}
              onClick={() => onChange(key, n)}
            >
              {n}
            </button>
            <div className="qf-scale-label">{SCALE_LABELS[n]}</div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="questions-background">
      <div className="questions-intro">
        <h2>Musical background questions</h2>
        <p>Please answer all of the following before moving on to the songs.</p>
      </div>

      <div className="questions-card">
        <div className="qf-group">
          <label className="qf-label">
            I engaged in regular, daily practice … for:
          </label>
          <select
            className="qf-select"
            value={formData.daily_practice_years}
            onChange={e => onChange('daily_practice_years', e.target.value)}
          >
            <option value="" disabled>— select years —</option>
            {yearsOpts.map(y=> <option key={y} value={y}>{y} years</option>)}
          </select>
        </div>

        <div className="qf-group">
          <label className="qf-label">
            I have had formal training on an instrument … for:
          </label>
          <select
            className="qf-select"
            value={formData.formal_training_years}
            onChange={e => onChange('formal_training_years', e.target.value)}
          >
            <option value="" disabled>— select years —</option>
            {yearsOpts.map(y=> <option key={y} value={y}>{y} years</option>)}
          </select>
        </div>

        <div className="qf-group">
          <label className="qf-label">
            I have had formal training in music theory for:
          </label>
          <select
            className="qf-select"
            value={formData.music_theory_years}
            onChange={e => onChange('music_theory_years', e.target.value)}
          >
            <option value="" disabled>— select years —</option>
            {theoryOpts.map(y=> <option key={y} value={y}>{y} years</option>)}
          </select>
        </div>

        {renderScale('not_musician_agreement', 'I would not consider myself a musician.')}
        {renderScale('talk_emotions_ability', 'I am able to talk about the emotions …')}
        {renderScale('trigger_shivers', 'I sometimes choose music that can trigger shivers …')}
        {renderScale('rare_emotions', 'Pieces of music rarely evoke emotions for me.')}
        {renderScale('music_motivation', 'I often pick certain music to motivate or excite me.')}

        <button
          className="btn btn-info btn-lg"
          style={{ width:'100%'}}
          onClick={() => {
            if (!allFilled) {
              alert('Please fill in all fields before continuing.')
              return
            }
            onContinue()
          }}
        >
          Continue to songs
        </button>
      </div>
    </div>
  )
}
