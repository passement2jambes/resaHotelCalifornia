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
                title: 'Voici votre chambre',
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
        const data = { // Récupère les données du formulaire
            numero: req.body.numero,
            capacite: req.body.capacite,
            disponibilite: req.body.disponibilite
        };
        await modelChambres.create(data); // Appelle la méthode create du modèle pour insérer une nouvelle chambre
        res.redirect('/chambres'); // Redirige vers la liste des chambres après la création
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
        const data = { // Récupère les données du formulaire
            numero: req.body.numero, //body car les données viennent du formulaire
            capacite: req.body.capacite,
            disponibilite: req.body.disponibilite
        };
        try {
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