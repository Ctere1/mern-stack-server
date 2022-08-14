const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authRoutes  = require('./authRoutes');

//Create User
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, picture, referralFromCode } = req.body;
        const referralCode = makeCode(5);
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            const user = await User.create({ name, email, password, picture, referralCode, referralFromCode });
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
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//Get users
router.get('/all', validateToken, async (req, res) => {
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
router.delete('/delete', validateToken, async (req, res) => {
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
router.put('/update', validateToken, async (req, res) => {
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
router.put('/referral', validateToken, async (req, res) => {
    try {
        const { referralFromCode } = req.body.user;
        const user1 = await User.findOne({ referralFromCode });
        if (user1 && user1.referralFromCode !== '') {
            user1.referralFromCode = '';
            await user1.save();
            res.status(200).json(user1);
        }
        const user2 = await User.findOne({ referralCode: referralFromCode });
        console.log(user2);
        if (user2) {
            user2.points += 10;
            await user2.save();
            res.status(200).json(user2);
        }
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
})

function validateToken(req, res, next) {
    //get token from request header
    const authHeader = req.headers["authorization"]
    const token = authHeader.split(" ")[1]
    //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
    if (token == null) res.sendStatus(400).send("Token not present")
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.status(403).send("Token invalid")
        }
        else {
            req.user = user
            next() //proceed to the next action in the calling function
        }
    }) //end of jwt.verify()
} //end of function

module.exports = router