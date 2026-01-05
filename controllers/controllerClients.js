// On commence par importer le modèle
import modelClients from '../models/modelClients.js';

class ControllerClients {

    // Afficher tous les clients
    static async listClients(req, res) {
        try {
            const clients = await modelClients.findall();
            // On suppose que tu as un dossier views/clients/
            res.render('clients/liste', { title: 'Liste des clients', clients });
        } catch (error) {
            console.error('Erreur:', error);
            res.status(500).send('Erreur serveur');
        }
    }

    // Afficher un client unique
    static async clientUnique(req, res) {
        try {
            const client = await modelClients.findbyid(req.params.id); // Stocke le client récupéré

            if (!client) {
                res.status(404).send('Client non trouvé');
                return;
            }

            res.render('clients/unSeul', { // Rend la vue detail client
                title: 'Fiche client',
                client
            });
        } catch (error) {
            console.error('Erreur:', error);
            res.status(500).send('Erreur serveur');
        }
    }

    // Afficher le formulaire de création de client
    static async formCreateClient(req, res) {
        res.render('clients/create', { title: 'Ajouter un client' });
    }

    // Créer un client (Traitement du formulaire)
    static async createClient(req, res) {
        const data = { // Récupère les données du formulaire
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            telephone: req.body.telephone
        };

        try {
            await modelClients.create(data); // Appelle la méthode create du modèle
            res.redirect('/clients'); // Redirige vers la liste des clients
        } catch (error) {
            console.error('Erreur création:', error);
            // Idéalement, on renverrait vers le formulaire avec un message d'erreur
            res.status(500).send('Erreur lors de la création du client (Email peut-être déjà pris)');
        }
    }

    // Afficher le formulaire de modification de client
    static async formUpdateClient(req, res) {
        try {
            const client = await modelClients.findbyid(req.params.id);
            if (!client) {
                return res.status(404).send('Client non trouvé');
            }
            res.render('clients/update', { title: 'Modifier le client', client });
        } catch (error) {
            console.error('Erreur:', error);
            res.status(500).send('Erreur serveur');
        }
    }

    // Mettre à jour un client
    static async updateClient(req, res) {
        const id = req.params.id;
        const data = { // Récupère les données du formulaire
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            telephone: req.body.telephone
        };
        try {
            await modelClients.update(id, data);
            res.redirect('/clients');
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            res.status(500).send('Erreur lors de la mise à jour du client');
        }
    }

    // Supprimer un client
    static async deleteClient(req, res) {
        const id = req.params.id;
        try {
            await modelClients.delete(id);
            res.redirect('/clients'); // On retourne à la liste après suppression
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            res.status(500).send('Erreur lors de la suppression (Le client a peut-être des réservations)');
        }
    }
}

export default ControllerClients;