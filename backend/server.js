const express = require('express');
const app = express();
const db = require('./config/db'); // Importing the database config
const port = 5000; // Port for the server
const cors = require('cors');


app.use(express.json());
app.use(cors());


app.get('/songs', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Number of songs per page
    const offset = (page - 1) * limit; // Offset for pagination

    // Query the database to get the songs for the current page
    const query = 'SELECT song_id AS id, title, artist, url FROM songs LIMIT ? OFFSET ?';

    db.query(query, [limit, offset], (err, results) => {
        if (err) {
            console.error('Error fetching songs:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // Get the total number of songs to calculate total pages
        const countQuery = 'SELECT COUNT(*) AS totalSongs FROM songs';
        db.query(countQuery, (err, countResult) => {
            if (err) {
                console.error('Error counting songs:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            const totalSongs = countResult[0].totalSongs;
            const totalPages = Math.ceil(totalSongs / limit); // Total pages based on number of songs and limit

            res.json({
                songs: results,
                totalPages: totalPages
            });
        });
    });
});



// 1) GET /emotions → return all emotion options
app.get('/emotions', (req, res) => {
    const q = 'SELECT emotion_id AS id, name FROM emotions';
    db.query(q, (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json(rows);
    });
  });
  
  // 2) POST /knowledge → record just knows_song (inserts or updates ratings)
  app.post('/knowledge', (req, res) => {
    const { participant_id, song_id, knows_song } = req.body;
    const q = `
      INSERT INTO ratings (participant_id, song_id, score, knows_song)
      VALUES (?, ?, 1, ?)
      ON DUPLICATE KEY UPDATE knows_song = ?
    `;
    db.query(q, [participant_id, song_id, knows_song, knows_song], (err) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.sendStatus(204);
    });
  });
  
  // 3) PUT /ratings → update the score once the user picks stars
  app.put('/ratings', (req, res) => {
    const { participant_id, song_id, score } = req.body;
    const q = `
      UPDATE ratings
      SET score = ?
      WHERE participant_id = ? AND song_id = ?
    `;
    db.query(q, [score, participant_id, song_id], (err) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.sendStatus(204);
    });
  });
  
  // 4) POST /song_emotions → record the chosen emotions (clears old, inserts new)
  app.post('/song_emotions', (req, res) => {
    const { participant_id, song_id, emotions } = req.body; // emotions = [emotion_id,…]
    // 4a) delete old
    db.query(
      'DELETE FROM song_emotions WHERE participant_id=? AND song_id=?',
      [participant_id, song_id],
      (err) => {
        if (err) return res.status(500).json({ error: 'DB error' });
        // 4b) bulk insert new
        if (!emotions.length) return res.sendStatus(204);
        const vals = emotions.map(id => [participant_id, song_id, id]);
        db.query(
          'INSERT INTO song_emotions (participant_id, song_id, emotion_id) VALUES ?',
          [vals],
          (err2) => {
            if (err2) return res.status(500).json({ error: 'DB error' });
            res.sendStatus(204);
          }
        );
      }
    );
  });

// 5) POST /participants → create a new participant
app.post('/participants', (req, res) => {
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
    db.query(q, [
      daily_practice_years,
      not_musician_agreement,
      formal_training_years,
      music_theory_years,
      talk_emotions_ability,
      trigger_shivers,
      rare_emotions,
      music_motivation
    ], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ participant_id: result.insertId });
    });
  });
  
  

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});