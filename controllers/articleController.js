const Article = require('../models/articleModel');

exports.getArticles = (req, res) => {
    Article.getAll(req.query, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(rows);
    });
};

exports.getArticleById = (req, res) => {
    Article.getById(req.params.id, (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: "Article non trouvé" });
        res.status(200).json(row);
    });
};

exports.addArticle = (req, res) => {
    const { titre, contenu, auteur, categorie, tags } = req.body;
    if (!titre || !auteur) return res.status(400).json({ error: "Titre et auteur obligatoires" });

    const newArt = { 
        titre, contenu, auteur, categorie, tags,
        date: new Date().toISOString().split('T')[0] 
    };
    Article.create(newArt, (err, id) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Article créé avec succès", id });
    });
};

exports.updateArticle = (req, res) => {
    Article.update(req.params.id, req.body, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Article mis à jour avec succès" });
    });
};

exports.deleteArticle = (req, res) => {
    Article.delete(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Article supprimé avec succès" });
    });
};

exports.searchArticles = (req, res) => {
    const text = req.query.query;
    Article.search(text, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(rows);
    });
};
