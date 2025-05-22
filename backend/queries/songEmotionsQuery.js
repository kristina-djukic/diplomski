const songEmotionsQuery = `
      INSERT INTO song_emotions
        (participant_id, song_id, emotion_id, rating)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        rating = VALUES(rating)
    `;

module.exports = {
  songEmotionsQuery,
};
