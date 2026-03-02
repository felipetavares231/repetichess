"use client";
import {Button, Typography, useTheme} from "@mui/material";
import {useUser} from "@stackframe/stack";
import {useRouter} from "next/navigation";
import React, {useEffect} from "react";
import {useQuery} from "react-query";

export default function Home() {
  const router = useRouter();
  const theme = useTheme();
  const user = useUser();

  const {data: preferences, isLoading} = useQuery({
    queryKey: ["preferences", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const params = new URLSearchParams();
      params.set("ownerId", user.id);
      const response = await fetch(`/api/getPreferences?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to get preferences");
      const json = await response.json();
      return json.preferences;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) {
      router.push("/signup");
    } else if (!isLoading && !preferences) {
      router.push("/preferences");
    }
  }, [user, isLoading, preferences, router]);

  return (
    <div
      className="flex justify-center items-center min-h-screen flex-col"
      style={{
        background: `radial-gradient(ellipse at top, ${theme.palette.primary.dark} 0%, ${theme.palette.background.default} 70%)`,
      }}>
      <div className="flex flex-col items-center gap-6">
        <img
          src={"/logo.png"}
          alt="logo"
          className="drop-shadow-2xl"
          style={{maxWidth: 280}}
        />
        <Typography
          variant="body1"
          sx={{
            color: "rgba(255,255,255,0.55)",
            maxWidth: 340,
            textAlign: "center",
            lineHeight: 1.6,
          }}>
          Master chess openings through spaced repetition
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push("/learn")}
          disabled={isLoading}
          sx={{mt: 1, px: 5, py: 1.5, fontSize: "1rem"}}>
          Start Learning
        </Button>
      </div>
    </div>
  );
}
