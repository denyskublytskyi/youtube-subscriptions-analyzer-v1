import { useCallback, useEffect, useState } from "react";

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      console.error(e);
      return initialValue;
    }
  });

  useEffect(() => {
    const handler = (event) => {
      if (event.key !== key) {
        return;
      }

      try {
        setStoredValue(JSON.parse(event.newValue));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener("storage", handler);
    };
  }, [key]);

  const setValue = useCallback(
    (value) => {
      try {
        const newValue =
          typeof value === "function" ? value(storedValue) : value;
        setStoredValue(newValue);
        window.localStorage.setItem(key, JSON.stringify(newValue));
      } catch (e) {
        console.error(e);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

export default useLocalStorage;
