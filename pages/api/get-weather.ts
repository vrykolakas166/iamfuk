// File: pages/api/get-weather.ts
import type { NextApiRequest, NextApiResponse } from "next";

const fetchWeatherData = async (): Promise<any> => {
  try {
    // Get user location based on IP
    const locationResponse = await fetch(
      process.env.NEXT_PUBLIC_APP_ENV === "dev"
        ? "http://ip-api.com/json/"
        : `https://pro.ipapi.org/api_json/one.php?key=${process.env.IPAPI_KEY}`
    );
    const locationData = await locationResponse.json();

    if (locationData) {
      let { lat, lon } = locationData;
      const apiKey = process.env.WEATHERAPI_KEY;
      // Fetch weather data using coordinates
      const weatherResponse = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`
      );
      const weatherData = await weatherResponse.json();

      return weatherData;
    } else {
      console.log("Could not fetch location data.");
    }
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check HTTP method (GET, POST, etc.)
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" }); // 405 = Method Not Allowed
  }

  try {
    const data = await fetchWeatherData();

    // Return the response data
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
