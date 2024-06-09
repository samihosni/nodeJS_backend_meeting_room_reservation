const Reservation = require('../models/Reservation');
const Room = require('../models/Room');

exports.getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.user.id }).populate('room');
        res.json(reservations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.createReservation = async (req, res) => {
    const { room, startTime, endTime } = req.body;
    try {
        // Vérifiez d'abord si la salle est disponible
        let existingRoom = await Room.findById(room);
        if (!existingRoom) {
            return res.status(404).json({ msg: 'Room not found' });
        }
        if (!existingRoom.availability) {
            return res.status(400).json({ msg: 'Room is not available for reservation' });
        }

        // Vérifiez ensuite s'il y a des conflits de réservation
        const conflictingReservations = await Reservation.find({
            room,
            $or: [
                { startTime: { $lt: endTime, $gt: startTime } },
                { endTime: { $gt: startTime, $lt: endTime } }
            ]
        });

        if (conflictingReservations.length > 0) {
            return res.status(400).json({ msg: 'Time slot already booked' });
        }

        // Si tout est OK, créez la réservation
        let reservation = new Reservation({
            user: req.user.id,
            room,
            startTime,
            endTime
        });

        await reservation.save();

        // Mettez à jour la disponibilité de la salle à false
        existingRoom.availability = false;
        await existingRoom.save();

        res.json(reservation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.updateReservation = async (req, res) => {
    const { room, startTime, endTime } = req.body;
    try {
        let reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ msg: 'Reservation not found' });
        }

        if (reservation.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        reservation.room = room || reservation.room;
        reservation.startTime = startTime || reservation.startTime;
        reservation.endTime = endTime || reservation.endTime;

        await reservation.save();
        res.json(reservation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        let reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ msg: 'Reservation not found' });
        }

        if (reservation.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await reservation.remove();
        res.json({ msg: 'Reservation removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
