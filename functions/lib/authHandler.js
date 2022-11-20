const ApiError = require("./ApiError");
const authHandler =
  ({ auth }) =>
  (handler) =>
  async (req, res) => {
    const jwt = req.header("Authorization")?.replace("Bearer ", "");
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(jwt);
      req.decodedToken = decodedToken;
    } catch (error) {
      console.error("Verify Firebase Id token error => ", error);
      throw new ApiError({ status: 401, message: "Unauthorized" });
    }

    return handler(req, res);
  };

module.exports = authHandler;
