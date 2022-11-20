import React from "react";
import { createContext, useCallback, useContext } from "react";
import noop from "lodash/noop";
import { useSnackbar } from "notistack";
import useFetch from "./hooks/useFetch";
import {
  getYoutubeSubscriptions as getYoutubeSubscriptionsApi,
  deleteYoutubeSubscriptionsByIds as deleteYoutubeSubscriptionsByIdsApi,
} from "./api";
import { useAuth } from "./hooks/useAuth";
import { useModals } from "./hooks/useModals";

const AppContext = createContext({
  isYoutubeSubscriptionsLoading: false,
  youtubeSubscriptions: [],
  fetchYoutubeSubscriptions: noop,
});

const AppContextProvider = ({ children }) => {
  const { user, signIn } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { openModal, modalTypes } = useModals();
  const {
    setData: setYoutubeSubscriptions,
    data: youtubeSubscriptions,
    isLoading: isYoutubeSubscriptionsLoading,
    fetchData: fetchYoutubeSubscriptions,
  } = useFetch(getYoutubeSubscriptionsApi);

  const deleteYoutubeSubscriptionsByIds = useCallback(
    async ({ subscriptionIds }) => {
      const idToken = await user.getIdToken();
      try {
        await deleteYoutubeSubscriptionsByIdsApi(
          { subscriptionIds },
          { idToken }
        );
        setYoutubeSubscriptions((youtubeSubscriptions) =>
          youtubeSubscriptions.filter(
            ({ subscriptionId }) => !subscriptionIds.includes(subscriptionId)
          )
        );
      } catch (e) {
        if (e.code === "MISSING_SCOPES") {
          openModal(modalTypes.MissingScopes, {
            scopes: e.meta.requiredScopes,
            onConfirm: () =>
              signIn({
                scopes: e.meta.requiredScopes,
                accountId: user.providerData[0].uid,
              }),
          });
          throw e;
        }
        enqueueSnackbar(e.message, { variant: "error" });
      }
    },
    [
      enqueueSnackbar,
      modalTypes.MissingScopes,
      openModal,
      setYoutubeSubscriptions,
      signIn,
      user,
    ]
  );

  const value = {
    isYoutubeSubscriptionsLoading,
    youtubeSubscriptions,
    fetchYoutubeSubscriptions,
    deleteYoutubeSubscriptionsByIds,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => useContext(AppContext);

export { AppContextProvider, useAppContext };
