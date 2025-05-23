const express = require("express");
const app = express();
const db = require("./config/db");
const port = 5000;
const cors = require("cors");
const {
  ratingsQuery,
  songEmotionsQuery,
  songsQuery,
  songsCountQuery,
  emotionsQuery,
  participantsQuery,
} = require("./queries");
const {
  generateAllResults,
  generateRatingsValues,
  generateSongEmotionsValues,
} = require("./functions");

app.use(express.json());
app.use(cors());

app.get("/songs", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  db.query(songsQuery, [limit, offset], (err, results) => {
    if (err) {
      console.error("Error fetching songs:", err);
      return res.status(500).json({ error: "Database error" });
    }

    db.query(songsCountQuery, (err, countResult) => {
      if (err) {
        console.error("Error counting songs:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const totalSongs = countResult[0].totalSongs;
      const totalPages = Math.ceil(totalSongs / limit);

      res.json({
        songs: results,
        totalPages: totalPages,
      });
    });
  });
});

app.get("/emotions", (req, res) => {
  db.query(emotionsQuery, (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(rows);
  });
});

app.post("/submit", (req, res) => {
  const { pid, songResponses } = req.body;
  const allResults = generateAllResults(pid, songResponses);

  const ratingsValues = generateRatingsValues(allResults);
  const songEmotionsValues = generateSongEmotionsValues(allResults);

  db.query(ratingsQuery, [ratingsValues], (err) => {
    if (err) {
      console.error("Error saving ratings:", err);
      return res.status(500).json({ error: "DB error", detail: err.message });
    }

    db.query(songEmotionsQuery, [songEmotionsValues], (err) => {
      if (err) {
        console.error("Error saving song_emotions:", err);
        return res.status(500).json({ error: "DB error", detail: err.message });
      }

      res.sendStatus(204);
    });
  });
});

app.post("/participants", (req, res) => {
  const {
    daily_practice_years,
    not_musician_agreement,
    musical_preformer_compliment,
    num_instruments_played,
    talk_emotions_ability,
    evoke_past,
    rare_emotions,
    music_motivation,
  } = req.body;

  db.query(
    participantsQuery,
    [
      daily_practice_years,
      not_musician_agreement,
      musical_preformer_compliment,
      num_instruments_played,
      talk_emotions_ability,
      evoke_past,
      rare_emotions,
      music_motivation,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ participant_id: result.insertId });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
