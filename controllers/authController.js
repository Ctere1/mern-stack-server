const User = require('../models/User');
const jwt = require('jsonwebtoken');

//Generate Access Token
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

let refreshTokens = []
//Generate Refresh Token
function generateRefreshToken(user) {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "20m" });
    refreshTokens.push(refreshToken);
    return refreshToken;
}

//Refresh Token
const refreshToken = (req, res) => {
    if (!refreshTokens.includes(req.body.token)) {
        res.status(400).json("Refresh Token Invalid")
    }
    //remove the old refreshToken from the refreshTokens list
    refreshTokens = refreshTokens.filter((c) => c != req.body.token);
    //generate new accessToken and refreshToken
    const accessToken = generateAccessToken({ user: req.body.email });
    const refreshToken = generateRefreshToken({ user: req.body.email });
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
}

//Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
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
}

//Logout User
const logoutUser = async (req, res) => {
    refreshTokens = refreshTokens.filter((c) => c != req.body.token);
    //remove the old refreshToken from the refreshTokens list
    res.status(204).send("Logged out!");
}

module.exports = { loginUser, logoutUser, refreshToken }
