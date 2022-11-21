import { getLangNameFromCode } from "language-name-map";
import { useIntl } from "react-intl";

import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";

import LanguageIcon from "@mui/icons-material/Language";

import { useLocales } from "../hooks/useLocales";
import { useCallback } from "react";

const LocaleSelect = (props) => {
  const { locale, setLocale, locales } = useLocales();
  const intl = useIntl();

  const handleChange = useCallback(
    (e) => {
      setLocale(e.target.value);
    },
    [setLocale]
  );

  return (
    <TextField
      label={intl.formatMessage({
        id: "localeSelect.language",
        defaultMessage: "Language",
      })}
      size="small"
      {...props}
      select
      value={locale}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LanguageIcon fontSize="small" />
          </InputAdornment>
        ),
        ...props.InputProps,
      }}
    >
      {locales.map((language) => (
        <MenuItem key={language} value={language}>
          {language === "en" ? (
            getLangNameFromCode(language).name
          ) : (
            <>
              {getLangNameFromCode(language).name} /{" "}
              {getLangNameFromCode(language).native}
            </>
          )}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default LocaleSelect;
