import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const baseStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const Loader = ({ isInline = false }) => {
  const styles = isInline
    ? {
        ...baseStyles,
        width: "100%",
        height: "100%",
      }
    : {
        ...baseStyles,
        width: "100vw",
        height: "100vh",
      };
  return (
    <Box sx={styles}>
      <CircularProgress />
    </Box>
  );
};

export default Loader;
