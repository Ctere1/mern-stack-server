const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//REFRESH TOKEN API
router.post("/refreshToken", (req, res) => {
    console.log(refreshTokens);
    if (!refreshTokens.includes(req.body.token)) {
        res.status(400).json("Refresh Token Invalid")
    }
    //remove the old refreshToken from the refreshTokens list
    refreshTokens = refreshTokens.filter((c) => c != req.body.token)
    //generate new accessToken and refreshToken
    const accessToken = generateAccessToken({ user: req.body.email });
    const refreshToken = generateRefreshToken({ user: req.body.email });
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

let refreshTokens = []
function generateRefreshToken(user) {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "20m" });
    refreshTokens.push(refreshToken);
    return refreshToken
}

router.delete("/logout", (req, res) => {
    refreshTokens = refreshTokens.filter((c) => c != req.body.token)
    //remove the old refreshToken from the refreshTokens list
    res.status(204).send("Logged out!")
})

//Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const user = await User.findbyCredentials(email, password);
        const accessToken = generateAccessToken({ user: email });
        const refreshToken = generateRefreshToken({ user: email });
        user.status = 'online';
        await user.save();
        res.status(200).json({ user: user, accessToken: accessToken, refreshToken: refreshToken });
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
})


module.exports = router