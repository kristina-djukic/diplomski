const generateSongEmotionsValues = (allResults) => {
  const values = [];
  allResults.forEach(({ pid, songId, emotionRatings }) => {
    Object.entries(emotionRatings).forEach(([emotion_id, rating]) => {
      values.push([pid, songId, Number(emotion_id), rating]);
    });
  });

  return values;
};

module.exports = {
  generateSongEmotionsValues,
};
