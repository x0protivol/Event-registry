import "./Header.css";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Button>
              <Link to="/" className="link">
                Home
              </Link>
            </Button>
            <Button>
              <Link to="/mint" className="link">
                Mint
              </Link>
            </Button>
            <Button>
              <Link to="/events" className="link">
                Events
              </Link>
            </Button>
          </Typography>

          <ConnectButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
