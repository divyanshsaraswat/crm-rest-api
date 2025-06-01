const jwt = require("jsonwebtoken");
const fs = require("fs");
module.exports.adminAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
       if (!token) {
          return res.status(401).json({ message: "Authorization token missing or invalid." });
        }
    
        const publicKey = fs.readFileSync('public.key', 'utf8');
        const decodedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        
        req.pid = decodedToken.userid;
        req.role = decodedToken.role;
        if(req.role !== "admin"){
            return res.status(403).json({message:"Unauthorized access."});
        }

        next(); 
      } catch (error) {
        console.error("Authentication Error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token." });
      }
}
module.exports.managerAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
       if (!token) {
          return res.status(401).json({ message: "Authorization token missing or invalid." });
        }
        const publicKey = fs.readFileSync('public.key', 'utf8');
        const decodedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        
        req.pid = decodedToken.userid;
        req.role = decodedToken.role;
        if(req.role !== "manager"){
            return res.status(403).json({message:"Unauthorized access."});
        }

        next(); 
      } catch (error) {
        console.error("Authentication Error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token." });
      }
}
module.exports.fuseAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
       if (!token) {
          return res.status(401).json({ message: "Authorization token missing or invalid." });
        }
        const publicKey = fs.readFileSync('public.key', 'utf8');
        const decodedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        
        req.pid = decodedToken.userid;
        req.role = decodedToken.role;
        req.tenantid= decodedToken.tenantid;

        if(req.role !== "admin" && req.role !== "manager"){
            return res.status(403).json({message:"Unauthorized access."});
        }

        next(); 
      } catch (error) {
        console.error("Authentication Error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token." });
      }
}
module.exports.userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
       if (!token) {
          return res.status(401).json({ message: "Authorization token missing or invalid." });
        }
        const publicKey = fs.readFileSync('public.key', 'utf8');
        const decodedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        
        req.pid = decodedToken.userid;
        req.role = decodedToken.role;
        req.tenantid= decodedToken.tenantid;

        if(!(req.role)){
            return res.status(403).json({message:"Unauthorized access."});
        }

        next(); 
      } catch (error) {
        console.error("Authentication Error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token." });
      }
}