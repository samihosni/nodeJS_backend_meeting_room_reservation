const Room = require('../models/Room');

exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.createRoom = async (req, res) => {
    const { name, capacity, equipment } = req.body;
    try {
        let room = new Room({ name, capacity, equipment });
        await room.save();
        res.json(room);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
