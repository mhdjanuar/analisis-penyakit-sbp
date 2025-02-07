import { db } from "../../utils/db";

export async function GET() {
  try {
    const [rows] = await db.execute("SELECT * FROM symptoms");

    return new Response(JSON.stringify(rows), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching symptoms" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
