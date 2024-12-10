export const revalidate = 60;
export async function GET() {
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

      return Response.json(await weatherResponse.json());
    } else {
      console.log("Could not fetch location data.");
    }
  } catch (error) {
    console.log("An error occurred:", error);
  }
}
