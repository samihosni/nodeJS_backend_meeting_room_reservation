const express = require('express');
const router = express.Router();
const { getRooms, createRoom } = require('../controllers/roomController');
const auth = require('../middleware/auth');

router.get('/', getRooms);
router.post('/', auth, createRoom);

module.exports = router;
