const ratingsQuery = `
    INSERT INTO ratings (participant_id, song_id, score, knows_song)
    VALUES ?
    ON DUPLICATE KEY UPDATE
      score = VALUES(score),
      knows_song = VALUES(knows_song)
  `;

module.exports = {
  ratingsQuery,
};
