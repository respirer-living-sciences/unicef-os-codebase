import React, { useContext, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
// import { useLocation } from "react-router-dom";
import "./login.css";
import "./index.css";
import LoginComplete from "./AuthService";
import { Collapse, IconButton, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AndroidIcon from "@mui/icons-material/Android";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      Respirer Living Sciences{" "}
      {/* <Link color="inherit" href="http://localhost:your_frontend_port/">
        Respirer Living Sciences
      </Link>{" "} */}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: "Open Sans",
    },
  },
});

export default function SignIn() {
  // const { dispatch, isFetching } = useContext(Context);
  const [error, setError] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [open, setOpen] = useState(false);

  const platform = new URLSearchParams(window.location.search).get("platform");
  // const platform = "mobile_app";
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsFetching(true);
    try {
      let data = new FormData(event.currentTarget);
      let username = data.get("username");
      let password = data.get("password");

      const finalUserResponse = await LoginComplete(username, password);
      if (finalUserResponse.token) {
        setIsFetching(false);
        setError(false);
        setOpen(true);

        localStorage.setItem("user", finalUserResponse.token);
        localStorage.setItem("password", password);
        localStorage.setItem("status_code", finalUserResponse.status_code);
        localStorage.setItem("logo", finalUserResponse.logo);
        localStorage.setItem("email", finalUserResponse.email);
        localStorage.setItem("check_aqi", finalUserResponse.check_aqi);
        localStorage.setItem(
          "check_calibration",
          finalUserResponse.check_calibration,
        );
        localStorage.setItem("username", finalUserResponse.username);
        localStorage.setItem("api_key", finalUserResponse.key);
      } else {
        setError(true);
        setIsFetching(false);
        setErrorMsg(finalUserResponse.message);
      }
      finalUserResponse.token && window.location.reload();
      // setAuth(credentials)
    } catch (err) {
      setError(true);
      setIsFetching(false);
    }

    // localStorage.setItem("user-info", JSON.stringify(res));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        className="login-container"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, mt: 8, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography sx={{ mb: 1 }} component="h1" variant="h5">
              Sign in
            </Typography>
            {error && (
              <Alert variant="outlined" severity="error">
                <AlertTitle>Error</AlertTitle>
                An Error occured while Logging in — <strong>{errorMsg}</strong>
              </Alert>
            )}
            {!error && !isFetching && (
              <Box
                sx={{
                  zIndex: "999",
                  width: { xs: "70%", sm: "25%" },
                  position: "absolute",
                  bottom: "3%",
                  left: { xs: "18%", sm: "38%" },
                }}
              >
                <Slide direction="up" in={open} mountOnEnter unmountOnExit>
                  <Alert
                    variant="outlined"
                    severity="success"
                    // action={
                    //   <IconButton
                    //     aria-label="close"
                    //     color="inherit"
                    //     size="small"
                    //     onClick={() => {
                    //       setOpen(false);
                    //     }}
                    //   >
                    //     <CloseIcon fontSize="inherit" />
                    //   </IconButton>
                    // }
                    sx={{ mb: 2 }}
                  >
                    <b>Login Successful!</b>
                  </Alert>
                </Slide>
              </Box>
            )}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="username"
                name="username"
                autoComplete="username"
                autoFocus
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
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isFetching}
              >
                Sign In
              </Button>
            </Box>
            {platform !== "mobile_app" && (
              <Button
                fullWidth
                variant="contained"
                component="a"
                href=""
                download
                sx={{ mt: 1, mb: 2 }}
                startIcon={<AndroidIcon />}
              >
                Download Android App
              </Button>
            )}
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 1, mb: 2, fontSize: "0.775rem" }}
            >
              By continuing, you agree to our{" "}
              <Link
                href="/mave-datahub/privacy-policy"
                sx={{ fontSize: "0.775rem", verticalAlign: "baseline" }}
              >
                Privacy Policy
              </Link>
            </Typography>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
