const express = require('express');
const router = express.Router();
const articleCtrl = require('../controllers/articleController');

// Route de recherche (doit être placée avant /:id)
router.get('/search', articleCtrl.searchArticles);

// Routes CRUD standards
router.get('/', articleCtrl.getArticles);          // Lire tous / Filtrer
router.get('/:id', articleCtrl.getArticleById);    // Lire un unique
router.post('/', articleCtrl.addArticle);          // Créer
router.put('/:id', articleCtrl.updateArticle);     // Modifier
router.delete('/:id', articleCtrl.deleteArticle);  // Supprimer

module.exports = router;
