require("firebase-functions/logger/compat");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

const app = initializeApp();
const db = getFirestore(app);
const auth = getAuth(app);

exports.authhandler = require("./handleAuth")({ db });
exports.getYoutubeSubscriptions = require("./getYoutubeSubscriptions")({
  db,
  auth,
});
exports.deleteYoutubeSubscriptions = require("./deleteYoutubeSubscriptions")({
  db,
  auth,
});
