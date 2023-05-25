import { useState } from "react";
import { Link as Linking, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth, signInWithGoogle } from "../../firebase"; // Import signInWithGoogle from firebase.js
import { collection, addDoc } from "firebase/firestore";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navbar from "../homePage/Navbar"
import Google from "../../assets/icons8-google.svg"

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const usersCollectionRef = collection(db, "users");

  const navigate = useNavigate();

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/account");
    } catch (error) {
      console.log(error.message);
    }
  };

  const createProfile = async () => {
    await addDoc(usersCollectionRef, {
      first_name: firstName,
      last_name: lastName,
      email: email,
    });
  };

  const handleRegisterAndCreateProfile = async () => {
    await register();
    createProfile();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <ThemeProvider theme={createTheme()}>
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
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2,  backgroundColor:"#1b1835" }}
              onClick={handleRegisterAndCreateProfile}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Linking to="/login" href="#" variant="body2">
                  Already have an account? Sign in
                </Linking>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Container component="main" maxWidth="xs">
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, backgroundColor:"#1b1835" }}
          onClick={signInWithGoogle}
        >
          <img src={Google} alt="" className="googleLogo"></img>
        <p>Sign up with Google</p>
        </Button>
      </Container>
    </ThemeProvider>
  );
}

export default SignUp;
  