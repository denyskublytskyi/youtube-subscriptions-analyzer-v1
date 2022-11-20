const functions = require("firebase-functions");
const { google } = require("googleapis");
const Ajv = require("ajv");
const compose = require("lodash/fp/compose");

const errorHandler = require("./lib/errorHandler");
const cors = require("./lib/cors");
const ApiError = require("./lib/ApiError");
const authHandler = require("./lib/authHandler");
const getOAuth2Client = require("./lib/getOAuth2Client");

const ajv = new Ajv({
  removeAdditional: "all",
  useDefaults: true,
});

const schema = {
  type: "object",
  properties: {
    subscriptionIds: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 1,
    },
  },
  required: ["subscriptionIds"],
};

const validate = ajv.compile(schema);

const requiredScopes = ["https://www.googleapis.com/auth/youtube"];

const handler =
  ({ db, auth }) =>
  async (req, res) => {
    const { body } = req;
    const isBodyValid = validate(body);

    if (!isBodyValid) {
      res.status(400).json({ errors: validate.errors });
      return;
    }

    const oauth2Client = await getOAuth2Client({
      db,
      auth,
      decodedToken: req.decodedToken,
      requiredScopes,
    });

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    try {
      await Promise.all(
        body.subscriptionIds.map((id) =>
          youtube.subscriptions.delete({
            id,
          })
        )
      );
    } catch (e) {
      throw new ApiError({
        status: 400,
        message: "Youtube API error",
      });
    }

    res.sendStatus(204);
  };

module.exports = ({ db, auth }) =>
  compose(
    functions.https.onRequest,
    cors,
    errorHandler,
    authHandler({ auth }),
    handler
  )({ db, auth });
