// Modele, contient la classe clients avec les requetes sql et la connexion a la bdd

import connexion from '../config/connexion.js';

class ModelClients { // Création du modèle Clients
    constructor(data) { // Constructeur
        this.idClient = data.idClient;
        this.nom = data.nom;
        this.prenom = data.prenom;
        this.telephone = data.telephone;
        this.email = data.email;
    }

    // Récupérer tous les clients
    static async findall() {
        try {
            const [rows] = await connexion.execute('SELECT * FROM clients');
            return rows.map(row => new ModelClients(row)); // Retourne un tableau d'objets clients
        }
        catch (error) {
            throw new Error('Erreur lors de la récupération des clients: ' + error.message);
        }
    }

    // Récupérer un client par son id
    static async findbyid(id) {
        try {
            const [rows] = await connexion.execute('SELECT * FROM clients WHERE idClient = ?', [id]);
            return rows.length > 0 ? new ModelClients(rows[0]) : null;
        }
        catch (error) {
            throw new Error('Erreur lors de la récupération du client: ' + error.message);
        }
    }

    // Créer un client
    static async create(data) {
        try {
            const [result] = await connexion.execute(
                'INSERT INTO clients (nom, prenom, email, telephone) VALUES (?, ?, ?, ?)',
                [data.nom, data.prenom, data.email, data.telephone]
            );
            return result.insertId; // Retourne l'ID du nouveau client
        }
        catch (error) {
            // Gestion de l'erreur si l'email est défini comme UNIQUE dans la BDD
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Erreur : Cette adresse email est déjà enregistrée.');
            }
            throw new Error('Erreur lors de la création du client: ' + error.message);
        }
    }

    // Mettre à jour un client
    static async update(id, data) {
        try {
            await connexion.execute(
                'UPDATE clients SET nom = ?, prenom = ?, email = ?, telephone = ? WHERE idClient = ?',
                [data.nom, data.prenom, data.email, data.telephone, id]
            );
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Erreur : Cette adresse email est déjà utilisée par un autre client.');
            }
            throw new Error('Erreur lors de la mise à jour du client: ' + error.message);
        }
    }

    // Supprimer un client
    static async delete(id) {
        try {
            await connexion.execute('DELETE FROM clients WHERE idClient = ?', [id]);
        } catch (error) {
            // Optionnel: Gestion d'erreur si le client a des réservations en cours (clé étrangère)
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new Error('Impossible de supprimer ce client car il possède des réservations.');
            }
            throw new Error('Erreur lors de la suppression du client: ' + error.message);
        }
    }
}

export default ModelClients;