const router = require('express').Router();
const User = require('../models/User');

//Create User
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, picture } = req.body;
        const referralCode = makeCode(5);
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            const user = await User.create({ name, email, password, picture, referralCode });
            res.status(201).json(user);
        } else {
            throw new Error("User already exists");
        }

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

function makeCode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

//Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const user = await User.findbyCredentials(email, password);
        user.status = 'online';
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
})

//Get users
router.get('/all', async (req, res) => {
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
router.delete('/delete', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            await user.delete();
            res.status(200).json('User Deleted');
        } else {
            throw new Error("User not exists");
        }
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
})

//update user: name/password
router.put('/update', async (req, res) => {
    try {
        const { newName, email, oldPassword, newPassword } = req.body;
        const user = await User.findbyCredentials(email, oldPassword);
        user.name = newName;
        if (newPassword) {
            user.password = newPassword;
        }
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
})

//user points update via referral code
router.put('/referral', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            user.points += 10;
            await user.save();
            res.status(200).json(user);
        } else {
            throw new Error("User not exists");
        }
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
})

module.exports = router