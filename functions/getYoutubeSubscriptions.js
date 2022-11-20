const functions = require("firebase-functions");
const { google } = require("googleapis");
const chunk = require("lodash/chunk");
const keyBy = require("lodash/keyBy");
const orderBy = require("lodash/orderBy");
const compose = require("lodash/fp/compose");

const errorHandler = require("./lib/errorHandler");
const cors = require("./lib/cors");
const authHandler = require("./lib/authHandler");
const getOAuth2Client = require("./lib/getOAuth2Client");

const requiredScopes = ["https://www.googleapis.com/auth/youtube.readonly"];

const handler =
  ({ db, auth }) =>
  async (req, res) => {
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

    let nextPageToken;

    const subscriptions = [];
    do {
      // eslint-disable-next-line no-await-in-loop
      const { data } = await youtube.subscriptions.list({
        part: "snippet",
        mine: true,
        maxResults: 50,
        ...(nextPageToken && {
          pageToken: nextPageToken,
        }),
      });

      subscriptions.push(...data.items);
      nextPageToken = data.nextPageToken;
    } while (nextPageToken);

    const channels = (
      await Promise.all(
        chunk(subscriptions, 50).map(async (subscriptionsChunk) => {
          const { data } = await youtube.channels.list({
            part: "snippet",
            id: subscriptionsChunk
              .map(({ snippet }) => snippet.resourceId.channelId)
              .join(","),
            ...(nextPageToken && {
              pageToken: nextPageToken,
            }),
          });

          return data.items;
        })
      )
    ).flat(1);

    const subscriptionsByChannelId = keyBy(
      subscriptions,
      ({ snippet }) => snippet.resourceId.channelId
    );

    const channelsWithSubscriptionId = channels.map(
      ({
        id,
        snippet: {
          title,
          description,
          customUrl,
          country,
          thumbnails,
          publishedAt,
        },
      }) => ({
        id,
        title,
        description,
        customUrl,
        country: country ?? "",
        thumbnails,
        createdAt: publishedAt,
        subscriptionId: subscriptionsByChannelId[id].id,
        subscribedAt: subscriptionsByChannelId[id].snippet.publishedAt,
      })
    );
    res.json(orderBy(channelsWithSubscriptionId, ["subscribedAt"], ["desc"]));
  };

module.exports = ({ db, auth }) =>
  compose(
    functions.https.onRequest,
    cors,
    errorHandler,
    authHandler({ auth }),
    handler
  )({ db, auth });
