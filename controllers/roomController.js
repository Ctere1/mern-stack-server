const rooms = ['general', 'welcome', 'events', 'meeting'];

const getAllRooms = async (req, res) => {
    res.status(200).json(rooms)
}

module.exports = { getAllRooms }
