const jwt = require('jsonwebtoken');
const fs = require('fs');
async function generateToken(userid,role) {
    const privateKey = fs.readFileSync('private.key', 'utf8');

    const token = jwt.sign({userid:userid,role:role},privateKey, { expiresIn: '16h' ,algorithm: 'RS256'});
    return token;
}

module.exports = { generateToken };