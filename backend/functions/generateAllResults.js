const generateAllResults = (pid, songResponses) => {
  const keys = Object.keys(songResponses).map(Number);
  const allResults = [];

  Object.values(songResponses).forEach((song, index) => {
    allResults.push({
      pid: pid,
      songId: keys[index],
      knows: song.knows,
      score: song.score,
      emotionRatings: song.emotionRatings,
    });
  });

  return allResults;
};

module.exports = {
  generateAllResults,
};
