"use client";
import {useTheme} from "@mui/material";
import {SignIn} from "@stackframe/stack";
import React from "react";

export default function SignInPage() {
  const theme = useTheme();

  return (
    <div
      className="flex justify-center items-center min-h-screen flex-col"
      style={{
        background: `radial-gradient(ellipse at top, ${theme.palette.primary.dark} 0%, ${theme.palette.background.default} 70%)`,
      }}>
      <div
        className="p-10 rounded-2xl flex justify-center flex-col text-center items-center"
        style={{
          backgroundColor: theme.palette.background.paper,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          maxWidth: 440,
          width: "100%",
        }}>
        <img
          src={"/logo.png"}
          alt="logo"
          className="mb-4"
          style={{maxWidth: 200}}
        />
        <SignIn automaticRedirect={false} />
      </div>
    </div>
  );
}
