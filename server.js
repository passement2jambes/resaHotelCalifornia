import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

// Import des routes
import routeAccueil from './routes/routeAccueil.js';
import routeChambres from './routes/routeChambres.js';
import routeClients from './routes/routeClients.js';
import reservationRoutes from './routes/reservations.js';

// Configuration des chemins pour ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialisation de l'application
const app = express();

// Moteur de vue
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(cors()); // Gestion des erreurs CORS
app.use(express.urlencoded({ extended: true })); // Lecture des formulaires
app.use(express.json()); // Lecture du JSON
app.use(express.static(path.join(__dirname, 'public'))); // Fichiers statiques

// Routes
// Route racine
app.get('/', (req, res) => {
    res.render('accueil', {
        title: 'Hôtel California - Système de Gestion'
    });
});

// Routes importées
app.use('/chambres', routeChambres);
app.use('/clients', routeClients);
app.use('/accueil', routeAccueil);
app.use('/reservations', reservationRoutes);

// 404
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Page non trouvée',
        error: "La page demandée n'existe pas."
    });
});

// Démarrage serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

export default app;
