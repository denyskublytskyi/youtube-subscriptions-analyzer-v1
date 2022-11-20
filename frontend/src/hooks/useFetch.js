import { useState } from "react";
import { useAuth } from "./useAuth";

const useFetch = (handler) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchData = async (...args) => {
    try {
      const idToken = await user.getIdToken();
      setIsLoading(true);
      const data = await handler(...args, { idToken });
      setData(data);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, setData, isLoading, fetchData };
};

export default useFetch;
