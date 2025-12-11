import connexion from '../config/connexion.js';

class ModelReservations {
    constructor(data) {
        this.reservation_id = data.reservation_id;
        this.idClient = data.idClient;
        this.idChambre = data.idChambre;
        this.dateDebut = data.dateDebut;
        this.dateFin = data.dateFin;
    }

    // Récupérer toutes les réservations
    static async findAll() {
        const [rows] = await connexion.execute('SELECT * FROM reservations');
        return rows.map(r => new ModelReservations(r));
    }

    // Récupérer une seule réservation
    static async findById(id) {
        const [rows] = await connexion.execute(
            'SELECT * FROM reservations WHERE reservation_id = ?',
            [id]
        );
        return rows.length ? new ModelReservations(rows[0]) : null;
    }

    // Créer une réservation
    static async create(data) {
        const [result] = await connexion.execute(
            'INSERT INTO reservations (idClient, idChambre, dateDebut, dateFin) VALUES (?, ?, ?, ?)',
            [data.idClient, data.idChambre, data.dateDebut, data.dateFin]
        );
        return result.insertId;
    }

    // Modifier une réservation
    static async update(id, data) {
        await connexion.execute(
            'UPDATE reservations SET idClient=?, idChambre=?, dateDebut=?, dateFin=? WHERE reservation_id=?',
            [data.idClient, data.idChambre, data.dateDebut, data.dateFin, id]
        );
    }

    // Supprimer une réservation
    static async delete(id) {
        await connexion.execute(
            'DELETE FROM reservations WHERE reservation_id = ?',
            [id]
        );
    }
}

export default ModelReservations;
  