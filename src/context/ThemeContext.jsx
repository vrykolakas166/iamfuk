import React, { createContext, useContext, useState, useEffect } from "react";
import RainEffect from "../components/effects/RainEffect";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const [weather, setWeather] = useState({});

  const getWeatherData = async () => {
    try {
      // Get user location based on IP
      const locationResponse = await fetch(
        import.meta.env.VITE_APP_ENV === "dev"
          ? "http://ip-api.com/json/"
          : `https://api.ipapi.com/api/check?access_key=${
              import.meta.env.VITE_IPAPI_KEY
            }`
      );
      const locationData = await locationResponse.json();

      if (locationData) {
        let { latitude, longitude } = locationData;
        const apiKey = import.meta.env.VITE_WEATHERAPI_KEY;

        // Fetch weather data using coordinates
        const weatherResponse = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`
        );
        const weatherData = await weatherResponse.json();
        setWeather(weatherData); // Set the weather data in state
      } else {
        console.log("Could not fetch location data.");
      }
    } catch (error) {
      console.log("An error occurred:", error);
    }
  };

  useEffect(() => {
    getWeatherData(); // Call the async function inside useEffect
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, weather }}>
      <RainEffect />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
