import {NextRequest, NextResponse} from "next/server";
import {db} from "../../lib/drizzle";
import {BoardTable} from "../../lib/BoardTable";
import {eq} from "drizzle-orm";

export async function GET(req: NextRequest) {
  const {searchParams} = new URL(req.url);

  const ownerId = searchParams.get("ownerId");

  if (!ownerId) return;

  try {
    const result = await db.query.BoardTable.findMany({
      where: eq(BoardTable.ownerId, ownerId),
    });

    return NextResponse.json({result}, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: "Failed to insert board"}, {status: 500});
  }
}
