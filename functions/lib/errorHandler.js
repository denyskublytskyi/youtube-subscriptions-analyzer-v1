const errorHandler = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (e) {
    if (e.name === "ApiError") {
      res.status(e.status).json(e);
      return;
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = errorHandler;
