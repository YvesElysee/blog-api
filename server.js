const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000; 

// CONFIGURATION SWAGGER
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Mon Blog API',
      version: '1.0.0',
      description: 'Documentation de l\'API du blog d\'Elysée - Projet INF222',
    },
    servers: [
      {
        url: 'https://taf1-inf222.onrender.com',
      },
    ],
  },
  apis: ['./server.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

/**
 * @openapi
 * /api/articles:
 * get:
 * summary: Récupérer tous les articles
 * responses:
 * 200:
 * description: Succès
 */
app.get('/api/articles', (req, res) => {
  let sql = "SELECT * FROM articles ORDER BY id DESC";
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/**
 * @openapi
 * /api/articles/search:
 * get:
 * summary: Rechercher un article
 * parameters:
 * - in: query
 * name: query
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Succès
 */
app.get('/api/articles/search', (req, res) => {
  const query = req.query.query;
  db.all("SELECT * FROM articles WHERE titre LIKE ? OR contenu LIKE ?", [`%${query}%`, `%${query}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/**
 * @openapi
 * /api/articles:
 * post:
 * summary: Créer un article
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * titre:
 * type: string
 * contenu:
 * type: string
 * auteur:
 * type: string
 * categorie:
 * type: string
 * responses:
 * 201:
 * description: Créé
 */
app.post('/api/articles', (req, res) => {
  const { titre, contenu, auteur, categorie, tags } = req.body;
  if (!titre || !auteur) return res.status(400).json({ error: "Champs requis" });
  const date = new Date().toISOString().split('T')[0];
  const sql = `INSERT INTO articles (titre, contenu, auteur, date, categorie, tags) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [titre, contenu, auteur, date, categorie, tags], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

/**
 * @openapi
 * /api/articles/{id}:
 * delete:
 * summary: Supprimer un article
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Supprimé
 */
app.delete('/api/articles/:id', (req, res) => {
  db.run("DELETE FROM articles WHERE id = ?", req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Supprimé" });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur actif sur le port ${PORT}`);
});
