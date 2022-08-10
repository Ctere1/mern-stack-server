const router = require('express').Router();
const User = require('../models/User');

//Create User
router.post('/', async (req, res) => {
    try {
        const { name, email, password, picture, referralCode } = req.body;
        console.log(req.body);
        const user = await User.create({ name, email, password, picture, referralCode });
        res.status(201).json(user);
    } catch (error) {
        let message;
        if (error.code == 11000) {
            message = "User already exists";
        } else {
            message = error.message;
        }
        console.log(error);
        res.status(400).json(message);
    }
})

//Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const user = await User.findbyCredentials(email, password, false);
        user.status = 'online';
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
})

//Get users
router.get('/users', async (req, res) => {
    try {
        const users = await User.getAll();
        console.log(users);
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
})

//delete user
router.delete('/user-delete', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findbyCredentials(email, password, true);
        await user.delete();
        res.status(200).json('User Deleted');
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
})

//update user
router.put('/user-update', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findbyCredentials(email, password, true);
        user.points += 10;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
})

module.exports = router