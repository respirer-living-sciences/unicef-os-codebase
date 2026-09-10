import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-H7NKGYPVHL");
};

export const trackPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};
