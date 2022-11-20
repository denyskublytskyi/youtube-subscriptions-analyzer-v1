import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import countries from "countries-code";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import fpCountBy from "lodash/fp/countBy";
import fpGroupBy from "lodash/fp/groupBy";
import compose from "lodash/fp/compose";
import fpOrderBy from "lodash/fp/orderBy";
import keyBy from "lodash/keyBy";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import red from "@mui/material/colors/red";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";

import { useAppContext } from "../../AppContext";
import Loader from "../../ui-kit/Loader";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import MuiTooltip from "@mui/material/Tooltip";
import { useModals } from "../../hooks/useModals";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material";

const Chart = ({ subscriptionsCountByCountry }) => {
  const theme = useTheme();
  const chartContainerRef = useRef();

  return (
    <Box
      flex={1}
      ref={chartContainerRef}
      sx={
        chartContainerRef?.current
          ? { height: chartContainerRef.current?.clientWidth }
          : {}
      }
    >
      {chartContainerRef.current && (
        <ResponsiveContainer>
          <BarChart
            data={subscriptionsCountByCountry}
            style={{
              fontFamily: theme.typography.fontFamily,
            }}
          >
            <Tooltip />
            <XAxis dataKey="countryNameWithFlag" />
            <Bar fill={theme.palette.primary.main} dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

const HomePage = ({ youtubeSubscriptions, onUnsubscribe }) => {
  const [expanded, setExpanded] = useState();
  const [selectedSubscriptionIds, setSelectedSubscriptionIds] = useState({});

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
    []
  );

  const youtubeSubscriptionsByCountry = useMemo(
    () => fpGroupBy("country")(youtubeSubscriptions),
    [youtubeSubscriptions]
  );

  const subscriptionsCountByCountry = useMemo(
    () =>
      compose(
        fpOrderBy(["count", ({ countryName }) => countryName], ["desc"]),
        (entries) =>
          entries.map(([country, count]) => ({
            country,
            count,
            countryName: country ? countries.getCountry(country) : "-",
            countryNameWithFlag: country
              ? `${countries.getCountry(country)} ${getUnicodeFlagIcon(
                  country
                )}`
              : "-",
          })),
        (value) => Object.entries(value),
        fpCountBy("country")
      )(youtubeSubscriptions),
    [youtubeSubscriptions]
  );

  const subscriptionsById = useMemo(
    () => keyBy(youtubeSubscriptions, "subscriptionId"),
    [youtubeSubscriptions]
  );

  useEffect(() => {
    setSelectedSubscriptionIds({});
  }, [youtubeSubscriptions]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Stack direction="column" spacing={2} flex={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} md="auto" sx={{ flex: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <SubscriptionsIcon />
                <Typography variant="h6">
                  Your Youtube subscriptions by channel country
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
                        (subscriptionId) =>
                          subscriptionsById[subscriptionId].title
                      )
                      .join(", "),
                    subscriptionIds: Object.keys(selectedSubscriptionIds),
                  })}
                >
                  Unsubscribe from {Object.keys(selectedSubscriptionIds).length}{" "}
                  selected channel
                  {Object.keys(selectedSubscriptionIds).length > 1 ? "s" : ""}
                </Button>
              )}
            </Grid>
          </Grid>

          <Stack direction="column">
            {subscriptionsCountByCountry.map(
              ({ country, countryName, count }) => (
                <Accordion
                  TransitionProps={{ unmountOnExit: true }}
                  key={country}
                  expanded={expanded === country}
                  onChange={handleExpandedChange(country)}
                  sx={country === "RU" ? { backgroundColor: red[100] } : {}}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      {countryName} {country && getUnicodeFlagIcon(country)} (
                      {count})
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
                                  checked={
                                    selectedSubscriptionIds[subscriptionId]
                                  }
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
                                  <MuiTooltip
                                    title={new Date(
                                      subscribedAt
                                    ).toLocaleString()}
                                  >
                                    <span>
                                      Subscribed{" "}
                                      {formatDistanceToNow(
                                        new Date(subscribedAt),
                                        {
                                          addSuffix: true,
                                        }
                                      )}
                                    </span>
                                  </MuiTooltip>
                                }
                              />
                              <Button
                                color="error"
                                onClick={onUnsubscribe({
                                  title,
                                  subscriptionIds: [subscriptionId],
                                })}
                              >
                                Unsubscribe
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
      </Grid>
      <Grid item xs={12} md={6}>
        <Chart subscriptionsCountByCountry={subscriptionsCountByCountry} />
      </Grid>
    </Grid>
  );
};

const HomePageContainer = () => {
  const {
    isYoutubeSubscriptionsLoading,
    youtubeSubscriptions,
    fetchYoutubeSubscriptions,
    deleteYoutubeSubscriptionsByIds,
  } = useAppContext();

  const { openModal, closeModal, modalTypes } = useModals();

  useEffect(() => {
    fetchYoutubeSubscriptions();
  }, []);

  const handleUnsubscribe = useCallback(
    ({ title, subscriptionIds }) =>
      async (e) => {
        e.preventDefault();
        openModal(modalTypes.Confirmation, {
          onConfirm: async () => {
            await deleteYoutubeSubscriptionsByIds({
              subscriptionIds,
            });
            closeModal();
          },
          message: `You want to delete subscription${
            subscriptionIds.length ? "s" : ""
          } for channel${subscriptionIds.length > 1 ? "s" : ""} "${title}"?`,
        });
      },
    [
      closeModal,
      deleteYoutubeSubscriptionsByIds,
      modalTypes.Confirmation,
      openModal,
    ]
  );

  if (isYoutubeSubscriptionsLoading) {
    return <Loader isInline />;
  }
  return (
    <HomePage
      youtubeSubscriptions={youtubeSubscriptions}
      onUnsubscribe={handleUnsubscribe}
    />
  );
};

export default HomePageContainer;
