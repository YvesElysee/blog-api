const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const swaggerUi = require('swagger-ui-express');

// On importe directement le fichier JSON qu'on a créé à l'étape 1
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = process.env.PORT || 3000; 

// Endpoint pour la doc Swagger (Alternative Stable)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Base de Données
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) console.error("Erreur BD:", err.message);
  else {
    console.log('✅ Base de données SQLite connectée.');
    db.run(`CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titre TEXT NOT NULL,
      contenu TEXT,
      auteur TEXT NOT NULL,
      date TEXT,
      categorie TEXT,
      tags TEXT
    )`);
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); 

// --- ENDPOINTS API ---

app.get('/api/articles', (req, res) => {
  db.all("SELECT * FROM articles ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/articles/search', (req, res) => {
  const query = req.query.query;
  db.all("SELECT * FROM articles WHERE titre LIKE ? OR contenu LIKE ?", [`%${query}%`, `%${query}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/articles', (req, res) => {
  const { titre, contenu, auteur, categorie, tags } = req.body;
  if (!titre || !auteur) return res.status(400).json({ error: "Champs requis" });
  
  const date = new Date().toISOString().split('T')[0];
  const sql = `INSERT INTO articles (titre, contenu, auteur, date, categorie, tags) VALUES (?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [titre, contenu, auteur, date, categorie, tags], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, message: "Article créé" });
  });
});

app.delete('/api/articles/:id', (req, res) => {
  db.run("DELETE FROM articles WHERE id = ?", req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Supprimé" });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur actif sur le port ${PORT}`);
});
