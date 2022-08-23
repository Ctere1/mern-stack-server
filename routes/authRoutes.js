const router = require('express').Router();

const { loginUser, logoutUser, refreshToken, googleLogin, googleSignup } = require('../controllers/authController');

//Refresh Token Route
router.post("/refreshToken", refreshToken)

//Logout user route
router.delete("/logout", logoutUser)

//Login user route
router.post('/login', loginUser)

//Handle google login
router.post("/googleLogin", googleLogin)

//Handle google signup
router.post("/googleSignup", googleSignup)


module.exports = router