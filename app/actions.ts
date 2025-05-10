"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const fetchWeather = async () => {
  const defaultUrl =
    process.env.NEXT_PUBLIC_APP_ENV != "dev"
      ? `https://iamfuk.io.vn`
      : "http://localhost:3000";

  let coordinates = { lat: 21.02945, lon: 105.854444 }; // Hanoi Capital

  try {
    console.log("Fetching location data...");
    if (process.env.NEXT_PUBLIC_APP_ENV === "dev") {
      const locationResponse = await fetch("http://ip-api.com/json/");
      const locationData = await locationResponse.json();
      console.log("Location data:", locationData);
      const { lat, lon } = locationData;
      coordinates.lat = lat;
      coordinates.lon = lon;
    } else {
      await new Promise((r) => setTimeout(r, 4000));

      const locationResponse = await fetch(`${defaultUrl}/api/geo`);
      const locationData = await locationResponse.json();
      const location = locationData.city;
      console.log("Location data:", locationData);

      // get lat and long from city name
      const res = await fetch(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${location}&access_token=${process.env.MAPBOX_API_KEY}`
      );
      const data = await res.json();
      if (data && data.features.length > 0) {
        const feature = data.features[0];
        coordinates.lat = feature.geometry.coordinates[1];
        coordinates.lon = feature.geometry.coordinates[0];
      } else {
        console.error("cannot fetch location data from mapbox");
      }
    }

    const apiKey = process.env.WEATHERAPI_KEY;

    console.log("Fetching weather data...");
    const weatherResponse = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${coordinates.lat},${coordinates.lon}`
    );
    const weatherData = await weatherResponse.json();
    console.log("Location data:", weatherData);
    return weatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return {};
  }
};
