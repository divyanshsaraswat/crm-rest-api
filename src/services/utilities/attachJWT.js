const jwt = require("jsonwebtoken");
const fs = require("fs");
module.exports.userAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({ message: "Authorization token missing or invalid." });
        }
    
        const token = authHeader.split(" ")[1];
        const publicKey = fs.readFileSync('public.key', 'utf8');
        const decodedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        
        req.id = decodedToken.userid;
        req.role = decodedToken.role;

        // if(req.type !== "superadmin"){
        //     return res.status(403).json({message:"Unauthorized access."});
        // }

        next(); 
      } catch (error) {
        console.error("Authentication Error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token." });
      }
}