const songsQuery =
  "SELECT song_id AS id, title, artist, url FROM songs LIMIT ? OFFSET ?";

module.exports = { songsQuery };
