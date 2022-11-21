import { useCallback, useEffect, useMemo } from "react";
import styled from "styled-components/macro";
import { FormattedMessage, useIntl } from "react-intl";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

import fpCountBy from "lodash/fp/countBy";
import compose from "lodash/fp/compose";
import fpOrderBy from "lodash/fp/orderBy";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { useAppContext } from "../../AppContext";
import Loader from "../../ui-kit/Loader";
import { useModals } from "../../hooks/useModals";
import { useLocales } from "../../hooks/useLocales";
import { useAuth } from "../../hooks/useAuth";
import Chart from "./Chart";
import SubscriptionsList from "./SubscriptionsList";
import FullSizeContainer from "../../ui-kit/FullSizeContainer";

const HomePage = ({ youtubeSubscriptions, onUnsubscribe, user }) => {
  const intl = useIntl();
  const { locale } = useLocales();

  const getCountryName = useCallback(
    (country) =>
      new Intl.DisplayNames([locale], {
        type: "region",
      }).of(country),
    [locale]
  );

  const subscriptionsCountByCountry = useMemo(
    () =>
      compose(
        fpOrderBy(["count", ({ countryName }) => countryName], ["desc"]),
        (entries) =>
          entries.map(([country, count]) => ({
            country,
            count,
            countryNameWithFlag: country
              ? `${getCountryName(country)} ${getUnicodeFlagIcon(country)}`
              : intl.formatMessage({
                  defaultMessage: "Country not specified",
                  id: "home.countryNotSpecified",
                }),
          })),
        (value) => Object.entries(value),
        fpCountBy("country")
      )(youtubeSubscriptions),
    [getCountryName, intl, youtubeSubscriptions]
  );

  if (youtubeSubscriptions.length === 0) {
    return (
      <FullSizeContainer>
        <Typography variant="body1">
          <FormattedMessage
            defaultMessage="No subscriptions in your YouTube account"
            id="home.noSubscriptions"
          />
        </Typography>
      </FullSizeContainer>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <SubscriptionsList
          youtubeSubscriptions={youtubeSubscriptions}
          subscriptionsCountByCountry={subscriptionsCountByCountry}
          user={user}
          onUnsubscribe={onUnsubscribe}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Chart subscriptionsCountByCountry={subscriptionsCountByCountry} />
      </Grid>
    </Grid>
  );
};

const HomePageContainer = () => {
  const { user } = useAuth();
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
          message: (
            <FormattedMessage
              defaultMessage={`You want to delete {count, plural, one {subscription} other {subscriptions}} for {count, plural, one {channel} other {channels}} "{title}"?`}
              id="home.unsubscribeConfirmation"
              values={{
                count: subscriptionIds.length,
                title,
              }}
            />
          ),
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
      user={user}
    />
  );
};

export default HomePageContainer;
