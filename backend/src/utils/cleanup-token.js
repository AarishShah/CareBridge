const cron = require("node-cron");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");
X
const cleanupExpiredTokens = async () => {
  try {
    const models = [Doctor, Patient];

    for (const model of models) {
      const users = await model.find({ "tokens.token": { $exists: true } });
      for (const user of users) {
        const validTokens = [];
        for (let { token } of user.tokens) {
          const decodedToken = jwt.decode(token);
          if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
            validTokens.push({ token });
          }
        }
        user.tokens = validTokens;
        await user.save();
      }
    }

    console.log("Expired tokens cleanup complete");
  } catch (error) {
    console.error("Error during token cleanup:", error);
  }
};

// Schedule the task to run every 7 days at midnight
cron.schedule("0 0 */7 * *", cleanupExpiredTokens, {
  timezone: "Asia/Kolkata",
});

// // Schedule the task to run every 5 seconds for testing
// cron.schedule("*/5 * * * * *", cleanupExpiredTokens, {
//   timezone: "Asia/Kolkata",
// });