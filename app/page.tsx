"use client";
import {Button, createTheme, useTheme} from "@mui/material";
import {useUser} from "@stackframe/stack";
import Image from "next/image";
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

      if (!response.ok) {
        throw new Error("Failed to get preferences");
      }

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
      style={{backgroundColor: theme.palette.primary.main}}>
      <img src={"/logo.png"} alt="logo" />
      <Button
        variant="contained"
        onClick={() => router.push("/learn")}
        disabled={isLoading}>
        Start Learning
      </Button>
    </div>
  );
}
