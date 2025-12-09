import express from 'express';
import ControllerChambres from '../controllers/controllerChambres.js';

const routeur = express.Router();

//route pour afficher toutes les chambres
routeur.get('/', ControllerChambres.listChambres);


//route pour afficher le formulaire de création de chambre
routeur.get('/create', ControllerChambres.formCreateChambre);
//route pour créer une chambre
routeur.post('/create', ControllerChambres.createChambre);


//route pour afficher le formulaire de modification de chambre
routeur.get('/update/:id', ControllerChambres.formUpdateChambre);
//route pour mettre à jour une chambre
routeur.post('/update/:id', ControllerChambres.updateChambre);


//route pour afficher une chambre par son id
routeur.get('/:id', ControllerChambres.chambreUnique);

//route pour supprimer une chambre
//routeur.post('/delete/:id', ControllerChambres.deleteChambre);

export default routeur;