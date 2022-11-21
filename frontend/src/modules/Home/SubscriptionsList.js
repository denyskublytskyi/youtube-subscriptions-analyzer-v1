import { useCallback, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import keyBy from "lodash/keyBy";
import compose from "lodash/fp/compose";
import fpGroupBy from "lodash/fp/groupBy";

import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import List from "@mui/material/List";
import Link from "@mui/material/Link";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import MuiTooltip from "@mui/material/Tooltip";
import AccordionDetails from "@mui/material/AccordionDetails";
import red from "@mui/material/colors/red";

import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useLocales } from "../../hooks/useLocales";
import useLocalStorage from "../../hooks/useLocalStorage";

const formatNumber = (number) => {
  const suffixes = {
    1e3: "K",
    1e6: "M",
  };
  const step = Object.keys(suffixes).find(
    (step, i, steps) =>
      number / step > 1 &&
      number / step < (steps[i + 1] ? steps[i + 1] / step : 1000)
  );

  return step
    ? `${(number / step).toFixed(number / step < 100 ? 1 : 0)}${suffixes[step]}`
    : number;
};

const SubscriptionsList = ({
  youtubeSubscriptions,
  subscriptionsCountByCountry,
  user,
  onUnsubscribe,
}) => {
  const [expanded, setExpanded] = useState();
  const [selectedSubscriptionIdsCache, setSelectedSubscriptionIds] =
    useLocalStorage(`user.${user.uid}.selectedSubscriptionIds`, {});

  const youtubeSubscriptionsById = useMemo(
    () => keyBy(youtubeSubscriptions, "subscriptionId"),
    [youtubeSubscriptions]
  );

  const selectedSubscriptionIds = useMemo(
    () =>
      compose(
        Object.fromEntries,
        (selectedSubscriptionsEntries) =>
          selectedSubscriptionsEntries.filter(
            ([id]) => youtubeSubscriptionsById[id]
          ),
        Object.entries
      )(selectedSubscriptionIdsCache),
    [selectedSubscriptionIdsCache, youtubeSubscriptionsById]
  );

  const { dateFnsLocale, locale } = useLocales();
  const intl = useIntl();

  const handleExpandedChange = useCallback(
    (value) => (event, isExpanded) => {
      setExpanded(isExpanded ? value : null);
    },
    []
  );

  const handleSelectSubscription = useCallback(
    (subscriptionId) => (e) => {
      setSelectedSubscriptionIds((selectedSubscriptionIds) => {
        const { checked } = e.target;

        if (checked) {
          return {
            ...selectedSubscriptionIds,
            [subscriptionId]: true,
          };
        }

        const newSelectedSubscriptionIds = { ...selectedSubscriptionIds };
        delete newSelectedSubscriptionIds[subscriptionId];

        return newSelectedSubscriptionIds;
      });
    },
    [setSelectedSubscriptionIds]
  );

  const youtubeSubscriptionsByCountry = useMemo(
    () => fpGroupBy("country")(youtubeSubscriptions),
    [youtubeSubscriptions]
  );

  const subscriptionsById = useMemo(
    () => keyBy(youtubeSubscriptions, "subscriptionId"),
    [youtubeSubscriptions]
  );

  return (
    <Stack direction="column" spacing={2} flex={1}>
      <Grid container spacing={2}>
        <Grid item xs={12} md="auto" sx={{ flex: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <SubscriptionsIcon />
            <Typography variant="h6">
              <FormattedMessage
                defaultMessage="Your Youtube subscriptions by channel country ({count})"
                id="home.subscriptionsByCountry"
                values={{
                  count: youtubeSubscriptions.length,
                }}
              />
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md="auto">
          {Object.keys(selectedSubscriptionIds).length !== 0 && (
            <Button
              color="error"
              variant="contained"
              onClick={onUnsubscribe({
                title: Object.keys(selectedSubscriptionIds)
                  .map(
                    (subscriptionId) => subscriptionsById[subscriptionId].title
                  )
                  .join(", "),
                subscriptionIds: Object.keys(selectedSubscriptionIds),
              })}
            >
              <FormattedMessage
                defaultMessage="Unsubscribe from {count} selected {count, plural, one {channel} other {channels}}"
                id="home.unsubscribeSelected"
                values={{
                  count: Object.keys(selectedSubscriptionIds).length,
                }}
              />
            </Button>
          )}
        </Grid>
      </Grid>

      <Stack direction="column">
        {subscriptionsCountByCountry.map(
          ({ country, countryNameWithFlag, count }) => (
            <Accordion
              TransitionProps={{ unmountOnExit: true }}
              key={country}
              expanded={
                expanded === country ||
                youtubeSubscriptionsByCountry[country].some(
                  ({ subscriptionId }) =>
                    selectedSubscriptionIds[subscriptionId]
                )
              }
              onChange={handleExpandedChange(country)}
              sx={country === "RU" ? { backgroundColor: red[100] } : {}}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  {countryNameWithFlag} ({count})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {youtubeSubscriptionsByCountry[country].map(
                    ({
                      id,
                      title,
                      subscriptionId,
                      customUrl,
                      thumbnails,
                      statistics,
                      createdAt,
                      subscribedAt,
                    }) => (
                      <Link
                        key={id}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none", color: "inherit" }}
                        href={`https://www.youtube.com/${customUrl}`}
                      >
                        <ListItemButton>
                          <ListItemIcon>
                            <Checkbox
                              checked={Boolean(
                                selectedSubscriptionIds[subscriptionId]
                              )}
                              onChange={handleSelectSubscription(
                                subscriptionId
                              )}
                            />
                          </ListItemIcon>
                          <ListItemAvatar>
                            <Avatar src={thumbnails.default.url}></Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={title}
                            secondary={
                              <>
                                <Typography variant="body2">
                                  {customUrl}
                                </Typography>
                                <Typography variant="body2">
                                  <FormattedMessage
                                    defaultMessage="{count} subscribers"
                                    id="home.subscribersCount"
                                    values={{
                                      count: formatNumber(
                                        statistics.subscriberCount
                                      ),
                                    }}
                                  />
                                </Typography>
                                <MuiTooltip
                                  title={new Date(createdAt).toLocaleString()}
                                >
                                  <Typography variant="body2">
                                    <FormattedMessage
                                      defaultMessage="Created {createdAt}"
                                      id="home.subscriptionCreatedAt"
                                      values={{
                                        createdAt: formatDistanceToNow(
                                          new Date(createdAt),
                                          {
                                            addSuffix: true,
                                            locale: dateFnsLocale,
                                          }
                                        ),
                                      }}
                                    />
                                  </Typography>
                                </MuiTooltip>
                                <MuiTooltip
                                  title={new Date(
                                    subscribedAt
                                  ).toLocaleString()}
                                >
                                  <Typography variant="body2">
                                    <FormattedMessage
                                      defaultMessage="Subscribed {subscribedAt}"
                                      id="home.subscriptionSubscribedAt"
                                      values={{
                                        subscribedAt: formatDistanceToNow(
                                          new Date(subscribedAt),
                                          {
                                            addSuffix: true,
                                            locale: dateFnsLocale,
                                          }
                                        ),
                                      }}
                                    />
                                  </Typography>
                                </MuiTooltip>
                              </>
                            }
                          />
                          <Button
                            color="error"
                            onClick={onUnsubscribe({
                              title,
                              subscriptionIds: [subscriptionId],
                            })}
                          >
                            <FormattedMessage
                              defaultMessage="Unsubscribe"
                              id="home.unsubscribe"
                            />
                          </Button>
                        </ListItemButton>
                      </Link>
                    )
                  )}
                </List>
              </AccordionDetails>
            </Accordion>
          )
        )}
      </Stack>
    </Stack>
  );
};

export default SubscriptionsList;
