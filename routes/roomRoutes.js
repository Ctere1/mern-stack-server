const router = require('express').Router();

const { getAllRooms } = require('../controllers/roomController');
const validateToken = require('../middleware/validateToken');

//Get all rooms
router.get("", validateToken, getAllRooms)

module.exports = router