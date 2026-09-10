import { createTheme } from "@mui/material/styles";

const sharedTypography = {
  fontFamily: '"Inter", "Open Sans", "Helvetica", "Arial", sans-serif',
  button: {
    textTransform: "none",
    fontWeight: 600,
  },
  h1: { fontWeight: 700 },
  h2: { fontWeight: 700 },
  h3: { fontWeight: 600 },
  h4: { fontWeight: 600 },
  h5: { fontWeight: 600 },
  h6: { fontWeight: 600 },
};

const sharedShape = {
  borderRadius: 12,
};

const sharedPalette = {
  primary: {
    main: "#03C9D7",
    light: "#33D4DF",
    dark: "#028C96",
  },
  secondary: {
    main: "#10B981",
  },
};

export const getTheme = (mode = "light") => {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,
      ...sharedPalette,
      background: {
        default: isLight ? "#F8FAFC" : "#0F172A",
        paper: isLight ? "#FFFFFF" : "#1E293B",
      },
      text: {
        primary: isLight ? "#1E293B" : "#F1F5F9",
        secondary: isLight ? "#64748B" : "#94A3B8",
      },
      divider: isLight ? "rgba(226, 232, 240, 0.8)" : "rgba(51, 65, 85, 0.8)",
    },
    typography: sharedTypography,
    shape: sharedShape,
    components: {
      // ── Layout / Surface ────────────────────────────────────────────────
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            boxShadow: isLight
              ? "0px 4px 20px rgba(0, 0, 0, 0.03)"
              : "0px 4px 20px rgba(0, 0, 0, 0.2)",
            border: isLight
              ? "1px solid rgba(226, 232, 240, 0.8)"
              : "1px solid rgba(51, 65, 85, 0.8)",
            transition:
              "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: "none",
          },
        },
      },

      // ── Inputs / Selects (analytics) ─────────────────────────────────────
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            fontSize: "14px",
            borderRadius: "10px",
            backgroundColor: isLight ? "#f8f9fc" : "#1E293B",
            transition: "all 0.25s ease",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: isLight
                ? "rgba(0, 0, 0, 0.08)"
                : "rgba(255, 255, 255, 0.12)",
              transition: "all 0.25s ease",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(3, 201, 215, 0.4)",
            },
            "&.Mui-focused": {
              backgroundColor: isLight ? "#fff" : "#263548",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#03C9D7",
                borderWidth: "1.5px",
              },
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: "14px",
            color: isLight ? "#8b95a5" : "#94A3B8",
            fontWeight: 500,
            "&.Mui-focused": {
              color: "#03C9D7",
              fontWeight: 600,
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          icon: {
            color: isLight ? "#8b95a5" : "#94A3B8",
            transition: "transform 0.2s ease",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: "14px",
            borderRadius: "6px",
            margin: "2px 6px",
            transition: "all 0.15s ease",
            "&:hover": {
              backgroundColor: "rgba(3, 201, 215, 0.08)",
            },
            "&.Mui-selected": {
              backgroundColor: "rgba(3, 201, 215, 0.12)",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "rgba(3, 201, 215, 0.18)",
              },
            },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: "12px",
            boxShadow: isLight
              ? "0 8px 24px rgba(0, 0, 0, 0.08)"
              : "0 8px 24px rgba(0, 0, 0, 0.3)",
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          paper: {
            borderRadius: "12px",
            boxShadow: isLight
              ? "0 8px 24px rgba(0, 0, 0, 0.08)"
              : "0 8px 24px rgba(0, 0, 0, 0.3)",
          },
          option: {
            fontSize: "14px",
            borderRadius: "6px",
            margin: "2px 6px",
            transition: "all 0.15s ease",
            '&[aria-selected="true"]': {
              backgroundColor: "rgba(3, 201, 215, 0.12) !important",
              fontWeight: 600,
            },
            "&:hover": {
              backgroundColor: "rgba(3, 201, 215, 0.08) !important",
            },
          },
        },
      },

      // ── Interactive ──────────────────────────────────────────────────────
      MuiButton: {
        styleOverrides: {
          root: {
            fontSize: "14px",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            letterSpacing: "0.3px",
            transition: "all 0.25s ease",
            boxShadow: isLight
              ? "0 2px 8px rgba(3, 201, 215, 0.25)"
              : "0 2px 8px rgba(3, 201, 215, 0.15)",
            "&:hover": {
              boxShadow: isLight
                ? "0 4px 16px rgba(3, 201, 215, 0.35)"
                : "0 4px 16px rgba(3, 201, 215, 0.25)",
              transform: "translateY(-1px)",
            },
          },
        },
      },

      // ── Feedback ─────────────────────────────────────────────────────────
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
          },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: {
            backgroundColor: isLight
              ? "rgba(0, 0, 0, 0.08)"
              : "rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
  });
};

/** @deprecated Use getTheme(mode) instead */
export const modernTheme = getTheme("light");
