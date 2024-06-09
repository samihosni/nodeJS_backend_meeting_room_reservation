const express = require('express');
const router = express.Router();
const {
    getReservations,
    createReservation,
    updateReservation,
    deleteReservation,
} = require('../controllers/reservationController');
const auth = require('../middleware/auth');
const { validateReservationCreation } = require('../middleware/validate');

router.get('/', auth, getReservations);
router.post('/', auth, validateReservationCreation, createReservation);
router.put('/:id', auth, validateReservationCreation, updateReservation);
router.delete('/:id', auth, deleteReservation);

module.exports = router;
