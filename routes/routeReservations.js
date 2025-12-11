import express from 'express';
import {
    list,
    showCreateForm,
    create,
    showEditForm,
    edit,
    remove
} from '../controllers/controllerReservations.js';

const router = express.Router();


router.get('/', controllerReservations.list);n
router.get('/create', controllerReservations.showCreateForm);
router.post('/create', controllerReservations.create);
router.get('/:id/edit', controllerReservations.showEditForm);
router.post('/:id/edit', controllerReservations.update);
router.post('/:id/delete', controllerReservations.remove);


export default router;
