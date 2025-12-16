//on commence par importer le modele
import modelChambres from '../models/modelChambres.js';

class ControllerChambres {

    //Afficher toutes les chambres
    static async listChambres(req, res) {
        try {
            const chambres = await modelChambres.findall();
            res.render('chambres/liste', { title: 'Toutes les chambres', chambres });
        } catch (error) {
            console.error('Erreur:', error);
            res.status(500).send('Erreur serveur');
        }
    }

    //afficher une chambre
    static async chambreUnique(req, res) {
        try {
            const chambre = await modelChambres.findbyid(req.params.id); //stock la chambre récupérée par son id
            if (!chambre) {
                res.status(404).send('Chambre non trouvée');
                return;
            }

            res.render('chambres/uneSeule', { //rend la vue uneseule.ejs si la chambre est trouvée
                title: 'La chambre',
                chambre
            });
        } catch (error) {
            console.error('Erreur:', error);
            res.status(500).send('Erreur serveur');
        }
    }

    //afficher le formulaire de création de chambre
    static async formCreateChambre(req, res) { // Méthode pour afficher le formulaire de création de chambre
        res.render('chambres/create', { title: 'Ajouter une chambre' }); // Rend la vue 'create' pour ajouter une chambre
    }


    //Créer une chambre
    static async createChambre(req, res) { // Méthode pour créer une nouvelle chambre
        const {numero, capacite, disponibilite} = req.body; //recupère les données 

        try { //filtres
            if (parseInt(numero) <=0 || parseInt(numero) > 2000) {
                return res.render('chambres/create', {
                    title: 'Ajouter une chambre',
                    error: 'Le numéro de chambre doit être entre 1 et 2000.',
                    data: req.body //sert a renvoyer le contenu du formulaire déjà rempli
                });
            }

            if (parseInt(capacite) <=0 || parseInt(capacite) > 6) {
                return res.render ('chambres/create', {
                    title: 'Ajouter une chambre',
                    error: 'La chambre ne peut accueillir qu\'un maximum de 6 personnes.',
                    data: req.body
                });
            }

            await modelChambres.create({ numero, capacite, disponibilite }); // méthode create pour insérer une nouvelle chambre
            res.redirect('/chambres');

        }
        catch (error) {
            // Si le modèle plante
            console.error(error);
            res.render('chambres/create', {
                title: 'Ajouter une chambre',
                error: 'Erreur technique lors de la creation de la chambre',
                data: req.body
            });

        }
    }


    //afficher le formulaire de modification de chambre
    static async formUpdateChambre(req, res) {
        try {
            const chambre = await modelChambres.findbyid(req.params.id);
            if (!chambre) {
                return res.status(404).send('Chambre non trouvée');
            }
            
            res.render('chambres/update', { title: 'Modifier la chambre', chambre });

        } catch (error) {
            console.error('Erreur:', error);
            res.status(500).send('Erreur serveur');
        }
    }

    //mettre à jour une chambre
    static async updateChambre(req, res) {
        const id = req.params.id;
        const { numero, capacite, disponibilite } = req.body;
        try {

            if (parseInt(numero) <=0 || parseInt(numero) > 2000) {
                return res.render('chambres/update', {
                    title: 'modifier une chambre',
                    error: 'Le numéro de chambre doit être entre 1 et 2000.',
                    // On crée un "faux" objet chambre avec l'ID + les données du form
                    chambre: { 
                        idChambre : id, // on indique que l'id = idChambre danas la bdd
                        numero, 
                        capacite, 
                        disponibilite 
                    } 
                });
            }

            if (parseInt(capacite) <=0 || parseInt(capacite) > 6) {
                return res.render ('chambres/update', {
                    title: 'modifier une chambre',
                    error: 'La chambre ne peut accueillir qu\'un maximum de 6 personnes.',
                    chambre: { 
                        idChambre : id, // on indique que l'id = idChambre danas la bdd
                        numero, 
                        capacite, 
                        disponibilite 
                    } 
                });
            }

            const data = { numero, capacite, disponibilite };
            await modelChambres.update(id, data); // Appelle la méthode update du modèle pour mettre à jour une chambre
            res.redirect('/chambres'); // Redirige vers la liste des chambres après la mise à jour

        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            res.status(500).send('Erreur lors de la mise à jour de la chambre');
        }
    }

    //supprimer une chambre

}

export default ControllerChambres;