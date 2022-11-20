const functions = require("firebase-functions");
const fetch = require("node-fetch");

const parseJwt = (token) => {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
};

const basicScopes = ["https://www.googleapis.com/auth/youtube.readonly"];

module.exports = ({ db }) =>
  functions.https.onRequest(async (request, response) => {
    const { code, error } = request.query;
    const redirectUrl = new URL(
      process.env.NODE_ENV === "production"
        ? `https://${process.env.GCLOUD_PROJECT}.web.app`
        : "http://localhost:3000"
    );

    try {
      if (error) {
        throw new Error(error);
      }

      const tokenUrl = new URL("https://oauth2.googleapis.com/token");
      const redirectUri =
        process.env.NODE_ENV === "production"
          ? `https://${process.env.FUNCTION_REGION ?? "us-central1"}-${
              process.env.GCLOUD_PROJECT
            }.cloudfunctions.net/${process.env.FUNCTION_TARGET}`
          : `http://localhost:5001/${process.env.GCLOUD_PROJECT}/${
              process.env.FUNCTION_REGION ?? "us-central1"
            }/${process.env.FUNCTION_TARGET}`;

      console.log("Redirect URI =>", redirectUri);

      tokenUrl.searchParams.append("code", code);
      tokenUrl.searchParams.append("redirect_uri", redirectUri);
      tokenUrl.searchParams.append("client_id", process.env.GOOGLE_CLIENT_ID);
      tokenUrl.searchParams.append(
        "client_secret",
        process.env.GOOGLE_CLIENT_SECRET
      );
      tokenUrl.searchParams.append("grant_type", "authorization_code");
      const tokenResponse = await fetch(tokenUrl.toString(), {
        method: "POST",
      });

      const tokenData = await tokenResponse.json();
      console.info("Token exchange data =>", tokenData);

      if (!tokenResponse.ok) {
        throw new Error(tokenData.error);
      }

      const scopes = tokenData.scope.slice(" ");

      // Token scopes includes all required scopes
      if (!basicScopes.every((scope) => scopes.includes(scope))) {
        throw new Error("Missing required scopes");
      }

      const { sub } = parseJwt(tokenData.id_token);
      await db
        .collection("tokens")
        .doc(sub)
        .set({
          googleId: sub,
          ...tokenData,
        });

      redirectUrl.searchParams.append("access_token", tokenData.access_token);
      redirectUrl.searchParams.append("id_token", tokenData.id_token);
    } catch (error) {
      console.error("Token exchange error", error);
      redirectUrl.searchParams.append("error", error.message);
    } finally {
      response.redirect(redirectUrl.toString());
    }
  });
