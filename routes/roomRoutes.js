const router = require('express').Router();

const { getAllRooms } = require('../controllers/roomController');

//Get all rooms
router.get("", getAllRooms)

module.exports = router