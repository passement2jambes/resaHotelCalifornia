import express from 'express';

import controllerReservations from '../controllers/controllerReservations.js';

const router = express.Router();

// On utilise le nom de la classe devant chaque méthode
router.get('/', controllerReservations.list);
router.get('/create', controllerReservations.showCreateForm);
router.post('/create', controllerReservations.create);
router.get('/:id/edit', controllerReservations.showEditForm);
router.post('/:id/edit', controllerReservations.edit);
router.post('/:id/delete', controllerReservations.remove);

export default router;