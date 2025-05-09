import { Button, createTheme, useTheme } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

export default function Home() {
  const router = useRouter();

  const theme = useTheme();

  return (
    <div
      className="flex justify-center items-center min-h-screen flex-col"
      style={{ backgroundColor: theme.palette.primary.main }}
    >
      <Image src={"../public/repetichesslogo3.png"} alt="logo" />
      <Button variant="contained" onClick={() => router.push("/learn")}>
        Start Learning
      </Button>
    </div>
  );
}
