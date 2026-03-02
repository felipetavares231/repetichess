// app/providers.tsx
"use client";

import React, {useState} from "react";
import {QueryClient, QueryClientProvider} from "react-query";
import {createTheme, ThemeProvider} from "@mui/material";
import {Geist, Geist_Mono} from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const theme = createTheme({
  palette: {
    primary: {main: "#9c2133", light: "#c94a5c", dark: "#6e1724"},
    secondary: {main: "#d4a853"},
    background: {default: "#121212", paper: "#1e1e1e"},
    mode: "dark",
  },
  typography: {
    fontFamily: "var(--font-geist-sans), Arial, sans-serif",
    h4: {fontWeight: 700, letterSpacing: "-0.02em"},
    h5: {fontWeight: 700, letterSpacing: "-0.01em"},
    h6: {fontWeight: 600},
    button: {textTransform: "none", fontWeight: 600},
  },
  shape: {borderRadius: 10},
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          fontSize: "0.925rem",
        },
        contained: {
          boxShadow: "0 2px 8px rgba(156,33,51,0.3)",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(156,33,51,0.4)",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease",
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        backdrop: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0,0,0,0.6)",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "0.8rem",
          borderRadius: 6,
        },
      },
    },
  },
});

export default function Providers({children}: {children: React.ReactNode}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </QueryClientProvider>
    </div>
  );
}
