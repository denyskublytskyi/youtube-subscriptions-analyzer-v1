class ApiError extends Error {
  name = "ApiError";
  constructor({ message, status, code, meta }) {
    super(message);

    this.status = status;
    this.code = code;
    this.meta = meta;
  }

  toJSON() {
    return {
      message: this.message,
      status: this.status,
      code: this.code,
      meta: this.meta,
    };
  }
}

module.exports = ApiError;
