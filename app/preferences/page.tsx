"use client";
import {
  Button,
  createTheme,
  FormControl,
  FormControlLabel,
  FormLabel,
  Menu,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
} from "@mui/material";
import {OAuthButton, SignUp, useUser} from "@stackframe/stack";
import Image from "next/image";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {useQuery} from "react-query";
import NavBar from "../src/NavBar";

export default function PreferencesPage() {
  const [rating, setRating] = useState("Beginner");
  const [coverage, setCoverage] = useState("Solid");

  const router = useRouter();

  const theme = useTheme();

  const user = useUser();

  const {data, isLoading} = useQuery({
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

  const handleSavePreferences = async () => {
    const response = await fetch("/api/updatePreferences", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        ownerId: user?.id,
        rating: rating,
        coverage: coverage,
      }),
    });

    if (response.ok) {
      router.push("/");
    }
  };

  useEffect(() => {
    if (data?.rating && data?.coverage) {
      setRating(data?.rating);
      setCoverage(data?.coverage);
    }
  }, [data]);

  return (
    <div>
      <NavBar />
      <div
        className="flex justify-center items-center py-16 flex-col"
        style={{minHeight: "calc(100vh - 72px)"}}>
        <div
          className="p-10 rounded-2xl flex justify-center flex-col text-center items-center"
          style={{
            backgroundColor: theme.palette.background.paper,
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            maxWidth: 500,
            width: "100%",
          }}>
          <img
            src={"/logo.png"}
            alt="logo"
            className="mb-4"
            style={{maxWidth: 180}}
          />
          <div className="mt-4 mb-1">
            <Typography variant="h5" fontWeight="bold">
              Rating
            </Typography>
            <Typography
              variant="body2"
              sx={{color: "rgba(255,255,255,0.45)", mt: 0.5}}>
              Select your skill level
            </Typography>
          </div>
          <FormControl className="items-center flex">
            <RadioGroup
              row
              value={rating}
              name="rating"
              onChange={(e) => setRating(e.target.value)}>
              <FormControlLabel
                value="Beginner"
                control={<Radio />}
                label="Beginner"
              />
              <FormControlLabel
                value="Intermediate"
                control={<Radio />}
                label="Intermediate"
              />
              <FormControlLabel
                value="Advanced"
                control={<Radio />}
                label="Advanced"
              />
            </RadioGroup>
          </FormControl>
          <div
            className="w-full my-4"
            style={{
              height: 1,
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div className="mb-1">
            <Typography variant="h5" fontWeight="bold">
              Coverage
            </Typography>
            <Typography
              variant="body2"
              sx={{color: "rgba(255,255,255,0.45)", mt: 0.5}}>
              How many variations to study
            </Typography>
          </div>
          <FormControl className="flex items-center">
            <RadioGroup
              row
              value={coverage}
              name="coverage"
              onChange={(e) => setCoverage(e.target.value)}>
              <FormControlLabel
                value="Basic"
                control={<Radio />}
                label="Basic"
              />
              <FormControlLabel
                value="Solid"
                control={<Radio />}
                label="Solid"
              />
              <FormControlLabel
                value="Strong"
                control={<Radio />}
                label="Strong"
              />
            </RadioGroup>
          </FormControl>
          <div className="mt-6 w-full">
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSavePreferences}>
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
