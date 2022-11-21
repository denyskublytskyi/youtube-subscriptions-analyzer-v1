import { createContext, useCallback, useContext, useState } from "react";
import noop from "lodash/noop";
import { IntlProvider } from "react-intl";

import ukLocale from "date-fns/locale/uk";
import enLocale from "date-fns/locale/en-GB";

import en from "../translations/en.json";
import uk from "../translations/uk.json";

const messages = {
  en,
  uk,
};

const locales = Object.keys(messages);

const dateFnsLocale = {
  en: enLocale,
  uk: ukLocale,
};

const I18nContext = createContext({
  locale: "en",
  locales: [],
  messages,
  setLocale: noop,
});

const I18nProvider = ({ children }) => {
  const browserLanguage = (
    navigator.languages?.[0] ?? navigator.language
  ).split("-")[0];

  const [locale, setLocale] = useState(
    messages[browserLanguage] ? browserLanguage : "en"
  );

  const handleLocaleChange = useCallback((locale) => {
    if (!messages[locale]) {
      return;
    }

    const newPath = `/${locale}${window.location.pathname.replace(
      new RegExp(`/(${locales.join("|")})(/?)`, "gi"),
      "/"
    )}`;

    window.history.replaceState({}, document.title, newPath);
    setLocale(locale);
  }, []);

  const value = {
    locale,
    locales,
    setLocale: handleLocaleChange,
    dateFnsLocale: dateFnsLocale[locale],
  };

  return (
    <I18nContext.Provider value={value}>
      <IntlProvider
        locale={locale}
        defaultLocale="en"
        messages={messages[locale] || messages.en}
      >
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  );
};

const useLocales = () => useContext(I18nContext);

export { I18nProvider, useLocales };
