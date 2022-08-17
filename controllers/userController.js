const User = require('../models/User');
const jwt = require('jsonwebtoken');

//Signup User
const signupUser = async (req, res) => {
    try {
        const { name, email, password, picture, referralFromCode } = req.body;
        const referralCode = makeCode(5);
        const user = await User.signup(name, email, password, picture, referralCode, referralFromCode);
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
}

//Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
}

//Delete A User
const deleteUser = async (req, res) => {
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
}

//Update the User
const updateUser = async (req, res) => {
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
}

//Update the user point via referralCode
const updatePointViaReferralCode = async (req, res) => {
    try {
        const { referralFromCode } = req.body;
        const user1 = await User.findOne({ referralFromCode });
        if (user1 && user1.referralFromCode !== '') {
            user1.points += 20;
            user1.referralFromCode = '';
            await user1.save();
        }
        const user2 = await User.findOne({ referralCode: referralFromCode });
        if (user2) {
            user2.points += 50;
            await user2.save();
        }
        res.status(200).json('Referral Point Updated');
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

function makeCode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = { updatePointViaReferralCode, updateUser, deleteUser, signupUser, getAllUsers }