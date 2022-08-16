const router = require('express').Router();

const { loginUser, logoutUser, refreshToken } = require('../controllers/authController');

//Refresh Token Route
router.post("/refreshToken", refreshToken)

//Logout user route
router.delete("/logout", logoutUser)

//Login user route
router.post('/login', loginUser)


module.exports = router