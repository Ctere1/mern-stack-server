const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { makeCode } = require('../helpers/referralCode')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
    const { token, email } = req.body;
    if (!token || !email) {
        res.status(400).json("Invalid parameters. Please enter token and email")
    } else {
        if (!refreshTokens.includes(token)) {
            res.status(400).json("Refresh Token Invalid")
        } else {
            //remove the old refreshToken from the refreshTokens list
            refreshTokens = refreshTokens.filter((c) => c != token);
            //generate new accessToken and refreshToken
            const accessToken = generateAccessToken({ user: email });
            const refreshToken = generateRefreshToken({ user: email });
            res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
        }
    }
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

//Login User with Google Account
const googleLogin = (req, res) => {
    const idToken = req.body.google.credential;

    client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID }).then(async (response) => {
        const { email_verified, email } = response.payload;
        if (email_verified) {
            const user = await User.findOne({ email })
            if (user) {
                const accessToken = generateAccessToken({ user: email });
                const refreshToken = generateRefreshToken({ user: email });
                user.status = 'online';
                await user.save();
                res.status(200).json({ user: user, accessToken: accessToken, refreshToken: refreshToken });
            }
        } else {
            return res.status(400).json({ error: "Google login failed. Try again" });
        }
    });
}

//Signup User with Google Account
const googleSignup = async (req, res) => {
    const idToken = req.body.google.credential;

    client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID }).then(async (response) => {
        const { email_verified, name, email, picture } = response.payload;
        if (email_verified) {
            try {
                const password = email + process.env.ACCESS_TOKEN_SECRET + makeCode(9); //Generate Strong Password
                const referralCode = makeCode(5);
                const referralFromCode = req.body.referralFromCode;
                const user = await User.signup(name, email, password, picture, referralCode, referralFromCode);
                res.status(201).json(user);
            } catch (error) {
                res.status(400).json(error.message);
            }
        } else {
            return res.status(400).json({ error: "Google login failed. Try again" });
        }
    });

}

module.exports = { loginUser, logoutUser, refreshToken, googleLogin, googleSignup }
