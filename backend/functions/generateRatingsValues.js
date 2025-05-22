const generateRatingsValues = (allResults) => {
  return allResults.map(({ pid, songId, knows, score }) => [
    pid,
    songId,
    score,
    knows,
  ]);
};

module.exports = {
  generateRatingsValues,
};
