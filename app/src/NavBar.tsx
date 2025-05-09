import React from "react";
import { useTheme } from "@mui/material";
import Image from "next/image";

function NavBar() {
  const theme = useTheme();
  return (
    <div
      style={{
        backgroundColor: theme.palette.primary.main,
      }}
      className="h-16 mb-4"
    >
      <Image
        src={"../../public/repetichesslogo3.png"}
        alt="logo"
        className="h-16"
      />
    </div>
  );
}

export default NavBar;
