// app/api/get-ip/route.ts
export async function GET(request: Request) {
  // Check if the environment is development
  if (process.env.NEXT_PUBLIC_APP_ENV === "dev") {
    // In development, you can return a fixed local IP (like 127.0.0.1 or localhost)
    const currResponse = await fetch("https://api.ipify.org/?format=json");
    const res = await currResponse.json();

    return new Response(JSON.stringify(res), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Extract the IP address from the 'x-forwarded-for' header
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor
    ? forwardedFor.split(",")[0]
    : request.headers.get("host");

  // Return the IP in the response
  return new Response(JSON.stringify({ ip: ip || "IP not found" }), {
    headers: { "Content-Type": "application/json" },
  });
}
