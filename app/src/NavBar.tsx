"use client";
import React from "react";
import {useTheme} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

function NavBar() {
  const theme = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.palette.primary.main,
      }}
      className="h-16 mb-4 flex flex-1 flex-row text-center items-center font-bold">
      <img src={"/logo.png"} alt="logo" className="h-16" />
      <div className="flex flex-1"></div>
      <Link href={"/list"} className="mr-4">
        Openings
      </Link>
      <Link href={"/"} className="mr-4">
        Home
      </Link>
    </div>
  );
}

export default NavBar;
