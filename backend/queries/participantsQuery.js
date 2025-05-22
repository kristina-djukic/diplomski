const participantsQuery = `
      INSERT INTO participants
        (daily_practice_years, not_musician_agreement, formal_training_years,
         music_theory_years, talk_emotions_ability, trigger_shivers,
         rare_emotions, music_motivation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

module.exports = {
  participantsQuery,
};
