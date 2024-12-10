import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const fetchTechStacks = async () => {
  try {
    const { data: techStacks, error } = await supabase
      .from("techstacks")
      .select("*");
    if (error) {
      console.log("Could not fetch techstacks data.");
    } else {
      return techStacks;
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
    const data = await fetchTechStacks();
    // Return the response data
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
