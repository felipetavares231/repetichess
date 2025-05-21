import {NextResponse} from "next/server";
import {db} from "../../lib/drizzle";
import {PreferencesTable} from "../../lib/PreferencesTable";
import {eq} from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();
  const {ownerId, rating, coverage} = body;

  try {
    const preferences = await db.query.PreferencesTable.findFirst({
      where: eq(PreferencesTable.ownerId, ownerId),
    });

    if (preferences) {
      await db
        .update(PreferencesTable)
        .set({
          rating: rating,
          coverage: coverage,
        })
        .where(eq(PreferencesTable.ownerId, ownerId));
    } else {
      await db.insert(PreferencesTable).values({
        ownerId: ownerId,
        coverage: coverage,
        rating: rating,
      });
    }

    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {error: "Failed to update/save preferences"},
      {status: 500},
    );
  }
}
