const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Load scores
let scores = { highScore: 0 };
if (fs.existsSync('scores.json')) {
  scores = JSON.parse(fs.readFileSync('scores.json'));
}

// Get high score
app.get('/highscore', (req, res) => {
  res.json({ highScore: scores.highScore });
});

// Save score
app.post('/savescore', (req, res) => {
  const { score } = req.body;
  if (score > scores.highScore) {
    scores.highScore = score;
    fs.writeFileSync('scores.json', JSON.stringify(scores));
  }
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
