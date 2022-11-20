import { useCallback, useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const AsyncButton = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(
    async (e) => {
      if (typeof props.onClick !== "function") {
        return;
      }

      try {
        setIsLoading(true);
        await props.onClick(e);
      } finally {
        setIsLoading(false);
      }
    },
    [props]
  );

  return (
    <Button
      {...props}
      endIcon={isLoading ? <CircularProgress size={15} /> : props.endIcon}
      onClick={handleClick}
      disabled={isLoading || props.disabled}
    />
  );
};

export default AsyncButton;
