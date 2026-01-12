import ModelReservations from '../models/modelReservations.js';

import ModelChambres from '../models/modelChambres.js'; 
import ModelClients from '../models/modelClients.js';

class controllerReservations {  
    // Afficher toutes les réservations
 static async list(req, res) {
    try {
        const reservations = await ModelReservations.findAll(); // Récupère toutes les résas
        res.render('reservations/index', {
            title: 'Liste des réservations',
            reservations
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// Afficher le formulaire de création
static async showCreateForm(req, res) {
    try {
        const chambres = await ModelChambres.findAll(); // Liste des chambres
        const clients = await ModelClients.findAll();   // Liste des clients

        res.render('reservations/create', {
            title: 'Ajouter une réservation',
            chambres,
            clients,
            errors: [],
            data: {}
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// Traiter l'ajout d'une réservation
static async create(req, res) {
    try {
        const { idClient, idChambre, dateDebut, dateFin } = req.body;
        const errors = [];

        // Vérifications simples
        if (!idClient) errors.push('Client obligatoire');
        if (!idChambre) errors.push('Chambre obligatoire');
        if (!dateDebut || !dateFin) errors.push('Dates obligatoires');
        if (dateDebut >= dateFin) errors.push('Date de début avant date de fin');

        if (errors.length > 0) {
            const chambres = await ModelChambres.findAll();
            const clients = await ModelClients.findAll();
            return res.render('reservations/create', {
                title: 'Ajouter une réservation',
                chambres,
                clients,
                errors,
                data: req.body
            });
        }

        await ModelReservations.create({ idClient, idChambre, dateDebut, dateFin });
        res.redirect('/reservations');
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// Formulaire d’édition
static async showEditForm(req, res) {
    try {
        const reservation = await ModelReservations.findById(req.params.id);

        if (!reservation) return res.redirect('/reservations');

        const chambres = await ModelChambres.findAll();
        const clients = await ModelClients.findAll();

        res.render('reservations/edit', {
            title: 'Modifier réservation',
            reservation,
            chambres,
            clients,
            errors: []
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// Traitement de modification
static async edit(req, res) {
    try {
        const { idClient, idChambre, dateDebut, dateFin } = req.body;

        await ModelReservations.update(req.params.id, {
            idClient,
            idChambre,
            dateDebut,
            dateFin
        });

        res.redirect('/reservations');
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// Suppression
static async remove(req, res) {
    try {
        await ModelReservations.delete(req.params.id);
        res.redirect('/reservations');
    } catch (error) {
        res.status(500).send(error.message);
    }
}
}

export default controllerReservations;