const express = require("express");
const app = express();
const db = require("./config/db"); // Importing the database config
const port = 5000; // Port for the server
const cors = require("cors");
const { generateAllResults } = require("./functions/generateAllResults");
const { generateRatingsValues } = require("./functions/generateRatingsValues");
const {
  generateSongEmotionsValues,
} = require("./functions/generateSongEmotionsValues");
const { ratingsQuery } = require("./queries/ratingsQuery");
const { songEmotionsQuery } = require("./queries/songEmotionsQuery");

app.use(express.json());
app.use(cors());

app.get("/songs", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10; // Number of songs per page
  const offset = (page - 1) * limit; // Offset for pagination

  // Query the database to get the songs for the current page
  const query =
    "SELECT song_id AS id, title, artist, url FROM songs LIMIT ? OFFSET ?";

  db.query(query, [limit, offset], (err, results) => {
    if (err) {
      console.error("Error fetching songs:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Get the total number of songs to calculate total pages
    const countQuery = "SELECT COUNT(*) AS totalSongs FROM songs";
    db.query(countQuery, (err, countResult) => {
      if (err) {
        console.error("Error counting songs:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const totalSongs = countResult[0].totalSongs;
      const totalPages = Math.ceil(totalSongs / limit); // Total pages based on number of songs and limit

      res.json({
        songs: results,
        totalPages: totalPages,
      });
    });
  });
});

// 1) GET /emotions → return all emotion options
app.get("/emotions", (req, res) => {
  const q = "SELECT emotion_id AS id, name FROM emotions";
  db.query(q, (err, rows) => {
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

// 5) POST /participants → create a new participant
app.post("/participants", (req, res) => {
  const {
    daily_practice_years,
    not_musician_agreement,
    formal_training_years,
    music_theory_years,
    talk_emotions_ability,
    trigger_shivers,
    rare_emotions,
    music_motivation,
  } = req.body;

  const q = `
      INSERT INTO participants
        (daily_practice_years, not_musician_agreement, formal_training_years,
         music_theory_years, talk_emotions_ability, trigger_shivers,
         rare_emotions, music_motivation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
  db.query(
    q,
    [
      daily_practice_years,
      not_musician_agreement,
      formal_training_years,
      music_theory_years,
      talk_emotions_ability,
      trigger_shivers,
      rare_emotions,
      music_motivation,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ participant_id: result.insertId });
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
