const jwt = require('jsonwebtoken');

//Validate Token
function validateToken(req, res, next) {
    //get token from request header
    const authHeader = req.headers["authorization"]
    if (!authHeader) {
        res.status(400).json("Authorization header not present")
        next()
    } else {
        const token = authHeader.split(" ")[1]
        //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
        if (token == null) res.status(400).send("Token not present")
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                res.status(403).send(err)
            }
            else {
                req.user = user
                next() //proceed to the next action in the calling function
            }
        })
    }
}

module.exports = validateToken