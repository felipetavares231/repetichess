"use client";
import React from "react";
import {useTheme} from "@mui/material";
import Link from "next/link";
import {UserButton} from "@stackframe/stack";
import {usePathname} from "next/navigation";

function NavBar() {
  const theme = useTheme();
  const pathname = usePathname();

  const links = [
    {href: "/list", label: "Openings"},
    {href: "/preferences", label: "Preferences"},
    {href: "/", label: "Home"},
  ];

  return (
    <nav
      style={{
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
      }}
      className="h-14 mb-4 flex w-full flex-row items-center px-2 sticky top-0 z-50">
      <Link href="/" className="flex items-center h-14 shrink-0">
        <img src={"/logo.png"} alt="logo" className="h-14" />
      </Link>
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
              style={{
                color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                backgroundColor: isActive ? "rgba(255,255,255,0.12)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              }}>
              {link.label}
            </Link>
          );
        })}
        <div className="flex items-center ml-3 pl-3 border-l border-white/15">
          <UserButton />
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
