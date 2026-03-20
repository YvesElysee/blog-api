const db = require('../database');

const Article = {
    // Lire tous les articles avec filtres optionnels (catégorie, auteur, date)
    getAll: (filters, callback) => {
        let sql = "SELECT * FROM articles WHERE 1=1";
        let params = [];
        if (filters.categorie) { sql += " AND categorie = ?"; params.push(filters.categorie); }
        if (filters.auteur) { sql += " AND auteur = ?"; params.push(filters.auteur); }
        if (filters.date) { sql += " AND date = ?"; params.push(filters.date); }
        db.all(sql, params, callback);
    },

    // Lire un article unique par ID
    getById: (id, callback) => {
        db.get("SELECT * FROM articles WHERE id = ?", [id], callback);
    },

    // Créer un article
    create: (data, callback) => {
        const { titre, contenu, auteur, date, categorie, tags } = data;
        db.run(`INSERT INTO articles (titre, contenu, auteur, date, categorie, tags) 
                VALUES (?, ?, ?, ?, ?, ?)`,
            [titre, contenu, auteur, date, categorie, tags], 
            function(err) { callback(err, this.lastID); });
    },

    // Modifier un article
    update: (id, data, callback) => {
        const { titre, contenu, categorie, tags } = data;
        db.run(`UPDATE articles SET titre = ?, contenu = ?, categorie = ?, tags = ? WHERE id = ?`,
            [titre, contenu, categorie, tags, id], callback);
    },

    // Supprimer un article
    delete: (id, callback) => {
        db.run("DELETE FROM articles WHERE id = ?", [id], callback);
    },

    // Rechercher dans le titre ou le contenu
    search: (text, callback) => {
        db.all("SELECT * FROM articles WHERE titre LIKE ? OR contenu LIKE ?", 
            [`%${text}%`, `%${text}%`], callback);
    }
};

module.exports = Article;
