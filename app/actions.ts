"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Provider } from "@supabase/supabase-js";

const DEFAULT_ROLE_UUID = '8b5be904-9f7b-4a68-b80c-28029036c427';

async function assignRoleToUser(userUuid: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('userRoles')
    .insert([
      {
        userUuid,
        roleUuid: DEFAULT_ROLE_UUID
      },
    ])
    .select()

  if (error) {
    console.error('Failed to assign role to user:', error);
    throw new Error('Failed to assign role to user');
  }
}

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });


  if (error) {
    console.error(error.code + " " + error.message);
    throw error;
  }
  // Assign role to the new user
  if (data.user) {
    try {
      await assignRoleToUser(data.user.id)
    } catch (error) {
      console.error('Failed to assign role:', error);
      // We don't throw here because the user is already created
      // We can handle this error separately if needed
    }
  }

  return redirect("/");
};

export const signInByProvider = async (provider: Provider) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    throw error;
  }

  return redirect(data.url);
}

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
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password?email=${encodeURIComponent(email)}`,
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
  const rePassword = formData.get("rePassword") as string;
  const email = formData.get("email") as string;

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return encodedRedirect(
      "error",
      "/reset-password",
      "Reset link has expired. Please request a new one."
    );
  }

  if (!password || !rePassword) {
    return encodedRedirect(
      "error",
      "/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== rePassword) {
    return encodedRedirect(
      "error",
      "/reset-password",
      "Passwords do not match"
    );
  }

  if (!email) {
    return encodedRedirect(
      "error",
      "/reset-password",
      "Invalid reset link"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/reset-password",
      error.message || "Password update failed"
    );
  }

  return encodedRedirect("success", "/access", "Password updated successfully");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/access");
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
