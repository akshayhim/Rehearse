import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Menu,
  MenuItem,
  Divider,
  Container,
  Input,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import "./Navbar.css";

const ResponsiveAppBar = () => {
  const [anchorElMobile, setAnchorElMobile] = useState(null);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarVisible(window.scrollY < 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    return unsubscribe;
  }, []);

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleMobileMenuOpen = (event) => {
    setAnchorElMobile(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setAnchorElMobile(null);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    handleMobileMenuClose();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim() !== "") {
      const queryParams = new URLSearchParams();
      queryParams.set("query", searchQuery);
      queryParams.set("type", "book"); // You can modify this to search by a different type if needed

      navigate(`/searchresults?${queryParams.toString()}`);
    }
  };

  const pages = ["Shelf", "Contact"];

  return (
    <AppBar
    style={{ background: '#1b1835' }}
      position="fixed"
      sx={{ display: isNavbarVisible ? "flex" : "none" }}
    >
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit", fontFamily: "'Raleway', sans-serif", fontWeight: "400" }}>
              Rehearse
            </Link>
          </Typography>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Mobile Menu */}
          <Menu
            id="menu-mobile"
            anchorEl={anchorElMobile}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElMobile)}
            onClose={handleMobileMenuClose}
          >
            {pages.map((page) => (
              <MenuItem
                key={page}
                component={Link}
                to={`/${page.toLowerCase()}`}
                onClick={handleMobileMenuClose}
                sx={{fontFamily: "'Raleway', sans-serif", fontWeight: "200"}}
              >
                {page}
              </MenuItem>
            ))}
            <Divider />
            {isLoggedIn
              ? [
                  <MenuItem
                    key="account"
                    component={Link}
                    to="/account"
                    onClick={handleMobileMenuClose}
                    sx={{fontFamily: "'Raleway', sans-serif", fontWeight: "200"}}
                  >
                    Account
                  </MenuItem>,
                  <MenuItem key="signout" onClick={handleSignOut} sx={{fontFamily: "'Raleway', sans-serif", fontWeight: "200"}}>
                    Sign Out
                  </MenuItem>,
                ]
              : [
                  <MenuItem
                    key="login"
                    component={Link}
                    to="/login"
                    onClick={handleMobileMenuClose}
                    sx={{fontFamily: "'Raleway', sans-serif", fontWeight: "200"}}
                  >
                    Log In
                  </MenuItem>,
                  <MenuItem
                    key="signup"
                    component={Link}
                    to="/signup"
                    onClick={handleMobileMenuClose}
                    sx={{fontFamily: "'Raleway', sans-serif", fontWeight: "200"}}
                  >
                    Sign Up
                  </MenuItem>,
                ]}
          </Menu>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                color="inherit"
                component={Link}
                to={`/${page.toLowerCase()}`}
                sx={{fontFamily: "'Raleway', sans-serif", fontWeight: "200"}}
              >
                {page}
              </Button>
            ))}
            <Box sx={{ mx: 2 }} >
              <form onSubmit={handleSearch}>
                <Input
                  
                  type="text"
                  placeholder="Search"
                  fullWidth
                  sx={{ bgcolor: "#191a1c", borderRadius: 1, color: "white", fontFamily: "'Raleway', sans-serif", fontWeight: "200" }}
                  value={searchQuery}
                  onChange={handleChange}
                  
                />
              </form>
            </Box>
            {isLoggedIn ? (
              <>
                <MenuItem
                  component={Link}
                  to="/account"
                  onClick={handleMobileMenuClose}
                >
                  Account
                </MenuItem>
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              </>
            ) : (
              <>
                <Button sx={{fontFamily: "'Raleway', sans-serif", fontWeight: "200"}} color="inherit" component={Link} to="/login">
                  Log In
                </Button>
                <Button sx={{fontFamily: "'Raleway', sans-serif", fontWeight: "200"}} color="inherit" component={Link} to="/signup">
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
