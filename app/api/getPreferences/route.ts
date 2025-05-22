import {NextRequest, NextResponse} from "next/server";
import {db} from "../../lib/drizzle";
import {PreferencesTable} from "../../lib/PreferencesTable";
import {eq} from "drizzle-orm";

export async function GET(req: NextRequest) {
  const {searchParams} = new URL(req.url);

  const ownerId = searchParams.get("ownerId");

  if (!ownerId) return;

  try {
    const preferences = await db.query.PreferencesTable.findFirst({
      where: eq(PreferencesTable.ownerId, ownerId),
    });
    return NextResponse.json({preferences}, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: "Failed to insert board"}, {status: 500});
  }
}
