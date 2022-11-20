import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";

import LogoutIcon from "@mui/icons-material/Logout";

import { useAuth } from "../../hooks/useAuth";
import Box from "@mui/material/Box";

const Header = () => {
  const { user, signOut } = useAuth();

  const [firstName, lastName] = user.displayName.split(" ");

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar variant="dense">
        <Stack spacing={2} direction="row" flex={1} alignItems="center">
          <Box flex={1} />
          <Avatar src={user.photoURL}>
            {firstName.toUpperCase()[0]}
            {lastName.toUpperCase()[0]}
          </Avatar>
          <Typography variant="body1">{user.displayName}</Typography>
          <Tooltip title="Sign out">
            <IconButton onClick={signOut}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
