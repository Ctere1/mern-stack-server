const router = require('express').Router();

const { updatePointViaReferralCode, updateUser, deleteUser, signupUser, getAllUsers } = require('../controllers/userController');
const validateToken = require('../middleware/validateToken');

//Signup User
router.post('/signup', signupUser)

//Get all users
router.get('/all', validateToken, getAllUsers)

//Delete user
router.delete('/delete', validateToken, deleteUser)

//Update user: name/password
router.put('/update', validateToken, updateUser)

//User point update via referral code
router.put('/referral', validateToken, updatePointViaReferralCode)

module.exports = router