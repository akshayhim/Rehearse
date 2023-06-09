import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth, signInWithPopup, GoogleAuthProvider } from "../../firebase";
import { Link as Linking, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Navbar from "../homePage/Navbar"
import Google from "../../assets/icons8-google.svg"
import './login.css'

const theme = createTheme();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [googleSignInSuccess, setGoogleSignInSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSnackbarClose = () => {
    setError(null);
  };

  useEffect(() => {
    if (googleSignInSuccess) {
      navigate("/");
    }
  }, [googleSignInSuccess, navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const persistenceType = rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence;
      await setPersistence(auth, persistenceType);

      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); 
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // You can access the user information here and perform further actions
      console.log(user);
      setGoogleSignInSuccess(true);
    } catch (error) {
      console.log(error);
      // Handle error if sign-in with Google fails
    }
  };

  return (
    <ThemeProvider theme={theme}>
        <Navbar />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#1b1835" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" >
            Log in
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, color: "#f5f5f5",  backgroundColor:"#1b1835" }}
            >
              Log in
            </Button>
            <Grid container>
              <Grid item xs>
                <Linking to="/passwordreset" href="#" variant="body2">
                  Forgot password?
                </Linking>
              </Grid>
              <Grid item>
                <Linking to="/signup" href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Linking>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Snackbar open={error !== null} onClose={handleSnackbarClose}>
        <Alert severity="error" onClose={handleSnackbarClose}>
          {error}
        </Alert>
      </Snackbar>
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, width:"400px", position:"relative", left:"440px", top:"20px", backgroundColor:"#1b1835" }}
        onClick={handleGoogleSignIn}
      >
        <div className="googleDiv">
        <img src={Google} alt="" className="googleLogo"></img>
        <p>Log in with Google</p>
        </div>
      </Button>
    </ThemeProvider>
  );
}
