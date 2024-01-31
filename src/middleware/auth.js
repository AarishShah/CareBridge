const jwt = require("jsonwebtoken");
const User = require('../models/patient'); // update this line accordingly

const auth = async (req, res, next) =>
{
  try
  {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "thisismynewcourse"); //validating header

    const user = await User.findOne(
      // finds associated user
      {
        _id: decoded._id,
        "tokens.token": token, // go in token's token array and match it with the token const that we got above, so user logs out and token will still be valid
      }
    );

    if (!user)
    {
      throw new Error();
    }

    req.token = token; // for logging out, we want user to logout from only one device and not all devices
    req.user = user;
    next();
  }
  catch (e) { res.status(401).send({ error: "Please authenticate." }); }
};

module.exports = auth;
