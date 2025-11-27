import express from 'express';

const router = express.Router();

// Route temporaire (en attendant les contrôleurs)
router.get('/', (req, res) => {
    res.send("Module Chambres fonctionnel (en construction)");
});

// INDISPENSABLE : C'est ce qui manque actuellement
export default router;