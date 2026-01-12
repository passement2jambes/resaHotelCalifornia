import { describe, it, expect, vi, beforeEach } from 'vitest'
import ControllerChambres from '../../controllers/controllerChambres.js'
import modelChambres from '../../models/modelChambres.js';
vi.mock('../../models/modelChambres.js'); //pour ne pas impacter la vraie bdd


describe('vérifier le controleur chambres', () => {
    //variables test
    let req, res;

    // Avant chaque test, on remet les compteurs à zéro
    beforeEach(() => {
        req = { body: {} }; //requête vide
        res = {
            render: vi.fn(),   // Espions
            redirect: vi.fn(),
            status: vi.fn().mockReturnThis(), // Pour pouvoir faire res.status().send()
            send: vi.fn()
        };
        // On nettoie les espions du modèle
        vi.clearAllMocks();
    });

    it('doit retourner la liste des chambres', async () => {
        const faussesChambres = [
            { idChambre: 1, numero: 101, capacite: 2, disponibilite: 1 },
            { idChambre: 2, numero: 102, capacite: 3, disponibilite: 0 }
        ];

        //dire au faux modele que c'est OK
        modelChambres.findall.mockResolvedValue(faussesChambres);

        await ControllerChambres.listChambres(req, res);

        //verifie que res render donne bien list 
        expect(res.render).toHaveBeenCalledWith(
            'chambres/liste',

            //On vérifie le 2ème argument qui est les données
            expect.objectContaining({
                chambres: faussesChambres
            })
        );
    });

    describe('Chambre unique', () => {
        it('doit récupérer une chambre par son id quand il existe', async () => {
            const fausseChambre = { idChambre: 1, numero: 101, capacite: 2, disponibilite: 1 };

            req.params = { id: 1 };

            modelChambres.findbyid.mockResolvedValue(fausseChambre); // Simule la récupération de la chambre

            await ControllerChambres.chambreUnique(req, res);

            expect(res.render).toHaveBeenCalledWith(
                'chambres/uneSeule',
                expect.objectContaining({
                    chambre: fausseChambre
                })
            );
        });

        it('doit gérer le cas où la chambre n\'existe pas', async () => {
            req.params = { id: 999 };

            modelChambres.findbyid.mockResolvedValue(null); // Simule chambre non trouvée

            await ControllerChambres.chambreUnique(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('Chambre non trouvée');
        });
    });

    describe('Création de chambre', () => {
        it('doit créer une chambre avec des données valides', async () => {
            req = {
                body: {
                    numero: 150,
                    capacite: 3,
                    disponibilite: 1
                }
            };

            modelChambres.create.mockResolvedValue(true); //modele ok ca a ete créer

            await ControllerChambres.createChambre(req, res);
            expect(res.redirect).toHaveBeenCalledWith('/chambres');

            expect(res.render).not.toHaveBeenCalled();
        });

        it ('créer une chambre avec un numéro invalide', async () => {
            req = {
                body: {
                    numero: 2500, //numéro invalide
                    capacite: 3,
                    disponibilite: 1
                }
            };

            modelChambres.create.mockResolvedValue(true);

            await ControllerChambres.createChambre(req, res);
            expect(res.render).toHaveBeenCalledWith(
                'chambres/create',
                expect.objectContaining({
                    error: 'Le numéro de chambre doit être entre 1 et 2000.',
                    data: req.body
                })
            );

            expect(res.redirect).not.toHaveBeenCalled();
        });

        it ('créer une chambre avec une capacité invalide', async () => {
            req = {
                body: {
                    numero: 150,
                    capacite: 10, //capacité invalide
                    disponibilite: 1
                }
            };

            modelChambres.create.mockResolvedValue(true);

            await ControllerChambres.createChambre(req, res);
            expect(res.render).toHaveBeenCalledWith(
                'chambres/create',
                expect.objectContaining({
                    error: 'La chambre ne peut accueillir qu\'un maximum de 6 personnes.',
                    data: req.body
                })
            );

            expect(res.redirect).not.toHaveBeenCalled();
        });

    });

    it ('supprimer une chambre', async () => {
        req.params = { id: 1 };

        modelChambres.delete.mockResolvedValue(true); //simule la suppression

        await ControllerChambres.deleteChambre(req, res);

        expect(res.redirect).toHaveBeenCalledWith('/chambres');
    });

});