"use client";
import { Button, createTheme, Typography, useTheme } from "@mui/material";
import { OAuthButton, SignIn, SignUp } from "@stackframe/stack";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function SignInPage() {
  const router = useRouter();

  const theme = useTheme();

  return (
    <div
      className="flex justify-center items-center min-h-screen flex-col"
      style={{ backgroundColor: theme.palette.primary.main }}
    >
      <div
        className="p-16 border rounded-md border-white flex justify-center flex-col text-center"
        style={{
          backgroundColor: theme.palette.background.default,
        }}
      >
        <div className="flex flex-1 mb-2">
          <img src={"/logo.png"} alt="logo" />
        </div>
        <SignIn automaticRedirect={false} />
      </div>
    </div>
  );
}
