const participantsQuery = `
      INSERT INTO participants
        (daily_practice_years, not_musician_agreement, musical_preformer_compliment,
        num_instruments_played, talk_emotions_ability, evoke_past,
         rare_emotions, music_motivation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

module.exports = {
  participantsQuery,
};
