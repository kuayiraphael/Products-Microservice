const { ValidateSignature } = require("../../utils");

auth = async (req, res, next) => {
  console.log("INSIDE THE AUTH MIDDLEWARE");
  console.log(req.user);
  const isAuthorized = await ValidateSignature(req);
  if (isAuthorized) {
    return next();
  }
  return res.status(403).json({ message: "Not Authorized" });
};
// auth = async (req, res, next) => {
//   try {
//     const user = await ValidateSignature(req); // Assume ValidateSignature returns user object or null

//     if (user) {
//       req.user = user; // Attach user to the request object
//       console.log("INSIDE THE AUTH MIDDLEWARE");
//       console.log(req.user); // Now req.user should be defined
//       return next();
//     } else {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//   } catch (error) {
//     console.error("Authentication error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

isSeller = async (req, res, next) => {
  const isAuthorized = await ValidateSignature(req);

  if (isAuthorized) {
    console.log("INSIDE IS SELLER MIDDLEWARE");
    console.log(req.user);
    if (req.user.role == "Seller") {
      return next();
    }
  }
  return res.status(403).json({ message: "Not Authorized" });
};
module.exports = { auth, isSeller };
