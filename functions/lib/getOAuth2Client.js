const ApiError = require("./ApiError");
const errorCodes = require("./errorCodes");
const { google } = require("googleapis");
const getOAuth2Client = async ({ requiredScopes, db, decodedToken }) => {
  const provider = decodedToken.firebase.sign_in_provider;
  const providerId = decodedToken.firebase.identities[provider]?.[0];
  const tokenRef = await db.collection("tokens").doc(providerId).get();
  const token = tokenRef.data();

  if (!token) {
    throw new ApiError({ status: 401, message: "Unauthorized" });
  }

  const scopes = token.scope.split(" ");

  if (!requiredScopes.every((scope) => scopes.includes(scope))) {
    throw new ApiError({
      status: 401,
      message: "Missing required scopes",
      code: errorCodes.MissingScopes,
      meta: {
        requiredScopes,
      },
    });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.on("tokens", async (tokens) => {
    console.log("Token refreshed for user =>", providerId);
    await db.collection("tokens").doc(providerId).update(tokens);
  });

  oauth2Client.setCredentials({
    access_token: token.access_token,
    refresh_token: token.refresh_token,
  });

  return oauth2Client;
};

module.exports = getOAuth2Client;
