import express from 'express';
import ControllerClients from '../controllers/controllerClients.js';

const routeur = express.Router();

// Route pour afficher tous les clients
routeur.get('/', ControllerClients.listClients);

// Route pour afficher le formulaire de création de client
routeur.get('/create', ControllerClients.formCreateClient);
// Route pour créer un client (traitement du formulaire)
routeur.post('/create', ControllerClients.createClient);

// Route pour afficher le formulaire de modification de client
routeur.get('/update/:id', ControllerClients.formUpdateClient);
// Route pour mettre à jour un client
routeur.post('/update/:id', ControllerClients.updateClient);

// Route pour supprimer un client
// Note: On utilise souvent POST pour la suppression dans les formulaires HTML classiques
routeur.post('/delete/:id', ControllerClients.deleteClient);

// Route pour afficher un client par son id
// IMPORTANT : Cette route doit rester en dernier pour ne pas bloquer /create ou /update
routeur.get('/:id', ControllerClients.clientUnique);

export default routeur;