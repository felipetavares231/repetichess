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
        className="flex justify-center items-center min-h-screen flex-col"
        style={{backgroundColor: theme.palette.primary.main}}>
        <div
          className="p-16 border rounded-md border-white flex justify-center flex-col text-center"
          style={{
            backgroundColor: theme.palette.background.default,
          }}>
          <div className="flex flex-1 mb-2">
            <img src={"/logo.png"} alt="logo" />
          </div>
          <div className="mt-4">
            <Typography variant="h5" fontWeight={"bold"}>
              Rating
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
          <div className="mt-4">
            <Typography variant="h5" fontWeight={"bold"}>
              Coverage
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
          <div className="mt-8">
            <Button variant="contained" onClick={handleSavePreferences}>
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
