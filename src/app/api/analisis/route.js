import { db } from "../../utils/db";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const symptomIds = url.searchParams.get("symptoms");

    if (!symptomIds) {
      return new Response(JSON.stringify({ error: "No symptoms provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const [rows] = await db.execute(
      `SELECT r.disease_id, d.name, d.solution, COUNT(r.disease_id) AS frequency
      FROM rules AS r
      INNER JOIN symptoms AS s ON s.id = r.symptom_id
      INNER JOIN diseases AS d ON d.id = r.disease_id
      WHERE r.symptom_id IN (${symptomIds})
      GROUP BY r.disease_id, d.name, d.solution
      ORDER BY frequency DESC
      LIMIT 1`
    );

    return new Response(JSON.stringify(rows.length ? rows[0] : {}), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching analysis" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
